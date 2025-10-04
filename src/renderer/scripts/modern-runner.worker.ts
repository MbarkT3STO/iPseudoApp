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
    return /\b(print|var|const|constant|if|else|elseif|endif|for|to|endfor|while|endwhile|function|endfunction|return|break|continue|input|algorithm|endalgorithm|variable|set|declare|as|number|string|boolean|integer|float|char)\b/.test(lowered) || 
           /\b(Print|Var|Const|Constant|If|Else|Elseif|Endif|For|To|Endfor|While|Endwhile|Function|Endfunction|Return|Break|Continue|Input|Algorithm|Endalgorithm|Variable|Set|Declare|As|Number|String|Boolean|Integer|Float|Char)\b/.test(src);
}

function validatePseudo(src: string): ValidationIssue[] {
    const lines = src.split(/\r?\n/);
    const issues: ValidationIssue[] = [];
    const blockStack: BlockInfo[] = []; // Tracks for/if/while blocks
    
    // Check for Algorithm/EndAlgorithm structure (both lowercase and Pascal Case)
    const hasAlgorithmStart = lines.some(line => {
        const trimmed = line.trim();
        return trimmed.toLowerCase().startsWith('algorithm ') || trimmed.startsWith('Algorithm ');
    });
    const hasAlgorithmEnd = lines.some(line => {
        const trimmed = line.trim();
        return trimmed.toLowerCase() === 'endalgorithm' || trimmed === 'Endalgorithm';
    });
    
    if (!hasAlgorithmStart) {
        issues.push({
            line: 1,
            text: lines[0] || '',
            message: 'Missing Algorithm declaration. Pseudocode must start with "Algorithm <name>"'
        });
    }
    
    if (!hasAlgorithmEnd) {
        issues.push({
            line: lines.length,
            text: lines[lines.length - 1] || '',
            message: 'Missing EndAlgorithm declaration. Pseudocode must end with "EndAlgorithm"'
        });
    }

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

        // Check for Algorithm declaration (both cases)
        if (lower.startsWith('algorithm ') || t.startsWith('Algorithm ')) {
            const m = t.match(/^(algorithm|Algorithm)\s+([a-zA-Z_$][\w$]*)\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed Algorithm declaration. Expected: Algorithm <name>' 
                });
            }
            continue;
        }
        
        // Check for EndAlgorithm declaration (both cases)
        if (lower === 'endalgorithm' || t === 'Endalgorithm') {
            if (blockStack.length > 0) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'EndAlgorithm found but there are unclosed blocks. Close all blocks before EndAlgorithm' 
                });
            }
            continue;
        }

        // Check for common pseudo-code structures
        if (lower.startsWith('for ') || t.startsWith('For ')) {
            const m = t.match(/^(for|For)\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?)\s+(to|To)\s+(.+?)(?:\s+step\s+([-+]?\d+))?\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed for-loop. Expected: For <var> = <start> To <end> [step <increment>]' 
                });
            } else {
                blockStack.push({ type: 'for', var: m[2], line: lineNum, indent });
            }
            continue;
        }
        
        // Check for while loops
        if (lower.startsWith('while ')) {
            const m = t.match(/^while\s+(.+?)(?:\s+then)?\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed while loop. Expected: while <condition> [then]' 
                });
            } else {
                blockStack.push({ type: 'while', line: lineNum, indent });
            }
            continue;
        }
        
        // Check for if statements
        if (lower.startsWith('if ')) {
            const m = t.match(/^if\s+(.+?)(?:\s+then)?\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed if statement. Expected: if <condition> [then]' 
                });
            } else {
                blockStack.push({ type: 'if', line: lineNum, indent });
            }
            continue;
        }
        
        // Check for elseif statements
        if (lower.startsWith('elseif ')) {
            if (blockStack.length === 0 || blockStack[blockStack.length - 1].type !== 'if') {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'elseif without matching if statement' 
                });
            } else {
                const m = t.match(/^elseif\s+(.+?)(?:\s+then)?\s*$/i);
                if (!m) {
                    issues.push({ 
                        line: lineNum, 
                        text: raw, 
                        message: 'Malformed elseif statement. Expected: elseif <condition> [then]' 
                    });
                }
            }
            continue;
        }
        
        // Check for else statements
        if (lower === 'else') {
            if (blockStack.length === 0 || blockStack[blockStack.length - 1].type !== 'if') {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'else without matching if statement' 
                });
            }
            continue;
        }
        
        // Check for function declarations
        if (lower.startsWith('function ')) {
            const m = t.match(/^function\s+([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed function declaration. Expected: function <name>(<parameters>)' 
                });
            } else {
                blockStack.push({ type: 'function', line: lineNum, indent });
            }
            continue;
        }
        
        // Check for return statements
        if (lower.startsWith('return ')) {
            if (blockStack.length === 0 || blockStack[blockStack.length - 1].type !== 'function') {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'return statement outside of function' 
                });
            }
            continue;
        }
        
        // Check for break statements
        if (lower === 'break') {
            if (blockStack.length === 0 || !['for', 'while'].includes(blockStack[blockStack.length - 1].type)) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'break statement outside of loop' 
                });
            }
            continue;
        }
        
        // Check for continue statements
        if (lower === 'continue') {
            if (blockStack.length === 0 || !['for', 'while'].includes(blockStack[blockStack.length - 1].type)) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'continue statement outside of loop' 
                });
            }
            continue;
        }
        
        // Check for end blocks
        if (lower === 'endfor' || lower === 'endif' || lower === 'endwhile' || lower === 'endfunction') {
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
        
        // Check for variable declarations (var, const, constant, variable) - including arrays
        if (lower.startsWith('var ') || lower.startsWith('const ') || lower.startsWith('constant ') || lower.startsWith('variable ')) {
            // Support both regular variables and array declarations: var name [= value] or var name[size]
            const m = t.match(/^(var|const|constant|variable|Var|Const|Constant|Variable)\s+([a-zA-Z_$][\w$]*)\s*(?:\[([^\]]+)\]|(?:=\s*(.+)))?$/i);
            if (!m) {
                const keyword = lower.startsWith('var') ? 'var' : lower.startsWith('const') ? 'const' : lower.startsWith('constant') ? 'constant' : 'variable';
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: `Malformed ${keyword} declaration. Expected: ${keyword} <name> [= <value>] or ${keyword} <name>[<size>]` 
                });
            }
            continue;
        }

        // Check for "Set value To variableName" syntax
        if (lower.startsWith('set ')) {
            const m = t.match(/^(set|Set)\s+(.+)\s+(to|To)\s+([a-zA-Z_$][\w$]*)\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed Set statement. Expected: Set <value> To <variableName>' 
                });
            }
            continue;
        }

        // Check for "Declare variableName As Type" syntax
        if (lower.startsWith('declare ')) {
            const m = t.match(/^(declare|Declare)\s+([a-zA-Z_$][\w$]*)\s+(as|As)\s+(number|string|boolean|integer|float|char|Number|String|Boolean|Integer|Float|Char)\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed Declare statement. Expected: Declare <variableName> As <Type>' 
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
        
        if (lower.startsWith('input ')) {
            const m = t.match(/^input\s+(.+)$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed input statement. Expected: input <prompt>' 
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
    const mapping: MappingEntry[] = [];
    const functionStack: string[] = []; // Track function names for return statements
    
    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const srcLineNum = i + 1;
        let line = raw.trim();
        if (!line) {
            out.push('');
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        
        // Comments
        if (line.startsWith('#')) { 
            out.push('// ' + line.slice(1).trim()); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Algorithm declaration - convert to comment (both cases)
        if (line.toLowerCase().startsWith('algorithm ') || line.startsWith('Algorithm ')) {
            const algorithmName = line.toLowerCase().startsWith('algorithm ') ? line.slice(9).trim() : line.slice(10).trim();
            out.push('// Algorithm: ' + algorithmName); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // EndAlgorithm declaration - convert to comment (both cases)
        if (line.toLowerCase() === 'endalgorithm' || line === 'Endalgorithm') {
            out.push('// End Algorithm'); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Array declarations: var arrayName[size] (both cases)
        let m = line.match(/^(var|const|Var|Const)\s+([a-zA-Z_$][\w$]*)\s*\[([^\]]+)\]\s*$/i);
        if (m) { 
            const keyword = m[1].toLowerCase();
            const varName = m[2];
            const size = m[3].trim();
            // Create array with specified size, initialized with undefined
            out.push(`${keyword} ${varName} = new Array(${size});`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Variable declarations with input: var x = input "prompt" or const x = input "prompt" (both cases)
        m = line.match(/^(var|const|Var|Const)\s+([a-zA-Z_$][\w$]*)\s*=\s*(input|Input)\s+(.+)$/i);
        if (m) { 
            const keyword = m[1].toLowerCase();
            const varName = m[2];
            let prompt = m[4].trim();
            // Remove quotes if present from both ends
            if ((prompt.startsWith('"') && prompt.endsWith('"')) || 
                (prompt.startsWith("'") && prompt.endsWith("'"))) {
                prompt = prompt.slice(1, -1).trim();
            }
            out.push(`${keyword} ${varName} = await input("${prompt}");`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Variable declarations: var x = expr or const x = expr or constant x = expr or variable x = expr (both cases)
        m = line.match(/^(var|const|constant|variable|Var|Const|Constant|Variable)\s+([a-zA-Z_$][\w$]*)\s*=\s*(.*)$/i);
        if (m) { 
            const keyword = m[1].toLowerCase();
            const varName = m[2];
            const value = m[3];
            // Convert 'variable' and 'constant' to appropriate JavaScript keywords
            const jsKeyword = keyword === 'variable' ? 'var' : keyword === 'constant' ? 'const' : keyword;
            out.push(`${jsKeyword} ${varName} = ${value};`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Declare statements: Declare variableName As Type (both cases)
        m = line.match(/^(declare|Declare)\s+([a-zA-Z_$][\w$]*)\s+(as|As)\s+(number|string|boolean|integer|float|char|Number|String|Boolean|Integer|Float|Char)\s*$/i);
        if (m) { 
            const varName = m[2];
            // Convert to JavaScript var declaration (types are handled dynamically in JS)
            out.push(`var ${varName};`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Set statements: Set value To variableName (both cases)
        m = line.match(/^(set|Set)\s+(.+)\s+(to|To)\s+([a-zA-Z_$][\w$]*)\s*$/i);
        if (m) { 
            const value = m[2].trim();
            const varName = m[4];
            // Convert to JavaScript assignment
            out.push(`${varName} = ${value};`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Print statements: print arg1, arg2 (both cases)
        m = line.match(/^(print|Print)\s+(.+)$/i);
        if (m) { 
            out.push(`print(${m[2]});`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Input statements: input "prompt" or input prompt (both cases)
        m = line.match(/^(input|Input)\s+(.+)$/i);
        if (m) { 
            out.push(`await input(${m[2]});`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // For loops: for i = 1 to n [step increment] (both cases)
        m = line.match(/^(for|For)\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?)\s+(to|To)\s+(.+?)(?:\s+step\s+([-+]?\d+))?\s*$/i);
        if (m) { 
            const varName = m[2];
            const start = m[3];
            const end = m[5];
            const step = m[6] || '1';
            out.push(`for (let ${varName} = ${start}; ${varName} <= ${end}; ${varName} += ${step}) {`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // While loops: while condition [then] (both cases)
        m = line.match(/^(while|While)\s+(.+?)(?:\s+(then|Then))?\s*$/i);
        if (m) { 
            out.push(`while (${m[2]}) {`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // If statements: if condition [then] (both cases)
        m = line.match(/^(if|If)\s+(.+?)(?:\s+(then|Then))?\s*$/i);
        if (m) { 
            out.push(`if (${m[2]}) {`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Elseif statements: elseif condition [then] (both cases)
        m = line.match(/^(elseif|Elseif)\s+(.+?)(?:\s+(then|Then))?\s*$/i);
        if (m) { 
            out.push(`} else if (${m[2]}) {`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Else statements: else (both cases)
        if (/^(else|Else)\s*$/i.test(line)) { 
            out.push('} else {'); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Function declarations: function name(params) (both cases)
        m = line.match(/^(function|Function)\s+([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)\s*$/i);
        if (m) { 
            const funcName = m[2];
            const params = m[3] || '';
            functionStack.push(funcName);
            out.push(`function ${funcName}(${params}) {`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Return statements: return expression (both cases)
        m = line.match(/^(return|Return)\s+(.+)$/i);
        if (m) { 
            out.push(`return ${m[2]};`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Break statements: break (both cases)
        if (/^(break|Break)\s*$/i.test(line)) { 
            out.push('break;'); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Continue statements: continue (both cases)
        if (/^(continue|Continue)\s*$/i.test(line)) { 
            out.push('continue;'); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // End blocks: endfor, endif, endwhile, endfunction (both cases)
        if (/^(endfor|endif|endwhile|endfunction|Endfor|Endif|Endwhile|Endfunction)\s*$/i.test(line)) { 
            if (line.toLowerCase() === 'endfunction' || line === 'Endfunction') {
                functionStack.pop();
            }
            out.push('}'); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Assignment statements: variable = expression or arrayName[index] = expression
        m = line.match(/^([a-zA-Z_$][\w$]*(?:\[[^\]]+\])?)\s*=\s*(.+)$/);
        if (m) { 
            out.push(`${m[1]} = ${m[2]};`); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // Fallback: ensure semicolon for other statements
        if (!line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}')) {
            line = line + ';';
        }
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
            new Function(asyncWrapper);
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
