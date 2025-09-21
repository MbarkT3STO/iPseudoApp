// Minimal clean app.ts - renderer wiring for runner.worker.js and ErrorManager

interface FileData {
    content: string;
    dirty: boolean;
    originalContent: string;
    cursorPosition: { lineNumber: number; column: number };
    scrollPosition: number;
    tabId?: string;
}

interface ErrorManagerType {
    updateDecorations?: (editor: any, decorations: any[]) => void;
}

interface SaveResult {
    canceled: boolean;
    filePath?: string;
}

interface OpenFileResult {
    canceled: boolean;
    filePath?: string;
    content?: string;
}

interface MessageBoxResult {
    response: number;
}

// Extend window interface
interface Window {
    editor: any;
    ErrorManager?: new () => ErrorManagerType;
    nodeRequire?: any;
    openFiles: Map<string, FileData>;
    activeFilePath: string;
    electron?: {
        openExternal: (url: string) => Promise<void>;
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const outputConsole = document.getElementById('output') as HTMLElement | null;
    const runButton = document.getElementById('btnRun') as HTMLButtonElement | null;
    const stopButton = document.getElementById('btnStop') as HTMLButtonElement | null;
    const clearButton = document.getElementById('clearConsole') as HTMLButtonElement | null;
    const runStatus = document.getElementById('runStatus') as HTMLElement | null;
    const sidebarToggle = document.getElementById('sidebar-toggle') as HTMLElement | null;
    const appShell = document.querySelector('.app-shell') as HTMLElement | null;
    const activityBar = document.querySelector('.activity-bar') as HTMLElement | null;

    // Track open files and their content
    const openFiles = new Map<string, FileData>();
    let activeFilePath = '';

    // Global tab counter
    let tabCounter = 0;
    
    // Execution state management
    let isExecuting = false;
    let executionStopped = false;

    // Make these globally available
    (window as any).openFiles = openFiles;
    (window as any).activeFilePath = activeFilePath || '';

    // Setup MutationObserver for automatic scrolling
    let autoScrollEnabled = true;
    let mutationObserver: MutationObserver | null = null;
    
    function setupAutoScrollObserver(): void {
        if (!outputConsole || mutationObserver) return;
        
        mutationObserver = new MutationObserver((mutations) => {
            if (!autoScrollEnabled) return;
            
            let shouldScroll = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldScroll = true;
                }
            });
            
            if (shouldScroll) {
                // Use a small delay to ensure DOM is fully updated
                setTimeout(() => {
                    scrollOutputToBottom();
                    scrollLastElementIntoView();
                }, 10);
            }
        });
        
        mutationObserver.observe(outputConsole, {
            childList: true,
            subtree: true
        });
    }

    function escapeHtml(s: string): string { 
        return String(s).replace(/[&<>"']/g, c => {
            const escapeMap: {[key: string]: string} = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
            return escapeMap[c] || c;
        }); 
    }

    // Function to scroll output console to bottom
    function scrollOutputToBottom(): void {
        if (!outputConsole) {
            console.warn('Output console element not found');
            return;
        }
        
        // Enhanced scrolling function that ensures we reach the absolute bottom
        const scrollToAbsoluteBottom = () => {
            // Get the actual scrollable height
            const scrollHeight = outputConsole.scrollHeight;
            const clientHeight = outputConsole.clientHeight;
            const maxScroll = scrollHeight - clientHeight;
            
            console.log('Scroll details:', {
                scrollHeight,
                clientHeight,
                maxScroll,
                currentScrollTop: outputConsole.scrollTop
            });
            
            // Method 1: Use scrollTo with exact positioning
            try {
                outputConsole.scrollTo({
                    top: scrollHeight,
                    behavior: 'smooth'
                });
            } catch (e) {
                // Fallback: direct assignment
                outputConsole.scrollTop = scrollHeight;
            }
            
            // Method 2: Force scroll to absolute bottom with multiple attempts
            setTimeout(() => {
                outputConsole.scrollTop = scrollHeight;
                // Add extra padding to ensure we're at the very bottom
                outputConsole.scrollTop = outputConsole.scrollHeight + 100;
                // Then set to exact bottom
                outputConsole.scrollTop = outputConsole.scrollHeight;
            }, 10);
            
            // Method 3: Final verification and correction
            setTimeout(() => {
                const finalScrollTop = outputConsole.scrollTop;
                const finalScrollHeight = outputConsole.scrollHeight;
                const finalClientHeight = outputConsole.clientHeight;
                const shouldBeAt = finalScrollHeight - finalClientHeight;
                
                console.log('Final scroll check:', {
                    current: finalScrollTop,
                    shouldBe: shouldBeAt,
                    difference: Math.abs(finalScrollTop - shouldBeAt)
                });
                
                // If we're not at the bottom, force it
                if (Math.abs(finalScrollTop - shouldBeAt) > 1) {
                    outputConsole.scrollTop = finalScrollHeight;
                    console.log('Corrected scroll position');
                }
            }, 50);
        };
        
        // Use multiple timing approaches to ensure scrolling works
        requestAnimationFrame(() => {
            scrollToAbsoluteBottom();
            
            // Additional attempts with different timings
            setTimeout(scrollToAbsoluteBottom, 20);
            setTimeout(scrollToAbsoluteBottom, 100);
            setTimeout(scrollToAbsoluteBottom, 200);
        });
    }

    // Function to scroll the last element into view
    function scrollLastElementIntoView(): void {
        if (!outputConsole) return;
        
        // Find the last child element
        const children = outputConsole.children;
        if (children.length > 0) {
            const lastElement = children[children.length - 1] as HTMLElement;
            
            console.log('Scrolling last element into view:', lastElement);
            
            try {
                // Use scrollIntoView to ensure the last element is visible
                lastElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                });
            } catch (e) {
                // Fallback: manually calculate and scroll
                const elementRect = lastElement.getBoundingClientRect();
                const containerRect = outputConsole.getBoundingClientRect();
                const relativeTop = elementRect.top - containerRect.top + outputConsole.scrollTop;
                
                outputConsole.scrollTo({
                    top: relativeTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    // out: by default include timestamp; for type 'stdout' and 'print' show raw text only
    function out(text: string, type: string = 'info'): void {
        if (!outputConsole) return;
        const safe = escapeHtml(String(text));

        if (type === 'stdout' || type === 'print') {
            let printContainer = outputConsole.querySelector('.print-output-container') as HTMLElement | null;
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
        
        // Auto-scroll to bottom after adding new content
        // Use multiple approaches to ensure scrolling works
        setTimeout(() => {
            scrollOutputToBottom();
            // Also try scrolling the last element into view
            scrollLastElementIntoView();
        }, 0);
        
        // Also scroll immediately
        scrollOutputToBottom();
    }

    if (clearButton) clearButton.addEventListener('click', () => { 
        if (outputConsole) {
            outputConsole.innerHTML = '';
            scrollOutputToBottom();
        }
    });

    const ErrorManagerCtor = (window as any).ErrorManager || null;
    const errorManager = ErrorManagerCtor ? new ErrorManagerCtor() : null;

    let runnerWorker: Worker | null = null;

    function cleanupWorker(): void {
        if (runnerWorker) {
            try { 
                runnerWorker.onmessage = null; 
                runnerWorker.onerror = null; 
                runnerWorker.terminate(); 
            } catch(e) { 
                console.error(e); 
            }
            runnerWorker = null;
        }
        
        // Reset execution state
        isExecuting = false;
        executionStopped = false;
        
        // Update UI state
        if (runButton) {
            runButton.disabled = false;
            runButton.style.display = 'flex';
        }
        if (stopButton) {
            stopButton.style.display = 'none';
            stopButton.disabled = true;
        }
        if (runStatus) runStatus.title = 'Idle';
    }

    function stopExecution(): void {
        if (isExecuting && runnerWorker) {
            executionStopped = true;
            
            // Send stop message to worker
            try {
                runnerWorker.postMessage({ type: 'stop' });
            } catch(e) {
                console.error('Error sending stop message to worker:', e);
            }
            
            // Force cleanup after a short delay
            setTimeout(() => {
                cleanupWorker();
                out('Execution stopped by user', 'warning');
            }, 100);
        }
    }

    function handleError(err: any, src?: string): void {
        // Check if this is a pre-formatted error message from the worker
        if (err.formatted) {
            // Split the message into lines and handle each line appropriately
            const lines = (err.message || '').split('\n');
            
            // Display the main error message (first line) with proper styling
            if (lines.length > 0) {
                const mainError = lines[0];
                outputConsole!.innerHTML += `<div class="error-message">${mainError}</div>`;
            }
            
            // Display the rest of the error message with context
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                // Style different parts of the error message
                if (line.startsWith('At line')) {
                    outputConsole!.innerHTML += `<div class="error-location">${line}</div>`;
                } else if (line.startsWith('  ') && line.trim() !== '^') {
                    // This is a line of code with the error
                    outputConsole!.innerHTML += `<div class="error-code"><pre>${line}</pre></div>`;
                } else if (line.trim() === '^') {
                    // This is the pointer to the error location
                    outputConsole!.innerHTML += `<div class="error-pointer">${line}</div>`;
                } else if (line.startsWith('Previous line')) {
                    outputConsole!.innerHTML += `<div class="error-context">${line}</div>`;
                } else if (line.startsWith('💡')) {
                    // This is a tip/suggestion
                    outputConsole!.innerHTML += `<div class="error-tip">${line}</div>`;
                } else {
                    // Default styling for other lines
                    outputConsole!.innerHTML += `<div>${line}</div>`;
                }
            }
            
            // Add a separator after the error
            outputConsole!.innerHTML += '<div class="error-separator"></div>';
            
            // Scroll to the bottom to show the error
            scrollOutputToBottom();
            return;
        }
        
        // Handle pseudo-code validation errors
        if (err.issues && Array.isArray(err.issues)) {
            err.issues.forEach((issue: any) => {
                out(`Error at line ${issue.line}: ${issue.message}`, 'error');
                out(`  ${issue.text.trim()}`, 'error');
                
                // Try to highlight the error in the editor if possible
                if (errorManager && (window as any).editor && typeof (window as any).editor.getModel === 'function') {
                    try {
                        const model = (window as any).editor.getModel();
                        const decoration = {
                            message: issue.message,
                            line: issue.line,
                            originalText: issue.text.trim()
                        };
                        if (typeof errorManager.updateDecorations === 'function') {
                            errorManager.updateDecorations((window as any).editor, [decoration]);
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
            if (errorManager && (window as any).editor && typeof (window as any).editor.getModel === 'function') {
                try {
                    const model = (window as any).editor.getModel();
                    const decoration: any = {
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
                        errorManager.updateDecorations((window as any).editor, [decoration]);
                    }
                    
                    // If we have a suggestion, display it
                    if (decoration.suggestion) {
                        out(`Suggestion: ${decoration.suggestion}`, 'info');
                    }

                    // Scroll to the error line in the editor
                    if (lineNum !== 'unknown') {
                        (window as any).editor.revealLineInCenter(parseInt(lineNum as string, 10));
                        (window as any).editor.setPosition({ lineNumber: parseInt(lineNum as string, 10), column: 1 });
                        (window as any).editor.focus();
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

    function execute(code: string): void {
        if (!code || !code.trim()) { out('Nothing to run','warning'); return; }
        try {
            // Set execution state
            isExecuting = true;
            executionStopped = false;
            
            // Update UI state
            if (runButton) {
                runButton.disabled = true;
                runButton.style.display = 'none';
            }
            if (stopButton) {
                stopButton.style.display = 'flex';
                stopButton.disabled = false;
            }
            if (runStatus) runStatus.title = 'Running';

            cleanupWorker();
            runnerWorker = new Worker('./scripts/runner.worker.js');

            // If the code looks like pseudocode, send a slightly longer timeout.
            const isPseudo = /\bprint\b|\bvar\b|\bfor\b|\bendfor\b/i.test(code);
            const timeout = isPseudo ? 8000 : 5000;

            runnerWorker.onerror = (e) => { 
                out('Worker error: ' + (e && e.message ? e.message : JSON.stringify(e)), 'error'); 
                cleanupWorker(); 
            };

            runnerWorker.onmessage = (ev) => {
                const m = ev.data; 
                if (!m) return;
                
                // Check if execution was stopped
                if (executionStopped) {
                    cleanupWorker();
                    return;
                }
                
                try {
                    if (m.type === 'stdout') { 
                        (m.text || '').split('\n').forEach((l: string) => { 
                            if (l.trim()) out(l, 'stdout'); 
                        }); 
                    }
                    else if (m.type === 'stderr') { 
                        out(m.text || 'stderr', 'error'); 
                    }
                    else if (m.type === 'error') { 
                        const eobj = m.error || { message: m.message || m.text || 'error' }; 
                        const e = new Error(eobj.message); 
                        (e as any).name = eobj.name || 'Error'; 
                        e.stack = eobj.stack || ''; 
                        handleError(e, code); 
                        cleanupWorker(); 
                    }
                    else if (m.type === 'input-request') { 
                        const val = window.prompt(m.prompt || 'Input:') || ''; 
                        runnerWorker!.postMessage({ type: 'input-response', id: m.id, value: val }); 
                    }
                    else if (m.type === 'done') { 
                        if (!executionStopped) {
                            out('Done', 'info'); 
                        }
                        cleanupWorker(); 
                    }
                    else { 
                        console.warn('unknown message', m); 
                    }
                } catch(err) { 
                    out('Message handler error: ' + (err as Error).message, 'error'); 
                    cleanupWorker(); 
                }
            };

            runnerWorker.postMessage({ code, timeout });
        } catch(err) { 
            handleError(err, code); 
            cleanupWorker(); 
        }
    }

    if (runButton) runButton.addEventListener('click', async () => {
        // Add running state
        runButton.classList.add('running');
        runButton.disabled = true;
        
        // Update status indicator
        if (runStatus) {
            runStatus.title = 'Status: Running...';
            const statusDot = runStatus.querySelector('.status-dot') as HTMLElement | null;
            if (statusDot) statusDot.style.backgroundColor = 'var(--status-running)';
        }
        
        // Get the code and clear console
        const code = (window as any).editor && typeof (window as any).editor.getValue === 'function' ? (window as any).editor.getValue() : '';
        if (outputConsole) {
            outputConsole.innerHTML = '';
            scrollOutputToBottom();
        }
        
        try {
            // Execute the code
            await execute(code);
            
            // Update status to success if execution completes without errors
            if (runStatus) {
                runStatus.title = 'Status: Execution completed';
                const statusDot = runStatus.querySelector('.status-dot') as HTMLElement | null;
                if (statusDot) statusDot.style.backgroundColor = 'var(--status-success)';
            }
        } catch (error) {
            // Error handling is done in the execute function
            if (runStatus) {
                runStatus.title = 'Status: Error occurred';
                const statusDot = runStatus.querySelector('.status-dot') as HTMLElement | null;
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

    // Stop button event listener
    if (stopButton) {
        stopButton.addEventListener('click', () => {
            stopExecution();
        });
    }

    // Function to save the current editor state
    function saveEditorState(): void {
        if (!(window as any).editor || !activeFilePath || !(window as any).editor.getModel) return;
        
        try {
            const content = (window as any).editor.getValue();
            const position = (window as any).editor.getPosition();
            const scrollTop = (window as any).editor.getScrollTop ? (window as any).editor.getScrollTop() : 0;
            
            if (openFiles.has(activeFilePath)) {
                const file = openFiles.get(activeFilePath)!;
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
    function refreshEditorForCurrentTab(): void {
        if (!(window as any).editor || !activeFilePath || !(window as any).editor.getModel) {
            // If editor isn't ready, try again shortly
            if (activeFilePath && !(window as any).editor) {
                setTimeout(refreshEditorForCurrentTab, 100);
            }
            return;
        }
        
        const file = openFiles.get(activeFilePath);
        if (!file) {
            console.warn('No file data found for:', activeFilePath);
            return;
        }
        
        try {
            const model = (window as any).editor.getModel();
            if (!model) return;
            
            // Update editor content
            const currentContent = model.getValue();
            if (currentContent !== file.content) {
                model.setValue(file.content || '');
            }
            
            // Restore cursor position
            if (file.cursorPosition) {
                (window as any).editor.setPosition(file.cursorPosition);
                (window as any).editor.revealPositionInCenter(file.cursorPosition);
            }
            
            // Restore scroll position
            if (file.scrollPosition !== undefined && (window as any).editor.setScrollTop) {
                (window as any).editor.setScrollTop(file.scrollPosition);
            }
            
            // Update window title
            const fileName = activeFilePath.split('/').pop();
            document.title = `${fileName}${file.dirty ? ' *' : ''} - iPseudo IDE`;
            
            // Focus the editor
            (window as any).editor.focus();
            
        } catch (e) {
            console.error('Error refreshing editor:', e);
        }
    }

    // Function to open a file in a new tab
    async function openFile(filePath: string, content: string): Promise<void> {
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
            handleError({ message: `Failed to open file: ${(error as Error).message}` });
        }
    }

    // Function to create or switch to a tab
    function createOrSwitchToTab(filePath: string, initialContent: string = ''): HTMLElement | undefined {
        const tabBar = document.getElementById('tabsTrack');
        if (!tabBar) {
            console.error('Tab track not found');
            return;
        }
        
        // Save current editor state before switching
        saveEditorState();
        
        // Check if tab already exists
        const existingTab = tabBar.querySelector(`.modern-tab[data-tab-id="${filePath}"]`) as HTMLElement | null;
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
        tab.style.animation = 'tabSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const fileName = filePath.split(/[\\/]/).pop();
        tab.innerHTML = `
            <span class="tab-label">${fileName}</span>
            <span class="dirty-indicator" aria-hidden="true"></span>
            <button class="modern-tab-close" data-tab-id="${tabId}" title="Close">✕</button>
        `;
        
        // Insert the new tab at the end of the tabs track
        tabBar.appendChild(tab);
        
        // Update active tab state
        document.querySelectorAll('.modern-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Initialize editor with content
        if ((window as any).editor) {
            (window as any).editor.setValue(initialContent);
            (window as any).editor.focus();
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
                scrollPosition: 0,
                tabId: tabId
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
        (window as any).activeFilePath = activeFilePath || '';
        
        return tab;
    }

    // Function to switch tabs
    function switchToTab(tab: HTMLElement): void {
        if (!tab) return;
        
        const filePath = tab.dataset.path;
        if (!filePath) return;
        
        // Save current editor state before switching
        saveEditorState();
        
        // Update active tab - remove active from all tabs first
        document.querySelectorAll('.modern-tab').forEach(t => {
            t.classList.remove('active');
        });
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Add bounce animation
        tab.style.animation = 'tabBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
            tab.style.animation = '';
        }, 600);
        
        // Update active file path
        activeFilePath = filePath;
        (window as any).activeFilePath = activeFilePath || '';
        
        // Refresh editor content for the new tab
        refreshEditorForCurrentTab();
        
        // Focus the editor
        if ((window as any).editor) {
            (window as any).editor.focus();
        }
    }

    // Function to close a tab by its DOM element
    async function closeTabElement(tabElement: HTMLElement): Promise<void> {
        if (!tabElement) return;
        
        const tabId = tabElement.dataset.tabId;
        let filePath = tabElement.dataset.path || '';
        const isNewFile = !filePath || filePath === 'untitled.pseudo' || !filePath.includes('/');
        
        // Get current content from editor if this is the active tab
        let currentContent = '';
        const isActiveTab = tabElement.classList.contains('active');
        if (isActiveTab && (window as any).editor) {
            currentContent = (window as any).editor.getValue();
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
            const result = await (window as any).nodeRequire('electron').ipcRenderer.invoke('show-message-box', {
                type: 'question',
                buttons: ['Save', "Don't Save", 'Cancel'],
                title: 'Save Changes',
                message: 'You have unsaved changes. Do you want to save them?',
                detail: 'Your changes will be lost if you don\'t save them.',
                defaultId: 0,
                cancelId: 2
            }) as MessageBoxResult;

            if (result.response === 2) return; // Cancel
            
            if (result.response === 0) { // Save
                try {
                    const saveResult = await (window as any).nodeRequire('electron').ipcRenderer.invoke('dialog:saveFile', {
                        filePath: undefined, // Show save dialog
                        content: currentContent
                    }) as SaveResult;

                    if (!saveResult.canceled && saveResult.filePath) {
                        const newPath = saveResult.filePath; // Update filePath with the new saved path
                        tabElement.dataset.path = newPath;
                        const fileName = newPath.split(/[\\/]/).pop();
                        
                        // Update the tab's label
                        const tabLabel = tabElement.querySelector('.tab-label');
                        if (tabLabel) tabLabel.textContent = fileName || '';
                        
                        // Get or create file data
                        let fileData = openFiles.get(filePath) || {
                            content: currentContent,
                            originalContent: currentContent,
                            dirty: false,
                            cursorPosition: (window as any).editor.getPosition(),
                            scrollPosition: (window as any).editor.getScrollTop(),
                            tabId: tabId
                        };
                        
                        // Update file data
                        fileData.content = currentContent;
                        fileData.originalContent = currentContent;
                        fileData.dirty = false;
                        
                        // Save with new path
                        openFiles.set(newPath, fileData);
                        
                        // Remove old entry if it exists
                        if (filePath !== tabElement.dataset.path && openFiles.has(tabElement.dataset.path || '')) {
                            openFiles.delete(tabElement.dataset.path || '');
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
            const result = await (window as any).nodeRequire('electron').ipcRenderer.invoke('show-message-box', {
                type: 'question',
                buttons: ['Save', "Don't Save", 'Cancel'],
                title: 'Save Changes',
                message: `Do you want to save the changes to ${fileName}?`,
                detail: 'Your changes will be lost if you don\'t save them.',
                defaultId: 0,
                cancelId: 2
            }) as MessageBoxResult;

            if (result.response === 2) return; // Cancel
            
            if (result.response === 0) { // Save
                try {
                    await (window as any).nodeRequire('electron').ipcRenderer.invoke('dialog:saveFile', {
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
        
        // Remove tab from DOM with animation
        const wasActive = tabElement.classList.contains('active');
        
        // Add slide-out animation
        tabElement.style.animation = 'tabSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            tabElement.remove();
        }, 300);
        
        // Clean up openFiles if this was the last tab with this path
        if (filePath) {
            const isPathUsed = Array.from(document.querySelectorAll('.modern-tab')).some(
                t => (t as HTMLElement).dataset.path === filePath
            );
            if (!isPathUsed) {
                openFiles.delete(filePath);
            }
        }
        
        // If this was the active tab, switch to another tab
        if (wasActive) {
            const remainingTabs = document.querySelectorAll('.modern-tab');
            if (remainingTabs.length > 0) {
                // Find the best tab to switch to
                let targetTab: HTMLElement | null = null;
                
                // First, try to find the next tab
                targetTab = tabElement.nextElementSibling as HTMLElement | null;
                
                // If no next tab, try the previous tab
                if (!targetTab) {
                    targetTab = tabElement.previousElementSibling as HTMLElement | null;
                }
                
                // If still no tab, get the last remaining tab
                if (!targetTab && remainingTabs.length > 0) {
                    targetTab = remainingTabs[remainingTabs.length - 1] as HTMLElement;
                }
                
                // Switch to the target tab
                if (targetTab) {
                    switchToTab(targetTab);
                }
            } else {
                // Only create new tab if there are absolutely no tabs left
                createNewTab();
            }
        }
    }

    // Update the tab click handler
    document.getElementById('tabsContainer')?.addEventListener('click', (e) => {
        const closeButton = (e.target as HTMLElement).closest('.modern-tab-close');
        if (closeButton) {
            e.preventDefault();
            e.stopPropagation();
            const tab = closeButton.closest('.modern-tab') as HTMLElement | null;
            if (tab) {
                closeTabElement(tab);
            }
            return;
        }
        
        const tab = (e.target as HTMLElement).closest('.modern-tab') as HTMLElement | null;
        if (tab) {
            e.preventDefault();
            e.stopPropagation();
            switchToTab(tab);
        }
    });
    
    // Add right-click context menu for tabs
    document.getElementById('tabsContainer')?.addEventListener('contextmenu', (e) => {
        const tab = (e.target as HTMLElement).closest('.modern-tab') as HTMLElement | null;
        if (tab) {
            e.preventDefault();
            e.stopPropagation();
            
            // Create context menu
            const contextMenu = document.createElement('div');
            contextMenu.className = 'tab-context-menu';
            contextMenu.innerHTML = `
                <div class="context-menu-item" data-action="close">
                    <i class="ri-close-line"></i>
                    <span>Close Tab</span>
                </div>
                <div class="context-menu-item" data-action="close-others">
                    <i class="ri-close-circle-line"></i>
                    <span>Close Other Tabs</span>
                </div>
                <div class="context-menu-item" data-action="close-all">
                    <i class="ri-close-circle-fill"></i>
                    <span>Close All Tabs</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="duplicate">
                    <i class="ri-file-copy-line"></i>
                    <span>Duplicate Tab</span>
                </div>
            `;
            
            // Position the context menu
            contextMenu.style.position = 'fixed';
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';
            contextMenu.style.zIndex = '1000';
            
            document.body.appendChild(contextMenu);
            
            // Handle context menu actions
            contextMenu.addEventListener('click', (e) => {
                const action = (e.target as HTMLElement).closest('.context-menu-item')?.getAttribute('data-action');
                if (action) {
                    switch (action) {
                        case 'close':
                            closeTabElement(tab);
                            break;
                        case 'close-others':
                            closeOtherTabs(tab);
                            break;
                        case 'close-all':
                            closeAllTabs();
                            break;
                        case 'duplicate':
                            duplicateTab(tab);
                            break;
                    }
                }
                contextMenu.remove();
            });
            
            // Remove context menu when clicking outside
            const removeContextMenu = (e: Event) => {
                if (!contextMenu.contains(e.target as Node)) {
                    contextMenu.remove();
                    document.removeEventListener('click', removeContextMenu);
                }
            };
            
            setTimeout(() => {
                document.addEventListener('click', removeContextMenu);
            }, 100);
        }
    });

    // Function to update the dirty state of a tab
    function updateTabDirtyState(filePath: string, isDirty: boolean): void {
        const tab = document.querySelector(`.modern-tab[data-path="${filePath}"]`);
        if (tab) {
            const dirtyIndicator = tab.querySelector('.dirty-indicator') as HTMLElement | null;
            if (dirtyIndicator) {
                dirtyIndicator.style.display = isDirty ? 'inline-block' : 'none';
            }
            tab.classList.toggle('dirty', isDirty);
        }
    }

    // Make updateTabDirtyState globally available
    (window as any).updateTabDirtyState = updateTabDirtyState;

    function getNextUntitledNumber(): number {
        const untitledRegex = /^Untitled-(\d+)\.pseudo$/;
        const existingNumbers: number[] = [];

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

    function createNewTab(): void {
        const newTabId = `Untitled-${getNextUntitledNumber()}.pseudo`;
        
        // Add to open files first
        openFiles.set(newTabId, {
            content: '',
            originalContent: '',
            dirty: false,
            cursorPosition: { lineNumber: 1, column: 1 },
            scrollPosition: 0
        });
        
        // Create the tab
        createOrSwitchToTab(newTabId, '');
        
        // Update document title
        document.title = `${newTabId} - iPseudo IDE`;
    }

    // Helper functions for context menu
    function closeOtherTabs(keepTab: HTMLElement): void {
        const allTabs = document.querySelectorAll('.modern-tab');
        allTabs.forEach(tab => {
            if (tab !== keepTab) {
                closeTabElement(tab as HTMLElement);
            }
        });
    }

    function closeAllTabs(): void {
        const allTabs = document.querySelectorAll('.modern-tab');
        allTabs.forEach(tab => {
            closeTabElement(tab as HTMLElement);
        });
    }

    function duplicateTab(tab: HTMLElement): void {
        const filePath = tab.dataset.path;
        if (!filePath) return;
        
        const file = openFiles.get(filePath);
        if (file) {
            const newTabId = `Untitled-${getNextUntitledNumber()}.pseudo`;
            openFiles.set(newTabId, {
                content: file.content,
                originalContent: file.content,
                dirty: true,
                cursorPosition: { lineNumber: 1, column: 1 },
                scrollPosition: 0
            });
            createOrSwitchToTab(newTabId, file.content);
        }
    }

    // Add event listener for the save button
    const saveButton = document.getElementById('btnSave');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            if (!(window as any).editor) return;
            
            const content = (window as any).editor.getValue();
            const activeTab = document.querySelector('.modern-tab.active') as HTMLElement | null;
            if (!activeTab) return;
            
            const currentPath = activeTab.dataset.path || '';
            const tabId = activeTab.dataset.tabId;
            
            // Check if this is a new/unsaved file
            const isNewFile = !currentPath || currentPath === 'untitled.pseudo' || !currentPath.includes('/');
            
            try {
                if (isNewFile) {
                    // For new files, show save dialog
                    const result = await (window as any).electron.saveFile({
                        filePath: undefined, // This will trigger the save dialog
                        content: content
                    }) as SaveResult;

                    if (!result.canceled && result.filePath) {
                        const newPath = result.filePath; // Update filePath with the new saved path
                        activeTab.dataset.path = newPath;
                        const fileName = newPath.split(/[\\/]/).pop();
                        
                        // Update the tab's label
                        const tabLabel = activeTab.querySelector('.tab-label');
                        if (tabLabel) tabLabel.textContent = fileName || '';
                        
                        // Get or create file data
                        let fileData = openFiles.get(currentPath) || {
                            content: content,
                            originalContent: content,
                            dirty: false,
                            cursorPosition: (window as any).editor.getPosition(),
                            scrollPosition: (window as any).editor.getScrollTop(),
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
                    const result = await (window as any).electron.saveFile({
                        filePath: currentPath,
                        content: content
                    }) as SaveResult;
                    
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
                out(`Error saving file: ${(error as Error).message}`, 'error');
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
        newTabButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            createNewTab();
        });
    } else {
        console.error('New tab button not found');
    }

    // Add event listeners for new action buttons
    const formatButton = document.getElementById('btnFormat');
    if (formatButton) {
        formatButton.addEventListener('click', () => {
            if ((window as any).editor) {
                // Basic formatting - you can enhance this
                const content = (window as any).editor.getValue();
                // Simple indentation fix
                const formatted = content.split('\n').map((line: string) => {
                    // Basic indentation logic
                    return line.trim() ? line : line;
                }).join('\n');
                (window as any).editor.setValue(formatted);
                out('Code formatted', 'success');
            }
        });
    }

    const minimapButton = document.getElementById('btnMinimap');
    if (minimapButton) {
        minimapButton.addEventListener('click', () => {
            if ((window as any).editor) {
                const currentValue = (window as any).editor.getOption('minimap');
                (window as any).editor.updateOptions({ minimap: { enabled: !currentValue.enabled } });
                minimapButton.classList.toggle('active', !currentValue.enabled);
                out(`Minimap ${!currentValue.enabled ? 'enabled' : 'disabled'}`, 'info');
            }
        });
    }

    const wordWrapButton = document.getElementById('btnWordWrap');
    if (wordWrapButton) {
        wordWrapButton.addEventListener('click', () => {
            if ((window as any).editor) {
                const currentValue = (window as any).editor.getOption('wordWrap');
                (window as any).editor.updateOptions({ wordWrap: currentValue === 'on' ? 'off' : 'on' });
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

    // Layout toggle functionality
    const layoutToggleButton = document.getElementById('layoutToggle');
    const layoutIcon = document.getElementById('layoutIcon');
    const editorLayout = document.querySelector('.editor-layout') as HTMLElement;
    
    if (layoutToggleButton && layoutIcon && editorLayout) {
        layoutToggleButton.addEventListener('click', () => {
            const isSideBySide = editorLayout.classList.contains('side-by-side');
            
            if (isSideBySide) {
                // Switch to vertical layout
                editorLayout.classList.remove('side-by-side');
                layoutIcon.className = 'ri-layout-column-line';
                out('Switched to vertical layout', 'info');
            } else {
                // Switch to side-by-side layout
                editorLayout.classList.add('side-by-side');
                layoutIcon.className = 'ri-layout-row-line';
                out('Switched to 50/50 side-by-side layout', 'info');
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
                const result = await (window as any).electron.openFile() as OpenFileResult;
                
                if (!result.canceled && result.filePath && result.content !== undefined) {
                    await openFile(result.filePath, result.content);
                }
            } catch (error) {
                console.error('Error in file open dialog:', error);
                handleError({ message: `Failed to open file dialog: ${(error as Error).message}` });
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
            const target = (e.target as HTMLElement).closest('.activity-bar-item') as HTMLElement | null;
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
    function initializeFirstTab(): void {
        if (!(window as any).editor || !(window as any).editor.getModel) {
            setTimeout(initializeFirstTab, 100);
            return;
        }
        
        // Only create a new tab if there are no existing tabs
        const existingTabs = document.querySelectorAll('.modern-tab');
        if (existingTabs.length === 0) {
            createNewTab();
        }
    }
    
    // Initialize UI state
    function initializeUI(): void {
        // Set initial button states
        if (runButton) {
            runButton.style.display = 'flex';
        }
        if (stopButton) {
            stopButton.style.display = 'none';
            stopButton.disabled = true;
        }
        
        // Setup auto-scroll observer
        setupAutoScrollObserver();
    }

    // Function to toggle auto-scroll (for debugging)
    function toggleAutoScroll(): void {
        autoScrollEnabled = !autoScrollEnabled;
        console.log('Auto-scroll', autoScrollEnabled ? 'enabled' : 'disabled');
    }

    // Test function to add multiple lines and verify auto-scroll
    function testAutoScroll(): void {
        console.log('Testing auto-scroll with output console:', outputConsole);
        console.log('Console element details:', {
            id: outputConsole?.id,
            className: outputConsole?.className,
            scrollHeight: outputConsole?.scrollHeight,
            clientHeight: outputConsole?.clientHeight
        });
        
        for (let i = 1; i <= 10; i++) {
            setTimeout(() => {
                out(`Test line ${i} - This should auto-scroll to show the latest content`, 'info');
            }, i * 500); // Add a line every 500ms
        }
    }

    // Make functions globally available for debugging
    (window as any).toggleAutoScroll = toggleAutoScroll;
    (window as any).scrollOutputToBottom = scrollOutputToBottom;
    (window as any).scrollLastElementIntoView = scrollLastElementIntoView;
    (window as any).testAutoScroll = testAutoScroll;
    
    // Start the initialization
    initializeUI();
    initializeFirstTab();
    
    // Add keyboard shortcuts for tab navigation
    document.addEventListener('keydown', (e) => {
        // Ctrl+Tab or Ctrl+PageDown - Next tab
        if ((e.ctrlKey && e.key === 'Tab') || (e.ctrlKey && e.key === 'PageDown')) {
            e.preventDefault();
            const tabs = Array.from(document.querySelectorAll('.modern-tab')) as HTMLElement[];
            const activeTab = document.querySelector('.modern-tab.active') as HTMLElement | null;
            if (activeTab && tabs.length > 1) {
                const currentIndex = tabs.indexOf(activeTab);
                const nextIndex = (currentIndex + 1) % tabs.length;
                switchToTab(tabs[nextIndex]);
            }
        }
        
        // Ctrl+Shift+Tab or Ctrl+PageUp - Previous tab
        if ((e.ctrlKey && e.shiftKey && e.key === 'Tab') || (e.ctrlKey && e.key === 'PageUp')) {
            e.preventDefault();
            const tabs = Array.from(document.querySelectorAll('.modern-tab')) as HTMLElement[];
            const activeTab = document.querySelector('.modern-tab.active') as HTMLElement | null;
            if (activeTab && tabs.length > 1) {
                const currentIndex = tabs.indexOf(activeTab);
                const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
                switchToTab(tabs[prevIndex]);
            }
        }
        
        // Ctrl+W - Close current tab
        if (e.ctrlKey && e.key === 'w') {
            e.preventDefault();
            const activeTab = document.querySelector('.modern-tab.active') as HTMLElement | null;
            if (activeTab) {
                closeTabElement(activeTab);
            }
        }
        
        // Ctrl+T - New tab
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            createNewTab();
        }
        
        // Ctrl+C or Escape - Stop execution
        if (isExecuting && ((e.ctrlKey && e.key === 'c') || e.key === 'Escape')) {
            e.preventDefault();
            stopExecution();
        }
    });

});