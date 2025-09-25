// Advanced Error Management System for iPseudo

interface ErrorRecoveryStrategy {
    [key: string]: (code: string, line: number, name?: string) => string;
}

interface ErrorAnalysis {
    type: string;
    message: string;
    line: number;
    column: number;
    context: ErrorContext | null;
    suggestion: string | null;
    severity: string;
    timestamp: string;
}

interface ErrorContext {
    before: string[];
    error: string;
    after: string[];
    lineNo: number;
}

interface Decoration {
    message: string;
    line: number;
    column: number;
    type?: string;
    phase?: string;
    suggestion?: string;
}

class ErrorManager {
    private errorDecorations: string[] = [];
    private diagnostics = new Map<string, any>();
    private lineMap = new Map<number, any>();
    private errorHistory: ErrorAnalysis[] = [];
    private recoveryStrategies = new Map<string, ErrorRecoveryStrategy>();

    constructor() {
        this.initRecoveryStrategies();
    }

    // Initialize error recovery strategies
    initRecoveryStrategies(): void {
        this.recoveryStrategies.set('SyntaxError', {
            'Unexpected token': (code: string, line: number) => this.suggestSyntaxFix(code, line),
            'Unexpected end of input': () => 'Check for missing closing brackets or parentheses',
            'Invalid or unexpected token': (code: string, line: number) => this.suggestTokenFix(code, line)
        });

        this.recoveryStrategies.set('ReferenceError', {
            'is not defined': (code: string, line: number, name?: string) => this.suggestVariableFix(code, line, name || '')
        });
    }

    // Detailed error analysis with context
    analyzeError(error: Error, code: string): ErrorAnalysis {
        const analysis: ErrorAnalysis = {
            type: error.name || 'Error',
            message: error.message,
            line: this.extractLineNumber(error),
            column: this.extractColumn(error),
            context: this.getErrorContext(code, this.extractLineNumber(error)),
            suggestion: this.getRecoverySuggestion(error, code),
            severity: this.calculateSeverity(error),
            timestamp: new Date().toISOString()
        };

        this.errorHistory.push(analysis);
        return analysis;
    }

    // Extract line number from error
    extractLineNumber(error: Error): number {
        const match = error.stack?.match(/\(.*:(\d+):(\d+)\)/) ||
                     error.message.match(/:(\d+):(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    // Extract column from error
    extractColumn(error: Error): number {
        const match = error.stack?.match(/\(.*:(\d+):(\d+)\)/) ||
                     error.message.match(/:(\d+):(\d+)/);
        return match ? parseInt(match[2], 10) : 0;
    }

    // Get detailed context around the error
    getErrorContext(code: string, lineNo: number, contextLines: number = 2): ErrorContext | null {
        if (!code || lineNo <= 0) return null;

        const lines = code.split('\n');
        const start = Math.max(0, lineNo - contextLines - 1);
        const end = Math.min(lines.length, lineNo + contextLines);

        return {
            before: lines.slice(start, lineNo - 1),
            error: lines[lineNo - 1],
            after: lines.slice(lineNo, end),
            lineNo: lineNo
        };
    }

    // Get recovery suggestion based on error type and message
    getRecoverySuggestion(error: Error, code: string): string | null {
        const strategies = this.recoveryStrategies.get(error.name);
        if (!strategies) return null;

        for (const [pattern, handler] of Object.entries(strategies)) {
            if (error.message.includes(pattern)) {
                return handler(code, this.extractLineNumber(error));
            }
        }
        return null;
    }

    // Suggest fix for syntax errors
    suggestSyntaxFix(code: string, line: number): string {
        const lineContent = code.split('\n')[line - 1];
        if (!lineContent) return 'Check syntax near this line';

        // Common syntax error patterns and their fixes
        const patterns = [
            { regex: /\(\s*\)/, suggestion: 'Empty parentheses - add arguments or remove them' },
            { regex: /[{[(][^}\])]*$/, suggestion: 'Missing closing bracket/parenthesis' },
            { regex: /^\s*[}\])]/, suggestion: 'Unexpected closing bracket/parenthesis' },
            { regex: /:\s*$/, suggestion: 'Missing block after colon' },
            { regex: /\s+[-+*/]\s*$/, suggestion: 'Incomplete arithmetic expression' }
        ];

        for (const { regex, suggestion } of patterns) {
            if (regex.test(lineContent)) {
                return suggestion;
            }
        }

        return 'Check syntax near this line';
    }

    // Suggest fix for invalid tokens
    suggestTokenFix(code: string, line: number): string {
        const lineContent = code.split('\n')[line - 1];
        if (!lineContent) return 'Check for invalid characters or symbols';

        // Common token error patterns
        const patterns = [
            { regex: /["']([^"']*["']){2,}/, suggestion: 'Multiple string literals - check quotation marks' },
            { regex: /[^a-zA-Z0-9_$]\\[^nrt"'\\]/, suggestion: 'Invalid escape sequence' },
            { regex: /[^a-zA-Z0-9_$][0-9]+[a-zA-Z_$]+/, suggestion: 'Invalid numeric literal' }
        ];

        for (const { regex, suggestion } of patterns) {
            if (regex.test(lineContent)) {
                return suggestion;
            }
        }

        return 'Check for invalid characters or symbols';
    }

    // Suggest fix for undefined variables
    suggestVariableFix(code: string, line: number, varName: string): string {
        const similarNames = this.findSimilarVariables(code, varName);

        if (similarNames.length > 0) {
            return `Did you mean: ${similarNames.join(' or ')}?`;
        }

        return 'Variable may need to be declared first';
    }

    // Find similar variable names using Levenshtein distance
    findSimilarVariables(code: string, target: string): string[] {
        const variables = new Set<string>();
        const varRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
        let match;

        while ((match = varRegex.exec(code)) !== null) {
            variables.add(match[0]);
        }

        return Array.from(variables)
            .filter(name => this.levenshteinDistance(name, target) <= 2)
            .slice(0, 3);
    }

    // Calculate Levenshtein distance between strings
    levenshteinDistance(a: string, b: string): number {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(0));

        for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + cost
                );
            }
        }

        return matrix[b.length][a.length];
    }

    // Calculate error severity
    calculateSeverity(error: Error): string {
        if (error.name === 'SyntaxError') return 'high';
        if (error.name === 'ReferenceError') return 'medium';
        if (error.name === 'TypeError') return 'medium';
        return 'low';
    }

    // Format error for display
    formatError(analysis: ErrorAnalysis): string {
        let output = `Error: ${analysis.message}\n`;
        output += `Type: ${analysis.type}\n`;
        output += `Line: ${analysis.line}, Column: ${analysis.column}\n\n`;

        if (analysis.context) {
            output += 'Context:\n';
            if (analysis.context.before.length) {
                output += analysis.context.before.map(line => `  ${line}\n`).join('');
            }
            output += `> ${analysis.context.error}\n`;
            if (analysis.context.after.length) {
                output += analysis.context.after.map(line => `  ${line}\n`).join('');
            }
        }

        if (analysis.suggestion) {
            output += `\nSuggestion: ${analysis.suggestion}\n`;
        }

        return output;
    }

    // Clear all error decorations
    clearDecorations(editor: any): void {
        if (editor) {
            this.errorDecorations = editor.deltaDecorations(this.errorDecorations, []);
        }
    }

    // Update editor decorations with error markers
    updateDecorations(editor: any, errors: Decoration[]): void {
        if (!editor) return;

        const decorations = errors.map(error => ({
            range: new (window as any).monaco.Range(
                error.line,
                error.column || 1,
                error.line,
                error.column || 1
            ),
            options: {
                isWholeLine: true,
                className: `severity-${this.calculateSeverityFromDecoration(error)}`,
                glyphMarginClassName: 'error-glyph',
                hoverMessage: { value: this.formatErrorFromDecoration(error) }
            }
        }));

        this.errorDecorations = editor.deltaDecorations(this.errorDecorations, decorations);
    }

    private calculateSeverityFromDecoration(error: Decoration): string {
        if (error.type === 'SyntaxError') return 'high';
        if (error.type === 'ReferenceError') return 'medium';
        if (error.type === 'TypeError') return 'medium';
        return 'low';
    }

    private formatErrorFromDecoration(error: Decoration): string {
        let output = `Error: ${error.message}\n`;
        output += `Line: ${error.line}, Column: ${error.column}\n`;
        if (error.suggestion) {
            output += `\nSuggestion: ${error.suggestion}\n`;
        }
        return output;
    }
}

// Export the error manager
(window as any).ErrorManager = ErrorManager;
