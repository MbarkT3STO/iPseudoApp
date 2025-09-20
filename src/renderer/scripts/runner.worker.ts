// Worker: receives { code } message, optionally translates simple pseudocode to JS,
// runs it inside an async function with print/input provided, and enforces a timeout.
// It preserves the message protocol: stdout/stderr/error/done/input-request.

interface WorkerMessage {
    code: string;
    timeout?: number;
}

interface TranslationResult {
    code: string;
    mapping: MappingEntry[];
}

interface MappingEntry {
    srcLine: number;
    srcText: string;
}

interface ValidationIssue {
    line: number;
    text: string;
    message: string;
}

interface ErrorObject {
    name?: string;
    message?: string;
    stack?: string;
    phase?: string;
    issues?: ValidationIssue[];
    line?: number;
    column?: number;
    originalText?: string;
    formatted?: boolean;
}

interface BlockInfo {
    type: string;
    var?: string;
    line: number;
    indent: number;
}

function isLikelyPseudo(src: string): boolean {
    if (!src) return false;
    const lowered = src.toLowerCase();
    return /\bprint\b|\bvar\b|\bfor\b|\bendfor\b/.test(lowered);
}

function validatePseudo(src: string): ValidationIssue[] {
    const lines = src.split(/\r?\n/);
    const issues: ValidationIssue[] = [];
    const blockStack: BlockInfo[] = []; // Tracks for/if/while blocks

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const lineNum = i + 1;
        const t = raw.trim();
        if (!t || t.startsWith('#')) continue;
        
        const lower = t.toLowerCase();
        const indent = raw.match(/^\s*/)![0].length;
        
        // Check for proper indentation if inside a block
        if (blockStack.length > 0 && indent <= blockStack[blockStack.length - 1].indent) {
            const expectedIndent = blockStack[blockStack.length - 1].indent + 2;
            if (indent < expectedIndent && !lower.match(/^(end(if|for|while)|else|elif)/)) {
                issues.push({
                    line: lineNum,
                    text: raw,
                    message: `Inconsistent indentation. Expected at least ${expectedIndent} spaces for block content`
                });
            }
        }

        // Check for common pseudo-code structures
        if (lower.startsWith('for ')) {
            const m = t.match(/^for\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?)\s+to\s+(.+?)(?:\s+step\s+([-+]?\d+))?\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed for-loop. Expected: for <var> = <start> to <end> [step <increment>]' 
                });
            } else {
                blockStack.push({ type: 'for', var: m[1], line: lineNum, indent });
            }
            continue;
        }
        
        if (lower.startsWith('if ')) {
            const m = t.match(/^if\s*\((.+)\)\s*$/i) || t.match(/^if\s+(.+?)\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed if statement. Expected: if (condition) or if condition' 
                });
            } else {
                blockStack.push({ type: 'if', line: lineNum, indent });
            }
            continue;
        }
        
        if (lower.startsWith('while ')) {
            const m = t.match(/^while\s*\((.+)\)\s*$/i) || t.match(/^while\s+(.+?)\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed while loop. Expected: while (condition) or while condition' 
                });
            } else {
                blockStack.push({ type: 'while', line: lineNum, indent });
            }
            continue;
        }
        
        if (lower === 'endfor' || lower === 'endif' || lower === 'endwhile') {
            if (blockStack.length === 0) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: `Unexpected ${lower} (no matching block)` 
                });
                continue;
            }
            
            const expectedEnd = 'end' + blockStack[blockStack.length - 1].type;
            if (lower !== expectedEnd) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: `Expected ${expectedEnd} but found ${lower}` 
                });
            } else {
                blockStack.pop();
            }
            continue;
        }
        
        if (lower.startsWith('var ')) {
            const m = t.match(/^var\s+([a-zA-Z_$][\w$]*)\s*(?:=\s*(.+))?$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed var declaration. Expected: var <name> [= <value>]' 
                });
            }
            continue;
        }
        
        if (lower.startsWith('print ')) {
            const m = t.match(/^print\s+(.+)$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed print statement. Expected: print <expression>' 
                });
            }
            continue;
        }
        
        // Check for common errors
        if (t.includes('=') && !t.includes('==') && !t.includes('!=') && !t.includes('>=') && !t.includes('<=')) {
            if (t.match(/\bif\s*\(?=.*=.*\)/i) || t.match(/\bwhile\s*\(?=.*=.*\)/i)) {
                issues.push({
                    line: lineNum,
                    text: raw,
                    message: 'Possible assignment (=) in condition. Did you mean to use == for comparison?'
                });
            }
        }
    }
    
    // Check for unclosed blocks
    blockStack.forEach(block => {
        issues.push({
            line: block.line,
            text: lines[block.line - 1],
            message: `Unclosed ${block.type} block. Add ${'end' + block.type} to close it.`
        });
    });
    
    return issues;
}

function translatePseudoToJs(src: string): TranslationResult {
    const lines = src.replace(/\t/g, '    ').split(/\r?\n/);
    const out: string[] = [];
    const mapping: MappingEntry[] = []; // mapping: generated JS line index (1-based) -> { srcLine, srcText }
    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const srcLineNum = i + 1;
        let line = raw.trim();
        if (!line) continue;
        // comments
        if (line.startsWith('#')) { 
            out.push('// ' + line.slice(1).trim()); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // var declaration: var x = expr
        let m = line.match(/^var\s+([a-zA-Z_$][\w$]*)\s*=\s*(.*)$/i);
        if (m) { 
            out.push(`let ${m[1]} = ${m[2]};`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // print statements: print arg1, arg2
        m = line.match(/^print\s+(.+)$/i);
        if (m) { 
            out.push(`print(${m[1]});`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // for loops: for i = 1 to n
        m = line.match(/^for\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?)\s+to\s+(.+)$/i);
        if (m) { 
            out.push(`for (let ${m[1]} = ${m[2]}; ${m[1]} <= ${m[3]}; ${m[1]}++) {`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // endfor
        if (/^endfor$/i.test(line)) { 
            out.push('}'); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // fallback: ensure semicolon
        if (!line.endsWith(';')) line = line + ';';
        out.push(line);
        mapping.push({ srcLine: srcLineNum, srcText: raw });
    }
    return { code: out.join('\n'), mapping };
}

self.onmessage = function(e: MessageEvent<WorkerMessage>) {
    const msg = e.data;
    if (!(msg && typeof msg.code === 'string')) return;
    try {
        const postStdout = (text: string) => self.postMessage({ type: 'stdout', text: String(text) });
        const postStderr = (text: string) => self.postMessage({ type: 'stderr', text: String(text) });
        const postError = (errObj: ErrorObject) => self.postMessage({ type: 'error', error: errObj });
        const postDone = () => self.postMessage({ type: 'done' });

        const print = function(...args: any[]) { postStdout(args.join(' ')); };
        const input = function(promptText?: string): Promise<string> {
                const id = Math.random().toString(36).slice(2);
                return new Promise((resolve) => {
                    function handler(ev: MessageEvent) {
                        if (ev.data && ev.data.type === 'input-response' && ev.data.id === id) {
                            self.removeEventListener('message', handler);
                            resolve(ev.data.value || '');
                        }
                    }
                    self.addEventListener('message', handler);
                    self.postMessage({ type: 'input-request', id, prompt: promptText || 'Input:' });
                });
        };

        let source = msg.code;
        let mapping: MappingEntry[] | null = null;
        if (isLikelyPseudo(source)) {
            // run validator first and return precise validation errors if any
            const issues = validatePseudo(source);
            if (issues && issues.length) {
                postError({ name: 'ValidationError', message: 'Pseudocode validation failed', issues, phase: 'validation' });
                return;
            }
            try {
                const translated = translatePseudoToJs(source);
                source = translated.code;
                mapping = translated.mapping;
            } catch (tErr: any) {
                postError({ 
                    name: 'TranslationError', 
                    message: String(tErr && tErr.message ? tErr.message : tErr), 
                    stack: (tErr && tErr.stack) || '', 
                    phase: 'translation' 
                });
                return;
            }
        }

        const asyncWrapper = `(async function(print, input){\n${source}\n})(print, input);`;

        // syntax check
        try {
            new Function(source);
        } catch (syntaxError: any) {
            // try to map the error to original pseudocode line if mapping exists
            let original: MappingEntry | null = null;
            let lineNumber = 0;
            let columnNumber = 0;
            
            // Extract line and column numbers from the error if available
            const lineMatch = String(syntaxError.stack || syntaxError.message || '').match(/(\d+):(\d+)/);
            if (lineMatch) {
                lineNumber = parseInt(lineMatch[1], 10) || 0;
                columnNumber = parseInt(lineMatch[2], 10) || 0;
                
                // Adjust for the wrapper function if needed
                if (lineNumber > 1) {
                    lineNumber -= 1; // Account for the wrapper function line
                }
                
                if (mapping && mapping.length >= lineNumber && lineNumber > 0) {
                    original = mapping[lineNumber - 1];
                }
            }
            
            // Create a more detailed error message
            let errorMessage = `❌ ${syntaxError.name || 'Syntax Error'}: ${syntaxError.message || 'Invalid syntax'}`;
            
            if (original) {
                errorMessage += `\n\n  At line ${original.srcLine}:`;
                errorMessage += `\n  ${original.srcText}`;
                
                // Add a pointer to the error location if we have column info
                if (columnNumber > 0) {
                    const pointer = ' '.repeat(2 + columnNumber) + '^';
                    errorMessage += `\n  ${pointer}`;
                }
                
                // Add context if available
                if (original.srcLine > 1) {
                    const contextLine = mapping![lineNumber - 2]; // Previous line
                    if (contextLine) {
                        errorMessage += `\n\n  Previous line (${contextLine.srcLine}):`;
                        errorMessage += `\n  ${contextLine.srcText}`;
                    }
                }
                
                // Add suggestions for common errors
                if (syntaxError.message.includes('Unexpected token') || 
                    syntaxError.message.includes('Missing')) {
                    errorMessage += '\n\n💡 Tip: Check for missing or mismatched brackets, parentheses, or quotes.';
                } else if (syntaxError.message.includes('Unexpected end of input')) {
                    errorMessage += '\n\n💡 Tip: You might be missing a closing bracket, parenthesis, or quote.';
                }
            }
            
            postError({ 
                name: 'SyntaxError', 
                message: errorMessage, 
                stack: syntaxError.stack, 
                line: original ? original.srcLine : lineNumber,
                column: columnNumber,
                originalText: original ? original.srcText : undefined, 
                phase: 'syntax',
                formatted: true // Flag to indicate this is a formatted error message
            });
            return;
        }
        
        let finished = false;
        const TIMEOUT_MS = typeof msg.timeout === 'number' ? Math.max(1000, msg.timeout) : 5000;
        const timer = setTimeout(() => {
            if (finished) return;
            finished = true;
            postError({ name: 'TimeoutError', message: `Execution timed out after ${TIMEOUT_MS}ms`, phase: 'timeout' });
            try { (self as any).close && (self as any).close(); } catch(e) {}
        }, TIMEOUT_MS);

        try {
            // eval the wrapper, handle promise rejection
            eval(asyncWrapper).then(() => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                postDone();
            }).catch((err: any) => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                
                // Format runtime errors nicely
                let errorMessage = `❌ ${err.name || 'Runtime Error'}: ${err.message || 'An error occurred during execution'}`;
                
                // Try to extract line number from stack trace
                let lineNumber = 0;
                let columnNumber = 0;
                const stackMatch = (err.stack || '').match(/<anonymous>:(\d+):(\d+)/);
                if (stackMatch) {
                    lineNumber = parseInt(stackMatch[1], 10) - 1; // Adjust for wrapper
                    columnNumber = parseInt(stackMatch[2], 10);
                    
                    if (mapping && mapping.length >= lineNumber && lineNumber > 0) {
                        const original = mapping[lineNumber - 1];
                        if (original) {
                            errorMessage += `\n\n  At line ${original.srcLine}:`;
                            errorMessage += `\n  ${original.srcText}`;
                            
                            // Add a pointer to the error location if we have column info
                            if (columnNumber > 0) {
                                const pointer = ' '.repeat(2 + columnNumber) + '^';
                                errorMessage += `\n  ${pointer}`;
                            }
                            
                            // Add context if available
                            if (lineNumber > 1) {
                                const contextLine = mapping[lineNumber - 2];
                                if (contextLine) {
                                    errorMessage += `\n\n  Previous line (${contextLine.srcLine}):`;
                                    errorMessage += `\n  ${contextLine.srcText}`;
                                }
                            }
                        }
                    }
                }
                
                // Add common error suggestions
                if (err.message.includes('is not defined')) {
                    errorMessage += '\n\n💡 Tip: You might have a typo in a variable or function name, or you might be trying to use a variable that hasn\'t been declared.';
                } else if (err.message.includes('Cannot read properties of undefined') || 
                          err.message.includes('Cannot read property')) {
                    errorMessage += '\n\n💡 Tip: You might be trying to access a property of an undefined or null value. Check if the variable exists and has the expected value.';
                }
                
                postError({ 
                    name: err.name || 'RuntimeError', 
                    message: errorMessage, 
                    stack: err.stack, 
                    line: lineNumber,
                    column: columnNumber,
                    phase: 'runtime',
                    formatted: true
                });
            });
        } catch (err: any) {
            if (!finished) {
                finished = true;
                clearTimeout(timer);
                postError({ 
                    name: err && err.name || 'Error', 
                    message: err && err.message || String(err), 
                    stack: err && err.stack || '', 
                    phase: 'execution' 
                });
                postDone();
            }
        }
    } catch (err: any) {
        self.postMessage({ type: 'stderr', text: String(err && err.message ? err.message : err) });
    }
};
