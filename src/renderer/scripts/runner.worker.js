// Worker: receives { code } message, optionally translates simple pseudocode to JS,
// runs it inside an async function with print/input provided, and enforces a timeout.
// It preserves the message protocol: stdout/stderr/error/done/input-request.
function isLikelyPseudo(src) {
    if (!src) return false;
    const lowered = src.toLowerCase();
    return /\bprint\b|\bvar\b|\bfor\b|\bendfor\b/.test(lowered);
}

function validatePseudo(src) {
    const lines = src.split(/\r?\n/);
    const issues = [];
    const blockStack = []; // Tracks for/if/while blocks
    let inForLoop = false;
    let inIfBlock = false;
    let inWhileLoop = false;
    let currentBlock = null;

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const lineNum = i + 1;
        const t = raw.trim();
        if (!t || t.startsWith('#')) continue;
        
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

function translatePseudoToJs(src) {
    const lines = src.replace(/\t/g, '    ').split(/\r?\n/);
    const out = [];
    const mapping = []; // mapping: generated JS line index (1-based) -> { srcLine, srcText }
    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const srcLineNum = i + 1;
        let line = raw.trim();
        if (!line) continue;
        // comments
        if (line.startsWith('#')) { out.push('// ' + line.slice(1).trim()); mapping.push({ srcLine: srcLineNum, srcText: raw }); continue; }

        // var declaration: var x = expr
        let m = line.match(/^var\s+([a-zA-Z_$][\w$]*)\s*=\s*(.*)$/i);
        if (m) { out.push(`let ${m[1]} = ${m[2]};`); mapping.push({ srcLine: srcLineNum, srcText: raw }); continue; }

        // print statements: print arg1, arg2
        m = line.match(/^print\s+(.+)$/i);
        if (m) { out.push(`print(${m[1]});`); mapping.push({ srcLine: srcLineNum, srcText: raw }); continue; }

        // for loops: for i = 1 to n
        m = line.match(/^for\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?)\s+to\s+(.+)$/i);
        if (m) { out.push(`for (let ${m[1]} = ${m[2]}; ${m[1]} <= ${m[3]}; ${m[1]}++) {`); mapping.push({ srcLine: srcLineNum, srcText: raw }); continue; }

        // endfor
        if (/^endfor$/i.test(line)) { out.push('}'); mapping.push({ srcLine: srcLineNum, srcText: raw }); continue; }

        // fallback: ensure semicolon
        if (!line.endsWith(';')) line = line + ';';
        out.push(line);
        mapping.push({ srcLine: srcLineNum, srcText: raw });
    }
    return { code: out.join('\n'), mapping };
}

self.onmessage = function(e) {
    const msg = e.data;
    if (!(msg && typeof msg.code === 'string')) return;
    try {
        const postStdout = (text) => self.postMessage({ type: 'stdout', text: String(text) });
        const postStderr = (text) => self.postMessage({ type: 'stderr', text: String(text) });
        const postError = (errObj) => self.postMessage({ type: 'error', error: errObj });
        const postDone = () => self.postMessage({ type: 'done' });

        const print = function(...args) { postStdout(args.join(' ')); };
        const input = function(promptText) {
            const id = Math.random().toString(36).slice(2);
            return new Promise((resolve) => {
                function handler(ev) {
                    if (ev.data && ev.data.type === 'input-response' && ev.data.id === id) {
                        self.removeEventListener('message', handler);
                        resolve(ev.data.value);
                    }
                }
                self.addEventListener('message', handler);
                self.postMessage({ type: 'input-request', id, prompt: promptText });
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
            } catch (tErr) {
                postError({ name: 'TranslationError', message: String(tErr && tErr.message ? tErr.message : tErr), stack: (tErr && tErr.stack) || '', phase: 'translation' });
                return;
            }
        }

        const asyncWrapper = `(async function(print, input){\n${source}\n})(print, input);`;

        // syntax check
        try {
            new Function(source);
        } catch (syntaxError) {
            // try to map the error to original pseudocode line if mapping exists
            let original = null;
            if (mapping && mapping.length) {
                // extract line number from syntaxError if available (some engines include it)
                const match = String(syntaxError.stack || syntaxError.message || '').match(/:(\d+):\d+/);
                if (match) {
                    const errLine = parseInt(match[1],10);
                    if (!Number.isNaN(errLine) && mapping[errLine-1]) original = mapping[errLine-1];
                }
            }
            postError({ name: syntaxError.name, message: syntaxError.message, stack: syntaxError.stack, line: original ? original.srcLine : 0, originalText: original ? original.srcText : null, phase: 'syntax' });
            return;
        }

        let finished = false;
        const TIMEOUT_MS = typeof msg.timeout === 'number' ? Math.max(1000, msg.timeout) : 5000;
        const timer = setTimeout(() => {
            if (finished) return;
            finished = true;
            postError({ name: 'TimeoutError', message: `Execution timed out after ${TIMEOUT_MS}ms`, phase: 'timeout' });
            try { self.close && self.close(); } catch(e) {}
        }, TIMEOUT_MS);

        try {
            // eval the wrapper, handle promise rejection
            eval(asyncWrapper).then(() => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                postDone();
            }).catch(err => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                postError({ name: err && err.name || 'Error', message: err && err.message || String(err), stack: err && err.stack || '', phase: 'runtime' });
            });
        } catch (err) {
            if (!finished) {
                finished = true;
                clearTimeout(timer);
                postError({ name: err && err.name || 'Error', message: err && err.message || String(err), stack: err && err.stack || '', phase: 'execution' });
                postDone();
            }
        }
    } catch (err) {
        self.postMessage({ type: 'stderr', text: String(err && err.message ? err.message : err) });
    }
};
