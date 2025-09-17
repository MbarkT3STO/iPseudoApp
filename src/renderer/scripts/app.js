// Minimal clean app.js - renderer wiring for runner.worker.js and ErrorManager

document.addEventListener('DOMContentLoaded', () => {
    const outputConsole = document.getElementById('output');
    const runButton = document.getElementById('btnRun');
    const clearButton = document.getElementById('clearConsole');
    const runStatus = document.getElementById('runStatus');
    const addTabButton = document.querySelector('.add-tab');

    // Track open files and their content
    const openFiles = new Map();
    let activeFilePath = '';

    // Remove the default tab that's created in the HTML
    const defaultTab = document.querySelector('.tab[data-path=""]');
    if (defaultTab) {
        defaultTab.remove();
    }

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
        // Check if this is a pre-formatted error message from the worker
        if (err.formatted) {
            // Split the message into lines and handle each line appropriately
            const lines = (err.message || '').split('\n');
            
            // Display the main error message (first line) with proper styling
            if (lines.length > 0) {
                const mainError = lines[0];
                outputConsole.innerHTML += `<div class="error-message">${mainError}</div>`;
            }
            
            // Display the rest of the error message with context
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                // Style different parts of the error message
                if (line.startsWith('At line')) {
                    outputConsole.innerHTML += `<div class="error-location">${line}</div>`;
                } else if (line.startsWith('  ') && line.trim() !== '^') {
                    // This is a line of code with the error
                    outputConsole.innerHTML += `<div class="error-code"><pre>${line}</pre></div>`;
                } else if (line.trim() === '^') {
                    // This is the pointer to the error location
                    outputConsole.innerHTML += `<div class="error-pointer">${line}</div>`;
                } else if (line.startsWith('Previous line')) {
                    outputConsole.innerHTML += `<div class="error-context">${line}</div>`;
                } else if (line.startsWith('💡')) {
                    // This is a tip/suggestion
                    outputConsole.innerHTML += `<div class="error-tip">${line}</div>`;
                } else {
                    // Default styling for other lines
                    outputConsole.innerHTML += `<div>${line}</div>`;
                }
            }
            
            // Add a separator after the error
            outputConsole.innerHTML += '<div class="error-separator"></div>';
            
            // Scroll to the bottom to show the error
            outputConsole.scrollTop = outputConsole.scrollHeight;
            return;
        }
        
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

    // Function to save the current editor state
    function saveEditorState() {
        if (!window.editor || !activeFilePath || !window.editor.getModel) return;
        
        try {
            const content = window.editor.getValue();
            const position = window.editor.getPosition();
            const scrollTop = window.editor.getScrollTop ? window.editor.getScrollTop() : 0;
            
            if (openFiles.has(activeFilePath)) {
                const file = openFiles.get(activeFilePath);
                file.content = content;
                file.cursorPosition = position || { lineNumber: 1, column: 1 };
                file.scrollPosition = scrollTop;
                file.dirty = content !== (file.originalContent || '');
                updateTabDirtyState(activeFilePath, file.dirty);
            }
        } catch (e) {
            console.error('Error saving editor state:', e);
        }
    }

    // Function to refresh editor content for the current tab
    function refreshEditorForCurrentTab() {
        if (!window.editor || !activeFilePath || !window.editor.getModel) {
            // If editor isn't ready, try again shortly
            if (activeFilePath && !window.editor) {
                setTimeout(refreshEditorForCurrentTab, 100);
            }
            return;
        }
        
        const file = openFiles.get(activeFilePath);
        if (!file) return;
        
        try {
            // Store current state
            const model = window.editor.getModel();
            if (!model) return;
            
            const oldContent = model.getValue();
            const oldPosition = window.editor.getPosition();
            const oldScrollTop = window.editor.getScrollTop ? window.editor.getScrollTop() : 0;
            
            // Update editor content if it's different
            if (oldContent !== file.content) {
                model.setValue(file.content || '');
            }
            
            // Restore cursor position
            if (file.cursorPosition) {
                window.editor.setPosition(file.cursorPosition);
                window.editor.revealPositionInCenter(file.cursorPosition);
            } else if (oldPosition) {
                window.editor.setPosition(oldPosition);
            }
            
            // Restore scroll position
            if (file.scrollPosition !== undefined && window.editor.setScrollTop) {
                window.editor.setScrollTop(file.scrollPosition);
            } else if (oldScrollTop && window.editor.setScrollTop) {
                window.editor.setScrollTop(oldScrollTop);
            }
            
            // Update window title
            const fileName = activeFilePath.split('/').pop();
            document.title = `${fileName}${file.dirty ? ' *' : ''} - iPseudo IDE`;
            
            // Focus the editor
            window.editor.focus();
        } catch (e) {
            console.error('Error refreshing editor:', e);
        }
    }

    // Function to open a file in a new tab
    async function openFile(filePath, content) {
        try {
            // Store file content
            openFiles.set(filePath, {
                content,
                dirty: false,
                originalContent: content,
                cursorPosition: { lineNumber: 1, column: 1 },
                scrollPosition: 0
            });
            
            // Create new tab or switch to existing one
            createOrSwitchToTab(filePath, content);
            
            // Update window title
            document.title = `${filePath.split('/').pop()} - iPseudo IDE`;
            
        } catch (error) {
            console.error('Error opening file:', error);
            handleError({ message: `Failed to open file: ${error.message}` });
        }
    }

    // Function to create or switch to a tab
    function createOrSwitchToTab(filePath, initialContent = '') {
        const tabBar = document.getElementById('tabBar');
        if (!tabBar) return;
        
        // Save current editor state before switching
        saveEditorState();
        
        // Check if tab already exists
        const existingTab = tabBar.querySelector(`[data-path="${filePath}"]`);
        if (existingTab) {
            switchToTab(existingTab);
            return;
        }
        
        // Find the new tab button (it should be the last child)
        const newTabButton = tabBar.lastElementChild;
        
        // Create new tab
        const tab = document.createElement('div');
        tab.className = 'tab active';
        tab.dataset.path = filePath;
        
        const fileName = filePath.split('/').pop();
        tab.innerHTML = `
            <span class="tab-label">${fileName}</span>
            <span class="dirty-indicator" aria-hidden="true"></span>
            <button class="tab-close" title="Close">✕</button>
        `;
        
        // Add click handler to switch tabs
        tab.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-close')) {
                closeTab(filePath);
                e.stopPropagation();
                return;
            }
            switchToTab(tab);
        });
        
        // Deactivate other tabs
        tabBar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        
        // Insert the new tab before the new tab button
        tabBar.insertBefore(tab, newTabButton);
        
        // Initialize file in openFiles if it doesn't exist
        if (!openFiles.has(filePath)) {
            openFiles.set(filePath, {
                content: initialContent,
                originalContent: initialContent,
                dirty: false,
                cursorPosition: { lineNumber: 1, column: 1 },
                scrollPosition: 0
            });
        }
        
        // Update active file path and refresh editor
        activeFilePath = filePath;
        refreshEditorForCurrentTab();
    }

    // Function to switch tabs
    function switchToTab(tab) {
        if (!tab) return;
        
        const filePath = tab.dataset.path;
        if (!filePath) return;
        
        // Save current editor state before switching
        saveEditorState();
        
        // Update active tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active file path and refresh editor
        activeFilePath = filePath;
        refreshEditorForCurrentTab();
    }

    // Function to close a tab
    function closeTab(filePath) {
        const tab = document.querySelector(`.tab[data-path="${filePath}"]`);
        if (!tab) return;
        
        // Remove tab
        tab.remove();
        
        // Remove from open files
        openFiles.delete(filePath);
        
        // If this was the active tab, switch to another tab
        if (activeFilePath === filePath) {
            const remainingTabs = document.querySelectorAll('.tab');
            if (remainingTabs.length > 0) {
                switchToTab(remainingTabs[0]);
            } else {
                // No tabs left, clear editor
                if (window.editor) {
                    window.editor.setValue('');
                }
                document.title = 'iPseudo IDE';
                activeFilePath = '';
            }
        }
    }

    // Add event listener for the new tab button
    const newTabButton = document.getElementById('btnNewTab');
    if (newTabButton) {
        newTabButton.addEventListener('click', () => {
            // Create a unique identifier for the new tab
            const tabId = `untitled-${Date.now()}.pseudo`;
            
            // Create a new empty tab
            createOrSwitchToTab(tabId);
            
            // Clear the editor for the new tab
            if (window.editor) {
                window.editor.setValue('');
                window.editor.focus();
            }
            
            // Store empty content for the new tab
            openFiles.set(tabId, {
                content: '',
                originalContent: '',
                dirty: false,
                cursorPosition: { lineNumber: 1, column: 1 },
                scrollPosition: 0
            });
            
            // Update window title
            document.title = `${tabId} - iPseudo IDE`;
        });
    }

    // Add event listener for the open button
    const openButton = document.getElementById('btnOpen');
    if (openButton) {
        openButton.addEventListener('click', async () => {
            try {
                // Use IPC to show file open dialog and get file content
                const { ipcRenderer } = window.nodeRequire('electron');
                const { canceled, filePath, content } = await ipcRenderer.invoke('dialog:openFile');
                
                if (!canceled && filePath && content !== undefined) {
                    await openFile(filePath, content);
                }
            } catch (error) {
                console.error('Error in file open dialog:', error);
                handleError({ message: `Failed to open file dialog: ${error.message}` });
            }
        });
    }

    function updateTabDirtyState(filePath, isDirty) {
        const tab = document.querySelector(`.tab[data-path="${filePath}"]`);
        if (tab) {
            const dirtyIndicator = tab.querySelector('.dirty-indicator');
            if (dirtyIndicator) {
                dirtyIndicator.style.display = isDirty ? 'inline-block' : 'none';
            }
        }
    }

    function createNewTab() {
        const tabId = `untitled-${Date.now()}.pseudo`;
        createOrSwitchToTab(tabId);
        openFiles.set(tabId, {
            content: '',
            originalContent: '',
            dirty: false,
            cursorPosition: { lineNumber: 1, column: 1 },
            scrollPosition: 0
        });
        document.title = `${tabId} - iPseudo IDE`;
    }

    // Initialize the first tab when the DOM is loaded
    // Wait for the editor to be ready
    function initializeFirstTab() {
        if (!window.editor || !window.editor.getModel) {
            setTimeout(initializeFirstTab, 100);
            return;
        }
        createNewTab();
    }
    
    // Start the initialization
    initializeFirstTab();
});
