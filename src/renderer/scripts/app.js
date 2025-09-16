// Minimal clean app.js - renderer wiring for runner.worker.js and ErrorManager

document.addEventListener('DOMContentLoaded', () => {
    const outputConsole = document.getElementById('output');
    const runButton = document.getElementById('btnRun');
    const clearButton = document.getElementById('clearConsole');
    const runStatus = document.getElementById('runStatus');

    function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
    // out: by default include timestamp; for type 'stdout' and 'print' show raw text only
    function out(text, type='info') {
        if (!outputConsole) return;
        const safe = escapeHtml(String(text));
        if (type === 'stdout' || type === 'print' || type === 'success') {
            outputConsole.innerHTML += `<div class="out raw">${safe}</div>`;
        } else {
            const ts = new Date().toLocaleTimeString();
            outputConsole.innerHTML += `<div class="out ${type}">[${ts}] ${safe}</div>`;
        }
    }

    if (clearButton) clearButton.addEventListener('click', () => { if (outputConsole) outputConsole.innerHTML = ''; });

    const ErrorManagerCtor = window.ErrorManager || null;
    const errorManager = ErrorManagerCtor ? new ErrorManagerCtor() : null;

    let runnerWorker = null;

    function cleanupWorker() {
        if (runnerWorker) {
            try { runnerWorker.onmessage = null; runnerWorker.onerror = null; runnerWorker.terminate(); } catch(e) { console.error(e); }
            runnerWorker = null;
        }
        if (runButton) runButton.disabled = false;
        if (runStatus) runStatus.title = 'Idle';
    }

    function handleError(err, src) {
        // Handle pseudo-code validation errors
        if (err.issues && Array.isArray(err.issues)) {
            err.issues.forEach(issue => {
                out(`Error at line ${issue.line}: ${issue.message}`, 'error');
                out(`  ${issue.text.trim()}`, 'error');
                
                // Try to highlight the error in the editor if possible
                if (errorManager && window.editor && typeof window.editor.getModel === 'function') {
                    try {
                        const model = window.editor.getModel();
                        const decoration = {
                            message: issue.message,
                            line: issue.line,
                            originalText: issue.text.trim()
                        };
                        if (typeof errorManager.updateDecorations === 'function') {
                            errorManager.updateDecorations(window.editor, [decoration]);
                        }
                    } catch (e) { console.warn('Failed to update error decorations', e); }
                }
            });
            return;
        }

        // Handle single error object
        try {
            let errorMessage = err.message || String(err);
            const lineNum = err.line || 'unknown';
            const originalText = err.originalText || '';
            const errorType = err.name || 'Error';
            const phase = err.phase ? ` (${err.phase})` : '';

            // Format the error message based on the error type and phase
            if (errorType === 'PseudoCodeError' || phase.includes('validation')) {
                // For pseudo-code validation errors
                out(`Pseudo-code Error${phase}: ${errorMessage}`, 'error');
                if (originalText) {
                    out(`Line ${lineNum}: ${originalText}`, 'error');
                }
            } else if (errorType === 'SyntaxError' && phase === 'execution') {
                // For syntax errors during execution
                out(`Syntax Error: ${errorMessage}`, 'error');
                if (originalText) {
                    out(`Line ${lineNum}: ${originalText}`, 'error');
                }
            } else if (errorType === 'TimeoutError') {
                // For timeout errors
                out(`Timeout: ${errorMessage}`, 'error');
                out('Your code took too long to execute. There might be an infinite loop or inefficient code.', 'error');
            } else {
                // For all other errors
                out(`${errorType}${phase}: ${errorMessage}`, 'error');
                if (originalText) {
                    out(`Line ${lineNum}: ${originalText}`, 'error');
                }
            }

            // Try to highlight the error in the editor if possible
            if (errorManager && window.editor && typeof window.editor.getModel === 'function') {
                try {
                    const model = window.editor.getModel();
                    const decoration = {
                        message: errorMessage,
                        line: lineNum,
                        originalText: originalText,
                        type: errorType,
                        phase: phase
                    };
                    
                    // Add suggestions for common errors
                    if (errorType === 'ReferenceError' && errorMessage.includes('is not defined')) {
                        const varName = errorMessage.split(' ')[0];
                        decoration.suggestion = `Did you forget to declare '${varName}' with 'var'?`;
                    } else if (errorType === 'TypeError' && errorMessage.includes('undefined is not a function')) {
                        decoration.suggestion = 'Check if the function name is spelled correctly and exists in the current scope.';
                    } else if (errorType === 'SyntaxError' && errorMessage.includes('Unexpected token')) {
                        decoration.suggestion = 'Check for missing or extra characters like ;, {}, (), or []';
                    }

                    if (typeof errorManager.updateDecorations === 'function') {
                        errorManager.updateDecorations(window.editor, [decoration]);
                    }
                    
                    // If we have a suggestion, display it
                    if (decoration.suggestion) {
                        out(`Suggestion: ${decoration.suggestion}`, 'info');
                    }

                    // Scroll to the error line in the editor
                    if (lineNum !== 'unknown') {
                        window.editor.revealLineInCenter(parseInt(lineNum, 10));
                        window.editor.setPosition({ lineNumber: parseInt(lineNum, 10), column: 1 });
                        window.editor.focus();
                    }
                } catch (e) { 
                    console.warn('Failed to update error decorations', e); 
                }
            }
        } catch (e) { 
            console.error('Error handling error:', e);
            out(`Error: ${String(err)}`, 'error'); 
        }
    }

    function execute(code) {
        if (!code || !code.trim()) { out('Nothing to run','warning'); return; }
        try {
            if (runButton) runButton.disabled = true;
            if (runStatus) runStatus.title = 'Running';

            cleanupWorker();
            runnerWorker = new Worker('./scripts/runner.worker.js');

            // If the code looks like pseudocode, send a slightly longer timeout.
            const isPseudo = /\bprint\b|\bvar\b|\bfor\b|\bendfor\b/i.test(code);
            const timeout = isPseudo ? 8000 : 5000;

            runnerWorker.onerror = (e) => { out('Worker error: ' + (e && e.message? e.message : JSON.stringify(e)),'error'); cleanupWorker(); };

            runnerWorker.onmessage = (ev) => {
                const m = ev.data; if (!m) return;
                try {
                    if (m.type === 'stdout') { (m.text||'').split('\n').forEach(l=>{ if (l.trim()) out(l,'stdout'); }); }
                    else if (m.type === 'stderr') { out(m.text||'stderr','error'); }
                    else if (m.type === 'error') { const eobj = m.error || { message: m.message||m.text||'error' }; const e = new Error(eobj.message); e.name = eobj.name || 'Error'; e.stack = eobj.stack || ''; handleError(e, code); cleanupWorker(); }
                    else if (m.type === 'input-request') { const val = window.prompt(m.prompt||'Input:')||''; runnerWorker.postMessage({ type: 'input-response', id: m.id, value: val }); }
                    else if (m.type === 'done') { out('Done','info'); cleanupWorker(); }
                    else { console.warn('unknown message',m); }
                } catch(err) { out('Message handler error: '+err.message,'error'); cleanupWorker(); }
            };

            runnerWorker.postMessage({ code, timeout });
        } catch(err) { handleError(err, code); cleanupWorker(); }
    }

    if (runButton) runButton.addEventListener('click', () => {
        const code = window.editor && typeof window.editor.getValue === 'function' ? window.editor.getValue() : '';
        if (outputConsole) outputConsole.innerHTML = '';
        execute(code);
    });

});
