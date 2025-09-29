"use strict";
// Worker: receives { code } message, optionally translates simple pseudocode to JS,
// runs it inside an async function with print/input provided, and enforces a timeout.
// It preserves the message protocol: stdout/stderr/error/done/input-request.
function isLikelyPseudo(src) {
    if (!src)
        return false;
    const lowered = src.toLowerCase();
    return /\b(print|var|const|if|else|elseif|endif|for|to|endfor|while|endwhile|function|endfunction|return|break|continue|input|algorithm|endalgorithm)\b/.test(lowered);
}
function validatePseudo(src) {
    const lines = src.split(/\r?\n/);
    const issues = [];
    const blockStack = []; // Tracks for/if/while blocks
    
    // Check for Algorithm/EndAlgorithm structure
    const hasAlgorithmStart = lines.some(line => line.trim().toLowerCase().startsWith('algorithm '));
    const hasAlgorithmEnd = lines.some(line => line.trim().toLowerCase() === 'endalgorithm');
    
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
        if (!t || t.startsWith('#'))
            continue;
        const lower = t.toLowerCase();
        const indent = raw.match(/^\s*/)[0].length;
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
        // Check for Algorithm declaration
        if (lower.startsWith('algorithm ')) {
            const m = t.match(/^algorithm\s+([a-zA-Z_$][\w$]*)\s*$/i);
            if (!m) {
                issues.push({ 
                    line: lineNum, 
                    text: raw, 
                    message: 'Malformed Algorithm declaration. Expected: Algorithm <name>' 
                });
            }
            continue;
        }
        
        // Check for EndAlgorithm declaration
        if (lower === 'endalgorithm') {
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
        if (lower.startsWith('for ')) {
            const m = t.match(/^for\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?)\s+to\s+(.+?)(?:\s+step\s+([-+]?\d+))?\s*$/i);
            if (!m) {
                issues.push({
                    line: lineNum,
                    text: raw,
                    message: 'Malformed for-loop. Expected: for <var> = <start> to <end> [step <increment>]'
                });
            }
            else {
                blockStack.push({ type: 'for', var: m[1], line: lineNum, indent });
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
            }
            else {
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
            }
            else {
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
            }
            else {
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
            }
            else {
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
            }
            else {
                blockStack.pop();
            }
            continue;
        }
        if (lower.startsWith('var ') || lower.startsWith('const ')) {
            const m = t.match(/^(var|const)\s+([a-zA-Z_$][\w$]*)\s*(?:=\s*(.+))?$/i);
            if (!m) {
                issues.push({
                    line: lineNum,
                    text: raw,
                    message: `Malformed ${lower.startsWith('var') ? 'var' : 'const'} declaration. Expected: ${lower.startsWith('var') ? 'var' : 'const'} <name> [= <value>]`
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
function translatePseudoToJs(src) {
    const lines = src.replace(/\t/g, '    ').split(/\r?\n/);
    const out = [];
    const mapping = [];
    const functionStack = []; // Track function names for return statements
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

        // Algorithm declaration - convert to comment
        if (line.toLowerCase().startsWith('algorithm ')) {
            out.push('// Algorithm: ' + line.slice(9).trim()); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }

        // EndAlgorithm declaration - convert to comment
        if (line.toLowerCase() === 'endalgorithm') {
            out.push('// End Algorithm'); 
            mapping.push({ srcLine: srcLineNum, srcText: raw }); 
            continue; 
        }
        // Variable declarations with input: var x = input "prompt" or const x = input "prompt"
        let m = line.match(/^(var|const)\s+([a-zA-Z_$][\w$]*)\s*=\s*input\s+(.+)$/i);
        if (m) {
            const keyword = m[1].toLowerCase();
            const varName = m[2];
            let prompt = m[3].trim();
            // Remove quotes if present from both ends
            if ((prompt.startsWith('"') && prompt.endsWith('"')) || 
                (prompt.startsWith("'") && prompt.endsWith("'"))) {
                prompt = prompt.slice(1, -1).trim();
            }
            out.push(`${keyword} ${varName} = await input("${prompt}");`);
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }

        // Variable declarations: var x = expr or const x = expr
        m = line.match(/^(var|const)\s+([a-zA-Z_$][\w$]*)\s*=\s*(.*)$/i);
        if (m) {
            const keyword = m[1].toLowerCase();
            const varName = m[2];
            const value = m[3];
            out.push(`${keyword} ${varName} = ${value};`);
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // Print statements: print arg1, arg2
        m = line.match(/^print\s+(.+)$/i);
        if (m) {
            out.push(`print(${m[1]});`);
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // Input statements: input "prompt" or input prompt
        m = line.match(/^input\s+(.+)$/i);
        if (m) {
            out.push(`await input(${m[1]});`);
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // For loops: for i = 1 to n [step increment]
        m = line.match(/^for\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?)\s+to\s+(.+?)(?:\s+step\s+([-+]?\d+))?\s*$/i);
        if (m) {
            const varName = m[1];
            const start = m[2];
            const end = m[3];
            const step = m[4] || '1';
            out.push(`for (let ${varName} = ${start}; ${varName} <= ${end}; ${varName} += ${step}) {`);
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // While loops: while condition [then]
        m = line.match(/^while\s+(.+?)(?:\s+then)?\s*$/i);
        if (m) {
            out.push(`while (${m[1]}) {`);
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // If statements: if condition [then]
        m = line.match(/^if\s+(.+?)(?:\s+then)?\s*$/i);
        if (m) {
            out.push(`if (${m[1]}) {`);
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // Elseif statements: elseif condition [then]
        m = line.match(/^elseif\s+(.+?)(?:\s+then)?\s*$/i);
        if (m) {
            out.push(`} else if (${m[1]}) {`);
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // Else statements: else
        if (/^else\s*$/i.test(line)) {
            out.push('} else {');
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // Function declarations: function name(params)
        m = line.match(/^function\s+([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)\s*$/i);
        if (m) {
            const funcName = m[1];
            const params = m[2] || '';
            functionStack.push(funcName);
            out.push(`function ${funcName}(${params}) {`);
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // Return statements: return expression
        m = line.match(/^return\s+(.+)$/i);
        if (m) {
            out.push(`return ${m[1]};`);
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // Break statements: break
        if (/^break\s*$/i.test(line)) {
            out.push('break;');
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // Continue statements: continue
        if (/^continue\s*$/i.test(line)) {
            out.push('continue;');
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // End blocks: endfor, endif, endwhile, endfunction
        if (/^(endfor|endif|endwhile|endfunction)\s*$/i.test(line)) {
            if (line.toLowerCase() === 'endfunction') {
                functionStack.pop();
            }
            out.push('}');
            mapping.push({ srcLine: srcLineNum, srcText: raw });
            continue;
        }
        // Assignment statements: variable = expression
        m = line.match(/^([a-zA-Z_$][\w$]*)\s*=\s*(.+)$/);
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
self.onmessage = function (e) {
    const msg = e.data;
    if (!(msg && typeof msg.code === 'string'))
        return;
    try {
        const postStdout = (text) => self.postMessage({ type: 'stdout', text: String(text) });
        const postStderr = (text) => self.postMessage({ type: 'stderr', text: String(text) });
        const postError = (errObj) => self.postMessage({ type: 'error', error: errObj });
        const postDone = () => self.postMessage({ type: 'done' });
        const print = function (...args) { postStdout(args.join(' ')); };
        const input = function (promptText) {
            const id = Math.random().toString(36).slice(2);
            return new Promise((resolve) => {
                function handler(ev) {
                    if (ev.data && ev.data.type === 'input-response' && ev.data.id === id) {
                        self.removeEventListener('message', handler);
                        resolve(ev.data.value || '');
                        // Timer will be cleared by the calling code since finished is set
                    }
                }
                self.addEventListener('message', handler);
                
                // Clear timeout during user input wait and restart timer after this promise
                clearTimeout(timer);
                
                self.postMessage({ type: 'input-request', id, prompt: promptText || 'Input:' });
            }).then((value) => {
                // Restart timeout timer for continued execution
                timer = setTimeout(() => {
                    if (finished) return;
                    finished = true;
                    postError({ name: 'TimeoutError', message: `Execution timed out after 8000ms`, phase: 'timeout' });
                    try {
                        self.close && self.close();
                    } catch (e) { }
                }, 8000);
                return value;
            });
        };
        let source = msg.code;
        let mapping = null;
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
            }
            catch (tErr) {
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
        // Skip syntax check for source with await - runtime validation will catch issues
        let finished = false;
        const TIMEOUT_MS = typeof msg.timeout === 'number' ? Math.max(1000, msg.timeout) : 5000;
        let timer = setTimeout(() => {
            if (finished)
                return;
            finished = true;
            postError({ name: 'TimeoutError', message: `Execution timed out after ${TIMEOUT_MS}ms`, phase: 'timeout' });
            try {
                self.close && self.close();
            }
            catch (e) { }
        }, TIMEOUT_MS);
        try {
            // eval the wrapper, handle promise rejection
            eval(asyncWrapper).then(() => {
                if (finished)
                    return;
                finished = true;
                clearTimeout(timer);
                postDone();
            }).catch((err) => {
                if (finished)
                    return;
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
                }
                else if (err.message.includes('Cannot read properties of undefined') ||
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
        }
        catch (err) {
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
    }
    catch (err) {
        self.postMessage({ type: 'stderr', text: String(err && err.message ? err.message : err) });
    }
};
//# sourceMappingURL=runner.worker.js.map