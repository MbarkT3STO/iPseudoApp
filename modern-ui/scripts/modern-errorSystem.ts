// Minimal ErrorSystem: parse errors, extract line/column, display and mark editor
(function(){
    interface ErrorContext {
        before: string;
        errorLine: string;
        after: string;
        line: number;
        column: number;
    }

    interface ParsedError {
        line: number;
        column: number;
        message: string;
        name: string;
        stack: string;
        getContext: (fullCode?: string, contextLines?: number) => ErrorContext | null;
    }

    class ErrorSystem {
        private _decorations?: string[];

        analyze(errorLike: Error | any, code?: string): ParsedError {
            // Accept either Error object or a structured object {name,message,stack}
            const err = errorLike instanceof Error ? errorLike : Object.assign(new Error(errorLike.message || String(errorLike)), errorLike);
            const stack = err.stack || '';
            const parsed: ParsedError = { 
                line: 0, 
                column: 0, 
                message: err.message || String(err), 
                name: err.name || 'Error', 
                stack,
                getContext: (fullCode?: string, contextLines: number = 2) => {
                    if (!fullCode) return null;
                    const lines = fullCode.split('\n');
                    const idx = Math.max(0, parsed.line - 1);
                    const start = Math.max(0, idx - contextLines);
                    const end = Math.min(lines.length, idx + contextLines + 1);
                    return {
                        before: lines.slice(start, idx).join('\n'),
                        errorLine: lines[idx] || '',
                        after: lines.slice(idx + 1, end).join('\n'),
                        line: parsed.line,
                        column: parsed.column
                    };
                }
            };

            // Try to extract (file:line:col) from stack traces
            const re = /:(\d+):(\d+)\)?$/m;
            const m = stack.match(re);
            if (m) {
                parsed.line = parseInt(m[1], 10);
                parsed.column = parseInt(m[2], 10);
            } else {
                // Try messages like "at line X, column Y" or "line X:Y"
                const m2 = parsed.message.match(/line\s*(\d+)(?::(\d+))?/i) || parsed.message.match(/:(\d+):(\d+)/);
                if (m2) {
                    parsed.line = parseInt(m2[1] || m2[0], 10) || 0;
                    parsed.column = parseInt(m2[2] || '0', 10) || 0;
                }
            }

            // Map line 0 to unknown
            if (!parsed.line || isNaN(parsed.line)) parsed.line = 0;
            if (!parsed.column || isNaN(parsed.column)) parsed.column = 0;

            return parsed;
        }

        formatForConsole(info: ParsedError, context: ErrorContext | null = null): string {
            let out = `${info.name}: ${info.message}`;
            if (info.line) out += ` (line ${info.line}${info.column ? ',' + info.column : ''})`;
            if (context) {
                out += '\n--- Context ---\n';
                if (context.before) out += context.before + '\n';
                out += `> ${context.errorLine}\n`;
                if (context.after) out += context.after + '\n';
            }
            if (info.stack) out += '\n' + info.stack;
            return out;
        }

        applyEditorMarkers(editor: any, info: ParsedError): void {
            if (!editor || !info || !info.line) return;
            try {
                const range = new (window as any).monaco.Range(info.line, Math.max(1, info.column || 1), info.line, Math.max(1, info.column || 1));
                const dec = [{ 
                    range, 
                    options: { 
                        isWholeLine: true, 
                        className: 'severity-high', 
                        glyphMarginClassName: 'error-glyph', 
                        hoverMessage: { value: info.message } 
                    } 
                }];
                if (this._decorations) this._decorations = editor.deltaDecorations(this._decorations, dec);
                else this._decorations = editor.deltaDecorations([], dec);
            } catch(e) { 
                 
            }
        }
    }

    (window as any).ErrorSystem = new ErrorSystem();
})();
