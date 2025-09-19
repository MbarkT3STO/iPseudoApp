// Minimal clean app.js - renderer wiring for runner.worker.js and ErrorManager

document.addEventListener('DOMContentLoaded', () => {
    const outputConsole = document.getElementById('output');
    const runButton = document.getElementById('btnRun');
    const clearButton = document.getElementById('clearConsole');
    const runStatus = document.getElementById('runStatus');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const appShell = document.querySelector('.app-shell');
    const activityBar = document.querySelector('.activity-bar');

    // Track open files and their content
    const openFiles = new Map();
    let activeFilePath = '';

    // Global tab counter
    let tabCounter = 0;

    function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
    // out: by default include timestamp; for type 'stdout' and 'print' show raw text only
    function out(text, type='info') {
        if (!outputConsole) return;
        const safe = escapeHtml(String(text));

        if (type === 'stdout' || type === 'print') {
            let printContainer = outputConsole.querySelector('.print-output-container');
            if (!printContainer) {
                printContainer = document.createElement('div');
                printContainer.className = 'print-output-container';
                outputConsole.appendChild(printContainer);
            }
            const line = document.createElement('div');
            line.className = 'out raw';
            line.innerHTML = safe;
            printContainer.appendChild(line);
        } else {
            const messageContainer = document.createElement('div');
            messageContainer.className = `out ${type}`;
            if (type === 'success') {
                messageContainer.innerHTML = safe;
            } else {
                const ts = new Date().toLocaleTimeString();
                messageContainer.innerHTML = `[${ts}] ${safe}`;
            }
            outputConsole.appendChild(messageContainer);
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

    if (runButton) runButton.addEventListener('click', async () => {
        // Add running state
        runButton.classList.add('running');
        runButton.disabled = true;
        
        // Update status indicator
        if (runStatus) {
            runStatus.title = 'Status: Running...';
            const statusDot = runStatus.querySelector('.status-dot');
            if (statusDot) statusDot.style.backgroundColor = 'var(--status-running)';
        }
        
        // Get the code and clear console
        const code = window.editor && typeof window.editor.getValue === 'function' ? window.editor.getValue() : '';
        if (outputConsole) outputConsole.innerHTML = '';
        
        try {
            // Execute the code
            await execute(code);
            
            // Update status to success if execution completes without errors
            if (runStatus) {
                runStatus.title = 'Status: Execution completed';
                const statusDot = runStatus.querySelector('.status-dot');
                if (statusDot) statusDot.style.backgroundColor = 'var(--status-success)';
            }
        } catch (error) {
            // Error handling is done in the execute function
            if (runStatus) {
                runStatus.title = 'Status: Error occurred';
                const statusDot = runStatus.querySelector('.status-dot');
                if (statusDot) statusDot.style.backgroundColor = 'var(--status-error)';
            }
        } finally {
            // Reset button state after a short delay to show completion
            setTimeout(() => {
                runButton.classList.remove('running');
                runButton.disabled = false;
            }, 300);
        }
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
        const tabBar = document.getElementById('tabsTrack');
        if (!tabBar) {
            console.error('Tab track not found');
            return;
        }
        
        // Save current editor state before switching
        saveEditorState();
        
        // Check if tab already exists
        const existingTab = tabBar.querySelector(`.modern-tab[data-tab-id="${filePath}"]`);
        if (existingTab) {
            switchToTab(existingTab);
            return;
        }
        
        // Generate a unique tab ID
        const tabId = `tab-${Date.now()}-${++tabCounter}`;
        
        // Create new tab
        const tab = document.createElement('div');
        tab.className = 'modern-tab active';
        tab.dataset.path = filePath;
        tab.dataset.tabId = tabId;
        
        const fileName = filePath.split(/[\\/]/).pop();
        tab.innerHTML = `
            <span class="tab-label">${fileName}</span>
            <span class="dirty-indicator" aria-hidden="true"></span>
            <button class="tab-close" data-tab-id="${tabId}" title="Close">✕</button>
        `;
        
        // Insert before the new tab button
        const newTabButton = document.getElementById('btnNewTab');
        tabBar.insertBefore(tab, newTabButton);
        
        // Update active tab state
        document.querySelectorAll('.modern-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Initialize editor with content
        if (window.editor) {
            window.editor.setValue(initialContent);
            window.editor.focus();
        }
        
        // Update document title
        document.title = `${fileName} - iPseudo IDE`;
        
        // Add to open files if not already there
        if (!openFiles.has(filePath)) {
            openFiles.set(filePath, {
                content: initialContent,
                originalContent: initialContent,
                dirty: false,
                cursorPosition: { lineNumber: 1, column: 1 },
                scrollPosition: 0
            });
        } else {
            // Update existing file data with tab ID
            const fileData = openFiles.get(filePath);
            if (fileData) {
                fileData.tabId = tabId;
                openFiles.set(filePath, fileData);
            }
        }
        
        // Update active file path
        activeFilePath = filePath;
        
        return tab;
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

    // Function to close a tab by its DOM element
    async function closeTabElement(tabElement) {
        if (!tabElement) return;
        
        const tabId = tabElement.dataset.tabId;
        let filePath = tabElement.dataset.path;
        const isNewFile = !filePath || filePath === 'untitled.pseudo' || !filePath.includes('/');
        
        // Get current content from editor if this is the active tab
        let currentContent = '';
        const isActiveTab = tabElement.classList.contains('active');
        if (isActiveTab && window.editor) {
            currentContent = window.editor.getValue();
        } else {
            // If not active, get content from openFiles
            const fileData = openFiles.get(filePath);
            currentContent = fileData?.content || '';
        }
        
        const fileData = openFiles.get(filePath);
        const isEmpty = currentContent.trim() === '';
        const isModified = fileData?.dirty || false;
        
        // Case 1: Empty tab - close immediately
        if (isEmpty) {
            // No need to save, just close the tab
        }
        // Case 2: New unsaved file with content
        else if (isNewFile) {
            const { response } = await window.nodeRequire('electron').ipcRenderer.invoke('show-message-box', {
                type: 'question',
                buttons: ['Save', "Don't Save", 'Cancel'],
                title: 'Save Changes',
                message: 'You have unsaved changes. Do you want to save them?',
                detail: 'Your changes will be lost if you don\'t save them.',
                defaultId: 0,
                cancelId: 2
            });

            if (response === 2) return; // Cancel
            
            if (response === 0) { // Save
                try {
                    const saveResult = await window.nodeRequire('electron').ipcRenderer.invoke('dialog:saveFile', {
                        filePath: undefined, // Show save dialog
                        content: currentContent
                    });

                    if (!saveResult.canceled && saveResult.filePath) {
                        const newPath = saveResult.filePath; // Update filePath with the new saved path
                        tabElement.dataset.path = newPath;
                        const fileName = newPath.split(/[\\/]/).pop();
                        
                        // Update the tab's label
                        tabElement.querySelector('.tab-label').textContent = fileName;
                        
                        // Get or create file data
                        let fileData = openFiles.get(currentPath) || {
                            content: currentContent,
                            originalContent: currentContent,
                            dirty: false,
                            cursorPosition: window.editor.getPosition(),
                            scrollPosition: window.editor.getScrollTop(),
                            tabId: tabId
                        };
                        
                        // Update file data
                        fileData.content = currentContent;
                        fileData.originalContent = currentContent;
                        fileData.dirty = false;
                        
                        // Save with new path
                        openFiles.set(newPath, fileData);
                        
                        // Remove old entry if it exists
                        if (filePath !== tabElement.dataset.path && openFiles.has(tabElement.dataset.path)) {
                            openFiles.delete(tabElement.dataset.path);
                        }
                        
                        // Update active file path if needed
                        if (activeFilePath === tabElement.dataset.path) {
                            activeFilePath = newPath;
                        }
                    }
                } catch (error) {
                    console.error('Error saving file:', error);
                    return; // Don't close if there was an error saving
                }
            }
        }
        // Case 3: Existing file with unsaved changes
        else if (isModified) {
            const fileName = filePath.split(/[\\/]/).pop();
            const { response } = await window.nodeRequire('electron').ipcRenderer.invoke('show-message-box', {
                type: 'question',
                buttons: ['Save', "Don't Save", 'Cancel'],
                title: 'Save Changes',
                message: `Do you want to save the changes to ${fileName}?`,
                detail: 'Your changes will be lost if you don\'t save them.',
                defaultId: 0,
                cancelId: 2
            });

            if (response === 2) return; // Cancel
            
            if (response === 0) { // Save
                try {
                    await window.nodeRequire('electron').ipcRenderer.invoke('dialog:saveFile', {
                        filePath: filePath,
                        content: currentContent
                    });

                    // Update file data to mark as saved
                    if (fileData) {
                        fileData.content = currentContent;
                        fileData.originalContent = currentContent;
                        fileData.dirty = false;
                        openFiles.set(filePath, fileData);
                        updateTabDirtyState(filePath, false);
                    }
                } catch (error) {
                    console.error('Error saving file:', error);
                    return; // Don't close if there was an error saving
                }
            }
        }
        
        // If we get here, it's either:
        // 1. An empty tab (close immediately)
        // 2. User chose to save/don't save a new file
        // 3. User chose to save/don't save changes to an existing file
        
        // Remove tab from DOM
        const wasActive = tabElement.classList.contains('active');
        tabElement.remove();
        
        // Clean up openFiles if this was the last tab with this path
        if (filePath) {
            const isPathUsed = Array.from(document.querySelectorAll('.modern-tab')).some(
                t => t.dataset.path === filePath
            );
            if (!isPathUsed) {
                openFiles.delete(filePath);
            }
        }
        
        // If this was the active tab, switch to another tab
        if (wasActive) {
            const remainingTabs = document.querySelectorAll('.modern-tab:not(#btnNewTab)'); // Exclude the new tab button
            if (remainingTabs.length > 0) {
                // Try to activate the next tab, or previous if no next tab exists
                const nextTab = tabElement.nextElementSibling || tabElement.previousElementSibling;
                if (nextTab && nextTab.id !== 'btnNewTab') {
                    nextTab.click();
                } else if (tabElement.previousElementSibling && tabElement.previousElementSibling.id !== 'btnNewTab') {
                    tabElement.previousElementSibling.click();
                } else if (tabElement.nextElementSibling) {
                    tabElement.nextElementSibling.click();
                }
            } else {
                // Only create new tab if there are absolutely no tabs left
                createNewTab();
            }
        }
    }

    // Update the tab close button click handler
    document.getElementById('tabsContainer')?.addEventListener('click', (e) => {
        const closeButton = e.target.closest('.tab-close');
        if (closeButton) {
            e.stopPropagation();
            const tab = closeButton.closest('.modern-tab');
            if (tab) {
                closeTabElement(tab);
            }
        } else if (e.target.closest('.modern-tab')) {
            // Handle tab switching
            const tab = e.target.closest('.modern-tab');
            if (tab && !tab.classList.contains('active')) {
                switchToTab(tab);
            }
        }
    });

    // Function to update the dirty state of a tab
    function updateTabDirtyState(filePath, isDirty) {
        const tab = document.querySelector(`.modern-tab[data-path="${filePath}"]`);
        if (tab) {
            const dirtyIndicator = tab.querySelector('.dirty-indicator');
            if (dirtyIndicator) {
                dirtyIndicator.style.display = isDirty ? 'inline-block' : 'none';
            }
            tab.classList.toggle('dirty', isDirty);
        }
    }

    function getNextUntitledNumber() {
        const untitledRegex = /^Untitled-(\d+)\.pseudo$/;
        const existingNumbers = [];

        for (const filePath of openFiles.keys()) {
            const match = filePath.match(untitledRegex);
            if (match && match[1]) {
                existingNumbers.push(parseInt(match[1], 10));
            }
        }

        let nextNumber = 1;
        while (existingNumbers.includes(nextNumber)) {
            nextNumber++;
        }
        return nextNumber;
    }

    function createNewTab() {
        const newTabId = `Untitled-${getNextUntitledNumber()}.pseudo`;
        createOrSwitchToTab(newTabId);
        openFiles.set(newTabId, {
            content: '',
            originalContent: '',
            dirty: false,
            cursorPosition: { lineNumber: 1, column: 1 },
            scrollPosition: 0
        });
        document.title = `${newTabId} - iPseudo IDE`;
    }

    // Add event listener for the save button
    const saveButton = document.getElementById('btnSave');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            if (!window.editor) return;
            
            const content = window.editor.getValue();
        const activeTab = document.querySelector('.modern-tab.active');
        if (!activeTab) return;
            
            const currentPath = activeTab.dataset.path;
            const tabId = activeTab.dataset.tabId;
            
            // Check if this is a new/unsaved file
            const isNewFile = !currentPath || currentPath === 'untitled.pseudo' || !currentPath.includes('/');
            
            try {
                if (isNewFile) {
                    // For new files, show save dialog
                    const result = await window.nodeRequire('electron').ipcRenderer.invoke('dialog:saveFile', {
                        filePath: undefined, // This will trigger the save dialog
                        content: content
                    });

                    if (!result.canceled && result.filePath) {
                        const newPath = result.filePath; // Update filePath with the new saved path
                        activeTab.dataset.path = newPath;
                        const fileName = newPath.split(/[\\/]/).pop();
                        
                        // Update the tab's label
                        activeTab.querySelector('.tab-label').textContent = fileName;
                        
                        // Get or create file data
                        let fileData = openFiles.get(currentPath) || {
                            content: content,
                            originalContent: content,
                            dirty: false,
                            cursorPosition: window.editor.getPosition(),
                            scrollPosition: window.editor.getScrollTop(),
                            tabId: tabId
                        };
                        
                        // Update file data
                        fileData.content = content;
                        fileData.originalContent = content;
                        fileData.dirty = false;
                        
                        // Save with new path
                        openFiles.set(newPath, fileData);
                        
                        // Remove old entry if it exists and is different
                        if (currentPath && currentPath !== newPath) {
                            openFiles.delete(currentPath);
                        }
                        
                        // Update active file path
                        activeFilePath = newPath;
                        
                        // Update the tab's dirty state
                        updateTabDirtyState(newPath, false);
                        out(`File saved: ${newPath}`, 'success');
                    }
                } else {
                    // For existing files, save directly
                    const result = await window.nodeRequire('electron').ipcRenderer.invoke('dialog:saveFile', {
                        filePath: currentPath,
                        content: content
                    });
                    
                    if (!result.canceled) {
                        // Update file data
                        const fileData = openFiles.get(currentPath);
                        if (fileData) {
                            fileData.content = content;
                            fileData.originalContent = content;
                            fileData.dirty = false;
                            openFiles.set(currentPath, fileData);
                            updateTabDirtyState(currentPath, false);
                            out(`File saved: ${currentPath}`, 'success');
                        }
                    }
                }
            } catch (error) {
                console.error('Error saving file:', error);
                out(`Error saving file: ${error.message}`, 'error');
            }
        });
    }

    // Add event listener for the new button
    const newButton = document.getElementById('btnNew');
    if (newButton) {
        newButton.addEventListener('click', () => {
            createNewTab();
        });
    }

    // Add event listener for the new tab button
    const newTabButton = document.getElementById('btnNewTab');
    if (newTabButton) {
        newTabButton.addEventListener('click', () => {
            createNewTab();
        });
    }

    // Add event listeners for new action buttons
    const formatButton = document.getElementById('btnFormat');
    if (formatButton) {
        formatButton.addEventListener('click', () => {
            if (window.editor) {
                // Basic formatting - you can enhance this
                const content = window.editor.getValue();
                // Simple indentation fix
                const formatted = content.split('\n').map(line => {
                    // Basic indentation logic
                    return line.trim() ? line : line;
                }).join('\n');
                window.editor.setValue(formatted);
                out('Code formatted', 'success');
            }
        });
    }

    const minimapButton = document.getElementById('btnMinimap');
    if (minimapButton) {
        minimapButton.addEventListener('click', () => {
            if (window.editor) {
                const currentValue = window.editor.getOption('minimap');
                window.editor.updateOptions({ minimap: { enabled: !currentValue.enabled } });
                minimapButton.classList.toggle('active', !currentValue.enabled);
                out(`Minimap ${!currentValue.enabled ? 'enabled' : 'disabled'}`, 'info');
            }
        });
    }

    const wordWrapButton = document.getElementById('btnWordWrap');
    if (wordWrapButton) {
        wordWrapButton.addEventListener('click', () => {
            if (window.editor) {
                const currentValue = window.editor.getOption('wordWrap');
                window.editor.updateOptions({ wordWrap: currentValue === 'on' ? 'off' : 'on' });
                wordWrapButton.classList.toggle('active', currentValue !== 'on');
                out(`Word wrap ${currentValue === 'on' ? 'disabled' : 'enabled'}`, 'info');
            }
        });
    }

    const copyOutputButton = document.getElementById('btnCopyOutput');
    if (copyOutputButton) {
        copyOutputButton.addEventListener('click', () => {
            if (outputConsole) {
                const text = outputConsole.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    out('Output copied to clipboard', 'success');
                }).catch(() => {
                    out('Failed to copy output', 'error');
                });
            }
        });
    }

    const exportOutputButton = document.getElementById('btnExportOutput');
    if (exportOutputButton) {
        exportOutputButton.addEventListener('click', () => {
            if (outputConsole) {
                const text = outputConsole.innerText;
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `output-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                out('Output exported', 'success');
            }
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

    // Sidebar and Activity Bar Interactivity
    if (sidebarToggle && appShell) {
        sidebarToggle.addEventListener('click', () => {
            appShell.classList.toggle('sidebar-collapsed');
        });
    }

    if (activityBar) {
        activityBar.addEventListener('click', (e) => {
            const target = e.target.closest('.activity-bar-item');
            if (!target || !target.dataset.view) return;

            const viewId = target.dataset.view;

            // Update active button in activity bar
            document.querySelectorAll('.activity-bar-item').forEach(item => item.classList.remove('active'));
            target.classList.add('active');

            // Update visible view in sidebar
            document.querySelectorAll('.sidebar-view').forEach(view => view.classList.remove('active'));
            const activeView = document.getElementById(`view-${viewId}`);
            if (activeView) {
                activeView.classList.add('active');
            }
        });
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
