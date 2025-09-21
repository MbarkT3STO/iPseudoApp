// Minimal clean app.ts - renderer wiring for runner.worker.js and ErrorManager

interface FileData {
    content: string;
    dirty: boolean;
    originalContent: string;
    cursorPosition: { lineNumber: number; column: number };
    scrollPosition: number;
    tabId?: string;
    // Tab-specific status and console data
    isExecuting?: boolean;
    executionStopped?: boolean;
    consoleStats?: {
        messages: number;
        errors: number;
        warnings: number;
        info: number;
    };
    consoleOutput?: string;
    lastExecutionTime?: number;
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
    const consoleContent = document.querySelector('.console-content') as HTMLElement | null;
    const runButton = document.getElementById('btnRun') as HTMLButtonElement | null;
    const stopButton = document.getElementById('btnStop') as HTMLButtonElement | null;
    const clearButton = document.getElementById('clearConsole') as HTMLButtonElement | null;
    const runStatus = document.getElementById('runStatus') as HTMLElement | null;
    const sidebarToggle = document.getElementById('sidebar-toggle') as HTMLElement | null;
    
    // Enhanced console elements
    const consoleStatus = document.getElementById('consoleStatus') as HTMLElement | null;
    const statusIndicator = document.getElementById('statusIndicator') as HTMLElement | null;
    const messageCount = document.getElementById('messageCount') as HTMLElement | null;
    const executionTime = document.getElementById('executionTime') as HTMLElement | null;
    const copyButton = document.getElementById('btnCopyOutput') as HTMLButtonElement | null;
    const consoleSaveButton = document.getElementById('btnSaveOutput') as HTMLButtonElement | null;
    const appShell = document.querySelector('.app-shell') as HTMLElement | null;
    const activityBar = document.querySelector('.activity-bar') as HTMLElement | null;

    // Track open files and their content
    const openFiles = new Map<string, FileData>();
    let activeFilePath = '';

    // Global tab counter
    let tabCounter = 0;
    
    // Enhanced console state
    let consoleMessageCount = 0;
    let consoleStats = {
        messages: 0,
        errors: 0,
        warnings: 0,
        info: 0
    };
    
    // Execution state management
    let isExecuting = false;
    let executionStopped = false;
    let executionStartTime = 0;
    let longRunningDetected = false;
    let longRunningTimeout: number | null = null;
    let criticalTimeout: number | null = null;
    let stopButtonPulseInterval: number | null = null;

    // Make these globally available
    (window as any).openFiles = openFiles;
    (window as any).activeFilePath = activeFilePath || '';

    // Tab-specific status and console management
    function getCurrentTabData(): FileData | null {
        if (!activeFilePath || !openFiles.has(activeFilePath)) {
            return null;
        }
        return openFiles.get(activeFilePath)!;
    }

    function updateTabStatus(isExecuting: boolean, executionStopped: boolean = false) {
        const tabData = getCurrentTabData();
        if (tabData) {
            tabData.isExecuting = isExecuting;
            tabData.executionStopped = executionStopped;
            openFiles.set(activeFilePath, tabData);
        }
    }

    function updateTabConsoleStats(stats: { messages: number; errors: number; warnings: number; info: number }) {
        const tabData = getCurrentTabData();
        if (tabData) {
            tabData.consoleStats = { ...stats };
            openFiles.set(activeFilePath, tabData);
        }
    }

    function updateTabConsoleOutput(output: string) {
        const tabData = getCurrentTabData();
        if (tabData) {
            tabData.consoleOutput = output;
            openFiles.set(activeFilePath, tabData);
        }
    }

    function getTabStatus(): 'ready' | 'running' | 'error' {
        const tabData = getCurrentTabData();
        if (!tabData) return 'ready';
        
        if (tabData.isExecuting) {
            return 'running';
        } else if (tabData.consoleStats && tabData.consoleStats.errors > 0) {
            return 'error';
        } else {
            return 'ready';
        }
    }

    // Comprehensive pseudocode formatting function
    function formatPseudocode(): void {
        if (!(window as any).editor) return;
        
        const content = (window as any).editor.getValue();
        if (!content.trim()) {
            out('Nothing to format', 'warning');
            return;
        }
        
        // Add loading state to format button
        const formatButton = document.getElementById('btnFormat') as HTMLButtonElement;
        if (formatButton) {
            formatButton.disabled = true;
            formatButton.innerHTML = '<i class="ri-loader-4-line animate-spin"></i><span class="sm:block">Formatting...</span>';
        }
        
        try {
            const lines = content.split('\n');
            const formattedLines: string[] = [];
            let indentLevel = 0;
            const indentSize = 4; // 4 spaces per indent level
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const trimmedLine = line.trim();
                
                // Skip empty lines but preserve them
                if (!trimmedLine) {
                    formattedLines.push('');
                    continue;
                }
                
                // Handle closing blocks (reduce indent before processing)
                if (trimmedLine.match(/^(endfor|endwhile|endif|endfunction|else|elseif)\b/i)) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }
                
                // Add proper indentation
                const indent = ' '.repeat(indentLevel * indentSize);
                const formattedLine = indent + trimmedLine;
                formattedLines.push(formattedLine);
                
                // Handle opening blocks (increase indent after processing)
                if (trimmedLine.match(/^(if|for|while|function)\b/i)) {
                    indentLevel++;
                }
                
                // Handle else/elseif (special case - same level as if)
                if (trimmedLine.match(/^(else|elseif)\b/i)) {
                    indentLevel++;
                }
            }
            
            const formatted = formattedLines.join('\n');
            (window as any).editor.setValue(formatted);
            
            // Mark file as dirty
            if (activeFilePath && openFiles.has(activeFilePath)) {
                const fileData = openFiles.get(activeFilePath)!;
                fileData.dirty = true;
                fileData.content = formatted;
                openFiles.set(activeFilePath, fileData);
                updateTabDirtyState(activeFilePath, true);
            }
            
            out('Code formatted successfully', 'success');
        } catch (error) {
            out(`Formatting error: ${(error as Error).message}`, 'error');
        } finally {
            // Restore format button
            if (formatButton) {
                formatButton.disabled = false;
                formatButton.innerHTML = '<i class="ri-code-s-slash-line"></i><span class="sm:block">Format</span>';
            }
        }
    }

    function restoreTabStatusAndConsole() {
        const tabData = getCurrentTabData();
        if (!tabData) return;

        // Restore console stats
        if (tabData.consoleStats) {
            consoleStats = { ...tabData.consoleStats };
            consoleMessageCount = tabData.consoleStats.messages;
        } else {
            consoleStats = { messages: 0, errors: 0, warnings: 0, info: 0 };
            consoleMessageCount = 0;
        }

        // Restore console output
        if (tabData.consoleOutput && outputConsole) {
            outputConsole.innerHTML = tabData.consoleOutput;
        } else if (outputConsole) {
            // Show welcome message if no output
            outputConsole.innerHTML = `
                <div class="console-welcome">
                    <div class="welcome-icon">
                        <i class="ri-code-s-slash-line"></i>
                    </div>
                    <div class="welcome-content">
                        <h4>Welcome to iPseudo IDE</h4>
                    </div>
                </div>
            `;
        }

        // Update UI elements
        if (messageCount) {
            messageCount.textContent = consoleMessageCount.toString();
        }

        // Update status indicator
        updateConsoleUI();
    }

    // Setup MutationObserver for automatic scrolling
    let autoScrollEnabled = true;
    let mutationObserver: MutationObserver | null = null;
    let scrollTimeout: number | null = null;

    // Keyboard shortcuts
    function setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not in input fields
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Ctrl/Cmd + S - Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const saveButton = document.getElementById('btnSave');
                if (saveButton) saveButton.click();
            }
            
            // Ctrl/Cmd + N - New file
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                const newButton = document.getElementById('btnNew');
                if (newButton) newButton.click();
            }
            
            // Ctrl/Cmd + O - Open file
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                const openButton = document.getElementById('btnOpen');
                if (openButton) openButton.click();
            }
            
            // Ctrl/Cmd + Shift + F - Format code
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                formatPseudocode();
            }
            
            // Ctrl/Cmd + K - Clear console
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                clearConsole();
            }
            
            // F5 - Run code
            if (e.key === 'F5') {
                e.preventDefault();
                const runButton = document.getElementById('btnRun') as HTMLButtonElement;
                if (runButton && !runButton.disabled) runButton.click();
            }
            
            // Escape - Stop execution
            if (e.key === 'Escape') {
                const stopButton = document.getElementById('btnStop');
                if (stopButton && stopButton.style.display !== 'none') {
                    stopButton.click();
                }
            }
        });
    }

    // Enhanced tooltip system
    function setupTooltips(): void {
        const tooltipElements = document.querySelectorAll('[title]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }

    function showTooltip(e: Event): void {
        const element = e.target as HTMLElement;
        const title = element.getAttribute('title');
        if (!title) return;

        // Remove existing tooltip
        hideTooltip();

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = title;
        tooltip.id = 'custom-tooltip';

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
        tooltip.style.zIndex = '10000';

        document.body.appendChild(tooltip);

        // Remove original title to prevent default tooltip
        element.setAttribute('data-original-title', title);
        element.removeAttribute('title');
    }

    function hideTooltip(): void {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) {
            tooltip.remove();
        }

        // Restore original titles
        const elements = document.querySelectorAll('[data-original-title]');
        elements.forEach(element => {
            const originalTitle = element.getAttribute('data-original-title');
            if (originalTitle) {
                element.setAttribute('title', originalTitle);
                element.removeAttribute('data-original-title');
            }
        });
    }

    let isContentBeingAdded = false;
    let isInLoopContext = false;
    let loopScrollTimeout: number | null = null;
    
    function setupAutoScrollObserver(): void {
        if (!outputConsole || !consoleContent || mutationObserver) return;
        
        mutationObserver = new MutationObserver((mutations) => {
            if (!autoScrollEnabled) return;
            
            let shouldScroll = false;
            let isPrintStatement = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldScroll = true;
                    
                    // Check if this is a print statement (loop context detection)
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as Element;
                            if (element.classList.contains('console-print') || 
                                element.classList.contains('console-info') ||
                                element.classList.contains('console-success')) {
                                isPrintStatement = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldScroll) {
                // Mark that content is being added
                isContentBeingAdded = true;
                
                // If this is a print statement, enable immediate loop scrolling
                if (isPrintStatement) {
                    isInLoopContext = true;
                    
                    // Clear any existing loop timeout
                    if (loopScrollTimeout) {
                        clearTimeout(loopScrollTimeout);
                    }
                    
                    // Set a timeout to detect when loop context ends
                    loopScrollTimeout = window.setTimeout(() => {
                        isInLoopContext = false;
                        console.log('Loop context ended - switching back to debounced scroll');
                    }, 200); // If no print statements for 200ms, assume loop ended
                    
                    // Immediate scroll for loop context
                    console.log('Loop context detected - immediate scroll');
                    performImmediateScroll();
                } else {
                    // Regular debounced scrolling for non-loop content
                    if (scrollTimeout) {
                        clearTimeout(scrollTimeout);
                    }
                    
                    scrollTimeout = window.setTimeout(() => {
                        isContentBeingAdded = false;
                        performDebouncedScroll();
                    }, 100);
                }
            }
        });
        
        mutationObserver.observe(outputConsole, {
            childList: true,
            subtree: true
        });
    }

    // Debounced scroll function that waits for content addition to complete
    function performDebouncedScroll(): void {
        if (!autoScrollEnabled) return;
        
        console.log('Performing debounced scroll - content addition has stopped');
        
        // Use the enhanced scroll function for better handling of long content
        scrollToVeryBottom();
        
        // Also use the original function as backup
        setTimeout(() => {
            scrollOutputToBottom();
        }, 50);
        
        // Final attempt with last element scroll
        setTimeout(() => {
            scrollLastElementIntoView();
        }, 150);
    }

    // Force immediate scroll (for cases where we need immediate feedback)
    function forceImmediateScroll(): void {
        if (!autoScrollEnabled) return;
        
        console.log('Forcing immediate scroll');
        
        // Clear any pending debounced scroll
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }
        
        // Perform immediate scroll
        scrollToVeryBottom();
    }

    // Immediate scroll for loop context (no debouncing)
    function performImmediateScroll(): void {
        if (!autoScrollEnabled) return;
        
        console.log('Performing immediate scroll for loop context');
        
        // Try multiple potential scrollable elements
        const scrollableElements = [
            consoleContent,
            outputConsole,
            document.querySelector('.console-container'),
            document.querySelector('.main-content')
        ].filter(el => el !== null);
        
        scrollableElements.forEach((element, index) => {
            if (!element) return;
            
            const scrollHeight = element.scrollHeight;
            const clientHeight = element.clientHeight;
            const maxScroll = scrollHeight - clientHeight;
            
            // Only scroll if this element can actually scroll
            if (scrollHeight > clientHeight) {
                // Immediate scroll to bottom
                element.scrollTop = maxScroll;
                
                // Quick follow-up to handle any content growth
                setTimeout(() => {
                    const newScrollHeight = element.scrollHeight;
                    const newClientHeight = element.clientHeight;
                    const newMaxScroll = newScrollHeight - newClientHeight;
                    
                    if (newScrollHeight > scrollHeight) {
                        element.scrollTop = newMaxScroll;
                    }
                }, 10); // Very short delay for immediate feedback
            }
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
        if (!consoleContent) {
            console.warn('Console content element not found');
            return;
        }
        
        // Enhanced scrolling function that ensures we reach the absolute bottom
        const scrollToAbsoluteBottom = () => {
            // Get the actual scrollable height
            const scrollHeight = consoleContent.scrollHeight;
            const clientHeight = consoleContent.clientHeight;
            const maxScroll = scrollHeight - clientHeight;
            
            console.log('Scroll details:', {
                scrollHeight,
                clientHeight,
                maxScroll,
                currentScrollTop: consoleContent.scrollTop
            });
            
            // Method 1: Use scrollTo with exact positioning
            try {
                consoleContent.scrollTo({
                    top: scrollHeight,
                    behavior: 'smooth'
                });
            } catch (e) {
                // Fallback: direct assignment
                consoleContent.scrollTop = scrollHeight;
            }
            
            // Method 2: Force scroll to absolute bottom with multiple attempts
            setTimeout(() => {
                consoleContent.scrollTop = scrollHeight;
                // Add extra padding to ensure we're at the very bottom
                consoleContent.scrollTop = consoleContent.scrollHeight + 100;
                // Then set to exact bottom
                consoleContent.scrollTop = consoleContent.scrollHeight;
            }, 10);
            
            // Method 3: Final verification and correction
            setTimeout(() => {
                const finalScrollTop = consoleContent.scrollTop;
                const finalScrollHeight = consoleContent.scrollHeight;
                const finalClientHeight = consoleContent.clientHeight;
                const shouldBeAt = finalScrollHeight - finalClientHeight;
                
                console.log('Final scroll check:', {
                    current: finalScrollTop,
                    shouldBe: shouldBeAt,
                    difference: Math.abs(finalScrollTop - shouldBeAt)
                });
                
                // If we're not at the bottom, force it
                if (Math.abs(finalScrollTop - shouldBeAt) > 1) {
                    consoleContent.scrollTop = finalScrollHeight;
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

    // Enhanced function to scroll to the very bottom with better handling of long content
    function scrollToVeryBottom(): void {
        // Try multiple potential scrollable elements
        const scrollableElements = [
            consoleContent,
            outputConsole,
            document.querySelector('.console-container'),
            document.querySelector('.main-content')
        ].filter(el => el !== null);
        
        console.log('Attempting to scroll with elements:', scrollableElements.map(el => el?.className || el?.id));
        
        // Wait for the next frame to ensure DOM is fully updated
        requestAnimationFrame(() => {
            scrollableElements.forEach((element, index) => {
                if (!element) return;
                
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;
                const maxScroll = scrollHeight - clientHeight;
                
                console.log(`Element ${index} (${element.className || element.id}):`, {
                    scrollHeight,
                    clientHeight,
                    maxScroll,
                    currentScrollTop: element.scrollTop,
                    canScroll: scrollHeight > clientHeight
                });
                
                // Only scroll if this element can actually scroll
                if (scrollHeight > clientHeight) {
                    // First attempt: scroll to calculated bottom
                    element.scrollTop = maxScroll;
                    
                    // Wait a bit and check if content has grown
                    setTimeout(() => {
                        const newScrollHeight = element.scrollHeight;
                        const newClientHeight = element.clientHeight;
                        const newMaxScroll = newScrollHeight - newClientHeight;
                        
                        console.log(`Element ${index} second attempt:`, {
                            newScrollHeight,
                            newClientHeight,
                            newMaxScroll,
                            currentScrollTop: element.scrollTop
                        });
                        
                        // If content has grown, scroll to the new bottom
                        if (newScrollHeight > scrollHeight) {
                            element.scrollTop = newMaxScroll;
                            console.log(`Element ${index} content grew, scrolled to new bottom`);
                        }
                        
                        // Final verification after a longer delay
                        setTimeout(() => {
                            const finalScrollHeight = element.scrollHeight;
                            const finalClientHeight = element.clientHeight;
                            const finalMaxScroll = finalScrollHeight - finalClientHeight;
                            const currentScrollTop = element.scrollTop;
                            
                            console.log(`Element ${index} final verification:`, {
                                finalScrollHeight,
                                finalClientHeight,
                                finalMaxScroll,
                                currentScrollTop,
                                isAtBottom: Math.abs(currentScrollTop - finalMaxScroll) <= 1
                            });
                            
                            // Force scroll to absolute bottom if not already there
                            if (Math.abs(currentScrollTop - finalMaxScroll) > 1) {
                                element.scrollTop = finalScrollHeight;
                                console.log(`Element ${index} forced scroll to absolute bottom`);
                            }
                        }, 100);
                    }, 50);
                }
            });
        });
    }

    // Function to scroll the last element into view
    function scrollLastElementIntoView(): void {
        if (!outputConsole || !consoleContent) return;
        
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
                const containerRect = consoleContent.getBoundingClientRect();
                const relativeTop = elementRect.top - containerRect.top + consoleContent.scrollTop;
                
                consoleContent.scrollTo({
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
            // Remove welcome message if it exists
            const welcomeMessage = outputConsole.querySelector('.console-welcome');
            if (welcomeMessage) {
                welcomeMessage.remove();
            }

            let printContainer = outputConsole.querySelector('.print-output-container') as HTMLElement | null;
            if (!printContainer) {
                printContainer = document.createElement('div');
                printContainer.className = 'print-output-container';
                outputConsole.appendChild(printContainer);
            }
            const line = document.createElement('div');
            line.className = 'console-message console-print';
            line.innerHTML = `
                <i class="ri-terminal-line"></i>
                <span class="message-content">
                    <span class="message-text">${safe}</span>
                </span>
            `;
            printContainer.appendChild(line);
            updateConsoleStats('info');
        } else {
            // Use the enhanced console message system
            addConsoleMessage(safe, type as 'success' | 'error' | 'warning' | 'info' | 'debug');
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

    if (clearButton) clearButton.addEventListener('click', clearConsole);
    
    // Enhanced console functionality
    function clearConsole() {
        if (!outputConsole) return;
        
        outputConsole.innerHTML = `
            <div class="console-welcome">
                <div class="welcome-icon">
                    <i class="ri-code-s-slash-line"></i>
                </div>
                <div class="welcome-content">
                    <h4>Welcome to iPseudo IDE</h4>
                </div>
            </div>
        `;
        
        consoleMessageCount = 0;
        consoleStats = { messages: 0, errors: 0, warnings: 0, info: 0 };
        
        // Reset execution state if not currently executing
        if (!isExecuting) {
            isExecuting = false;
            executionStopped = false;
        }
        
        // Update tab-specific data
        updateTabConsoleStats(consoleStats);
        updateTabConsoleOutput(outputConsole.innerHTML);
        updateTabStatus(false, false);
        
        updateConsoleUI();
    }
    
    function addConsoleMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' | 'debug' = 'info') {
        if (!outputConsole) return;

        // Remove welcome message if it exists
        const welcomeMessage = outputConsole.querySelector('.console-welcome');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `console-message console-${type}`;
        
        const icon = getMessageIcon(type);
        const timestamp = new Date().toLocaleTimeString();
        
        messageElement.innerHTML = `
            <i class="${icon}"></i>
            <span class="message-content">
                <span class="message-text">${message}</span>
                <span class="message-timestamp">${timestamp}</span>
            </span>
        `;
        
        outputConsole.appendChild(messageElement);
        updateConsoleStats(type);
        updateTabConsoleStats(consoleStats);
        updateTabConsoleOutput(outputConsole.innerHTML);
        updateConsoleUI();
        scrollOutputToBottom();
    }
    
    function getMessageIcon(type: string): string {
        const icons = {
            success: 'ri-check-line',
            error: 'ri-error-warning-line',
            warning: 'ri-alert-line',
            info: 'ri-information-line',
            debug: 'ri-bug-line',
            system: 'ri-settings-3-line'
        };
        return icons[type as keyof typeof icons] || 'ri-information-line';
    }
    
    function addSystemMessage(message: string) {
        if (!outputConsole) return;

        // Remove welcome message if it exists
        const welcomeMessage = outputConsole.querySelector('.console-welcome');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'console-message console-system';
        
        const timestamp = new Date().toLocaleTimeString();
        
        messageElement.innerHTML = `
            <i class="ri-settings-3-line"></i>
            <span class="message-content">
                <span class="message-text">${message}</span>
                <span class="message-timestamp">${timestamp}</span>
            </span>
        `;
        
        outputConsole.appendChild(messageElement);
        updateConsoleStats('info');
        updateTabConsoleStats(consoleStats);
        updateTabConsoleOutput(outputConsole.innerHTML);
        updateConsoleUI();
        scrollOutputToBottom();
    }
    
    function updateConsoleStats(type: string) {
        consoleMessageCount++;
        consoleStats.messages++;
        
        if (type === 'error') consoleStats.errors++;
        else if (type === 'warning') consoleStats.warnings++;
        else if (type === 'info') consoleStats.info++;
        
        if (messageCount) {
            messageCount.textContent = consoleMessageCount.toString();
        }
    }
    
    function updateConsoleUI() {
        if (statusIndicator) {
            const statusText = statusIndicator.querySelector('.status-text');
            const tabStatus = getTabStatus();
            
            if (tabStatus === 'running') {
                statusIndicator.className = 'status-indicator running';
                if (statusText) statusText.textContent = 'Running';
            } else if (tabStatus === 'error') {
                statusIndicator.className = 'status-indicator error';
                if (statusText) statusText.textContent = 'Error';
            } else {
                statusIndicator.className = 'status-indicator ready';
                if (statusText) statusText.textContent = 'Ready';
            }
        }
        
        if (executionTime && executionStartTime > 0) {
            const elapsed = Date.now() - executionStartTime;
            executionTime.textContent = `${elapsed}ms`;
        }
        
        // Debug logging for status changes
        const tabData = getCurrentTabData();
        console.log('Console status updated for tab:', {
            tabPath: activeFilePath,
            tabStatus: getTabStatus(),
            tabExecuting: tabData?.isExecuting,
            tabErrors: tabData?.consoleStats?.errors,
            status: statusIndicator?.querySelector('.status-text')?.textContent
        });
    }
    
    function copyConsoleOutput() {
        if (!outputConsole) return;
        
        const messages = outputConsole.querySelectorAll('.console-message .message-text');
        const output = Array.from(messages).map(msg => msg.textContent).join('\n');
        
        navigator.clipboard.writeText(output).then(() => {
            addConsoleMessage('Console output copied to clipboard', 'success');
        }).catch(() => {
            addConsoleMessage('Failed to copy console output', 'error');
        });
    }
    
    function saveConsoleOutput() {
        if (!outputConsole) return;
        
        const messages = outputConsole.querySelectorAll('.console-message .message-text');
        const output = Array.from(messages).map(msg => msg.textContent).join('\n');
        
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `console-output-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addConsoleMessage('Console output saved to file', 'success');
    }
    
    // Add event listeners for new console buttons
    if (copyButton) copyButton.addEventListener('click', copyConsoleOutput);
    if (consoleSaveButton) consoleSaveButton.addEventListener('click', saveConsoleOutput);

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
        
        // Update tab-specific status
        updateTabStatus(false, false);
        
        // Stop execution monitoring
        stopExecutionMonitoring();
        
        // Update UI state
        if (runButton) {
            runButton.disabled = false;
            runButton.style.display = 'flex';
        }
        if (stopButton) {
            stopButton.style.display = 'none';
            stopButton.disabled = true;
            updateStopButtonState('hidden');
        }
        if (runStatus) runStatus.title = 'Idle';
        
        // Update console status after cleanup
        updateConsoleUI();
    }

    // Function to just terminate the worker without resetting execution state
    function terminateWorker(): void {
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
                // Status will be updated by cleanupWorker
            }, 100);
        }
    }

    // Enhanced stop button state management
    function updateStopButtonState(state: 'hidden' | 'normal' | 'long-running' | 'critical'): void {
        if (!stopButton) return;
        
        // Remove all state classes
        stopButton.classList.remove('hidden', 'normal', 'long-running', 'critical');
        
        // Add the new state class
        stopButton.classList.add(state);
        
        // Update title based on state
        switch (state) {
            case 'hidden':
                stopButton.title = 'Stop Execution';
                break;
            case 'normal':
                stopButton.title = 'Stop Execution';
                break;
            case 'long-running':
                stopButton.title = 'Stop Long Running Execution (Click to force stop)';
                break;
            case 'critical':
                stopButton.title = 'Force Stop Stuck Execution (Click immediately)';
                break;
        }
        
        console.log(`Stop button state updated to: ${state}`);
    }

    // Monitor execution time and update stop button state
    function startExecutionMonitoring(): void {
        executionStartTime = Date.now();
        longRunningDetected = false;
        
        // Clear any existing timeouts
        if (longRunningTimeout) {
            clearTimeout(longRunningTimeout);
            longRunningTimeout = null;
        }
        if (criticalTimeout) {
            clearTimeout(criticalTimeout);
            criticalTimeout = null;
        }
        
        console.log('Starting execution monitoring...');
        
        // Set timeout for long running detection (5 seconds)
        longRunningTimeout = window.setTimeout(() => {
            if (isExecuting && !longRunningDetected) {
                longRunningDetected = true;
                updateStopButtonState('long-running');
                console.log('Long running execution detected - stop button updated to warning state');
            }
        }, 5000);
        
        // Set timeout for critical state (15 seconds)
        criticalTimeout = window.setTimeout(() => {
            if (isExecuting) {
                updateStopButtonState('critical');
                console.log('Critical execution state - stop button updated to critical state');
            }
        }, 15000);
    }

    // Stop execution monitoring
    function stopExecutionMonitoring(): void {
        if (longRunningTimeout) {
            clearTimeout(longRunningTimeout);
            longRunningTimeout = null;
        }
        
        if (criticalTimeout) {
            clearTimeout(criticalTimeout);
            criticalTimeout = null;
        }
        
        if (stopButtonPulseInterval) {
            clearInterval(stopButtonPulseInterval);
            stopButtonPulseInterval = null;
        }
        
        longRunningDetected = false;
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
                        addSystemMessage(`Suggestion: ${decoration.suggestion}`);
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
            
            // Update tab-specific status
            updateTabStatus(true, false);
            
            // Reset error count for new execution
            consoleStats.errors = 0;
            updateTabConsoleStats(consoleStats);
            
            // Start execution monitoring
            startExecutionMonitoring();
            
            // Update console status to Running
            updateConsoleUI();
            
            // Terminate any existing worker first (without resetting execution state)
            terminateWorker();
            
            // Update UI state
            if (runButton) {
                runButton.disabled = true;
                runButton.style.display = 'none';
            }
            if (stopButton) {
                stopButton.style.display = 'flex';
                stopButton.disabled = false;
                updateStopButtonState('normal');
            }
            if (runStatus) runStatus.title = 'Running';

            // Create new worker
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
                        // Update tab-specific console stats
                        updateTabConsoleStats(consoleStats);
                        // Update status to Error when stderr is received
                        updateConsoleUI();
                    }
                    else if (m.type === 'error') { 
                        const eobj = m.error || { message: m.message || m.text || 'error' }; 
                        const e = new Error(eobj.message); 
                        (e as any).name = eobj.name || 'Error'; 
                        e.stack = eobj.stack || ''; 
                        handleError(e, code);
                        // Update tab-specific console stats
                        updateTabConsoleStats(consoleStats);
                        // Update status to Error immediately
                        updateConsoleUI(); 
                        cleanupWorker(); 
                    }
                    else if (m.type === 'input-request') { 
                        const val = window.prompt(m.prompt || 'Input:') || ''; 
                        runnerWorker!.postMessage({ type: 'input-response', id: m.id, value: val }); 
                    }
                    else if (m.type === 'done') { 
                        if (!executionStopped) {
                            addSystemMessage('Done'); 
                        }
                        cleanupWorker();
                        // Update status after execution completes
                        updateConsoleUI();
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

    // Function to show confirmation modal
    function showConfirmationModal(title: string, message: string, buttons: { text: string; action: () => void; primary?: boolean }[]): void {
        // Remove any existing modal
        const existingModal = document.querySelector('.confirmation-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'confirmation-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;
        
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.style.cssText = `
            background: var(--bg-soft-elevated);
            border-radius: var(--radius-soft-lg);
            padding: var(--space-soft-6);
            max-width: 400px;
            width: 90%;
            box-shadow: var(--shadow-soft-floating);
            border: 1px solid var(--border-soft-light);
        `;
        
        modal.innerHTML = `
            <div style="margin-bottom: var(--space-soft-4);">
                <h3 style="margin: 0 0 var(--space-soft-2) 0; color: var(--text-soft-primary); font-size: var(--font-size-soft-lg); font-weight: var(--font-weight-soft-semibold);">${title}</h3>
                <p style="margin: 0; color: var(--text-soft-secondary); font-size: var(--font-size-soft-sm); line-height: 1.4;">${message}</p>
            </div>
            <div style="display: flex; gap: var(--space-soft-3); justify-content: flex-end;">
                ${buttons.map((btn, index) => `
                    <button class="confirmation-btn ${btn.primary ? 'primary' : 'secondary'}" data-action="${index}" style="
                        padding: var(--space-soft-2) var(--space-soft-4);
                        border: none;
                        border-radius: var(--radius-soft-sm);
                        font-size: var(--font-size-soft-sm);
                        font-weight: var(--font-weight-soft-medium);
                        cursor: pointer;
                        transition: all var(--duration-soft-normal) var(--ease-soft-out);
                        ${btn.primary ? 
                            'background: var(--text-soft-accent); color: var(--text-soft-inverse);' : 
                            'background: var(--bg-soft-secondary); color: var(--text-soft-primary); border: 1px solid var(--border-soft-light);'
                        }
                    ">${btn.text}</button>
                `).join('')}
            </div>
        `;
        
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        // Add event listeners
        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('confirmation-btn')) {
                const actionIndex = parseInt(target.dataset.action || '0');
                buttons[actionIndex].action();
                modalOverlay.remove();
            }
        });
        
        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
        
        // Focus first button
        const firstButton = modal.querySelector('.confirmation-btn') as HTMLButtonElement;
        if (firstButton) {
            firstButton.focus();
        }
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
        
        // Check if tab already exists
        const existingTab = tabBar.querySelector(`.modern-tab[data-tab-id="${filePath}"]`) as HTMLElement | null;
        if (existingTab) {
            switchToTab(existingTab);
            return;
        }
        
        // Save current editor state before switching (only if there's an active file)
        if (activeFilePath && (window as any).editor) {
            saveEditorState();
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
        
        // Update active file path BEFORE setting editor content
        activeFilePath = filePath;
        (window as any).activeFilePath = activeFilePath || '';
        
        // Initialize editor with content
        if ((window as any).editor) {
            // Set the content and update the file data
            (window as any).editor.setValue(initialContent);
            
            // Update the file data with the initial content
            if (openFiles.has(filePath)) {
                const fileData = openFiles.get(filePath)!;
                fileData.content = initialContent;
                fileData.originalContent = initialContent;
                fileData.dirty = false;
                openFiles.set(filePath, fileData);
            }
            
            (window as any).editor.focus();
        }
        
        // Restore tab-specific status and console
        restoreTabStatusAndConsole();
        
        // Update document title
        document.title = `${fileName} - iPseudo IDE`;
        
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
        
        // Restore tab-specific status and console
        restoreTabStatusAndConsole();
        
        // Focus the editor
        if ((window as any).editor) {
            (window as any).editor.focus();
        }
    }

    // Function to check if tab is file-based (has a real file path)
    function isFileBased(filePath: string): boolean {
        return !!(filePath && filePath !== 'untitled.pseudo' && filePath.includes('/') && !filePath.startsWith('Untitled-'));
    }

    // Function to save file directly (for file-based tabs)
    async function saveFileDirectly(filePath: string, content: string): Promise<void> {
        try {
            const result = await (window as any).electron.saveFile({
                filePath: filePath,
                content: content
            });
            
            if (!result.canceled) {
                // Update file data
                const fileData = openFiles.get(filePath);
                if (fileData) {
                    fileData.content = content;
                    fileData.originalContent = content;
                    fileData.dirty = false;
                    openFiles.set(filePath, fileData);
                    updateTabDirtyState(filePath, false);
                    out(`File saved: ${filePath}`, 'success');
                }
            }
        } catch (error) {
            console.error('Error saving file:', error);
            throw error;
        }
    }

    // Function to show save dialog (for new files)
    async function showSaveDialog(content: string): Promise<boolean> {
        try {
            const result = await (window as any).electron.saveFile({
                filePath: undefined, // This will trigger the save dialog
                content: content
            });
            
            if (!result.canceled && result.filePath) {
                // Update the active tab with the new file path
                const activeTab = document.querySelector('.modern-tab.active') as HTMLElement | null;
                if (activeTab) {
                    const oldPath = activeTab.dataset.path;
                    const newPath = result.filePath;
                    
                    // Update tab data
                    activeTab.dataset.path = newPath;
                    const fileName = newPath.split(/[\\/]/).pop();
                    const tabLabel = activeTab.querySelector('.tab-label');
                    if (tabLabel) tabLabel.textContent = fileName || '';
                    
                    // Update file data
                    const fileData = openFiles.get(oldPath || '');
                    if (fileData) {
                        fileData.content = content;
                        fileData.originalContent = content;
                        fileData.dirty = false;
                        openFiles.set(newPath, fileData);
                        if (oldPath) openFiles.delete(oldPath);
                        updateTabDirtyState(newPath, false);
                    }
                    
                    // Update active file path
                    activeFilePath = newPath;
                    (window as any).activeFilePath = activeFilePath || '';
                    
                    out(`File saved: ${newPath}`, 'success');
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error showing save dialog:', error);
            return false;
        }
    }

    // Function to close a tab by its DOM element
    async function closeTabElement(tabElement: HTMLElement): Promise<void> {
        if (!tabElement) return;
        
        const tabId = tabElement.dataset.tabId;
        let filePath = tabElement.dataset.path || '';
        const isNewFile = !filePath || filePath === 'untitled.pseudo' || !filePath.includes('/');
        const isFileBasedTab = isFileBased(filePath);
        
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
            performTabClose(tabElement);
            return;
        }
        
        // Case 2: Has content but no changes - close immediately
        if (!isModified) {
            performTabClose(tabElement);
            return;
        }
        
        // Case 3: Has unsaved changes - show confirmation
        const title = isFileBasedTab ? 'Save Changes?' : 'Save Before Closing?';
        const fileName = isFileBasedTab ? filePath.split('/').pop() : 'this tab';
        const message = isFileBasedTab 
            ? `The file "${fileName}" has unsaved changes. Do you want to save them?`
            : 'This tab has unsaved content. Do you want to save it before closing?';
        
        showConfirmationModal(title, message, [
            {
                text: 'Yes',
                primary: true,
                action: async () => {
                    try {
                        if (isFileBasedTab) {
                            // Save to existing file
                            await saveFileDirectly(filePath, currentContent);
                        } else {
                            // Show save dialog for new file
                            const saved = await showSaveDialog(currentContent);
                            if (!saved) {
                                return; // Don't close if save was cancelled
                            }
                        }
                        performTabClose(tabElement);
                    } catch (error) {
                        console.error('Error saving file:', error);
                        // Still close the tab even if save fails
                        performTabClose(tabElement);
                    }
                }
            },
            {
                text: 'No',
                action: () => {
                    performTabClose(tabElement);
                }
            }
        ]);
    }

    // Function to perform the actual tab close
    function performTabClose(tabElement: HTMLElement): void {
        const filePath = tabElement.dataset.path || '';
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
                
                if (targetTab) {
                    switchToTab(targetTab);
                }
            } else {
                // No tabs left, create a new one
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
        
        // Create the tab (this will handle saving current state)
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
                formatPseudocode();
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
                addSystemMessage(`Minimap ${!currentValue.enabled ? 'enabled' : 'disabled'}`);
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
                addSystemMessage(`Word wrap ${currentValue === 'on' ? 'disabled' : 'enabled'}`);
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
                addSystemMessage('Switched to vertical layout');
            } else {
                // Switch to side-by-side layout
                editorLayout.classList.add('side-by-side');
                layoutIcon.className = 'ri-layout-row-line';
                addSystemMessage('Switched to 50/50 side-by-side layout');
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
            // Get the current editor content (the default content)
            const currentContent = (window as any).editor.getValue();
            
            // Create a new tab with the current editor content
            const newTabId = `Untitled-${getNextUntitledNumber()}.pseudo`;
            
            // Add to open files with the current editor content
            openFiles.set(newTabId, {
                content: currentContent,
                originalContent: currentContent,
                dirty: false,
                cursorPosition: { lineNumber: 1, column: 1 },
                scrollPosition: 0
            });
            
            // Create the tab with the current content
            createOrSwitchToTab(newTabId, currentContent);
            
            // Update document title
            document.title = `${newTabId} - iPseudo IDE`;
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
        console.log('Testing auto-scroll with console content:', consoleContent);
        console.log('Console element details:', {
            id: consoleContent?.className,
            className: consoleContent?.className,
            scrollHeight: consoleContent?.scrollHeight,
            clientHeight: consoleContent?.clientHeight
        });
        
        for (let i = 1; i <= 10; i++) {
            setTimeout(() => {
                out(`Test line ${i} - This should auto-scroll to show the latest content`, 'info');
            }, i * 500); // Add a line every 500ms
        }
    }

    // Test function for very long content
    function testLongContentScroll(): void {
        console.log('Testing auto-scroll with very long content');
        
        // Create a very long string
        let longContent = 'This is a very long line of content that should test the auto-scroll functionality. ';
        for (let i = 0; i < 50; i++) {
            longContent += `Line ${i + 1}: This is a very long line of content that should test the auto-scroll functionality. `;
        }
        
        out(longContent, 'info');
        
        // Add another long content after a delay
        setTimeout(() => {
            let anotherLongContent = 'Another very long content block: ';
            for (let i = 0; i < 30; i++) {
                anotherLongContent += `Another line ${i + 1} with lots of text to test scrolling. `;
            }
            out(anotherLongContent, 'success');
        }, 1000);
    }

    // Test function for loop-like content (simulating a big loop)
    function testLoopScroll(): void {
        console.log('Testing auto-scroll with loop-like content (simulating for i = 1 to 100)');
        
        // Simulate a loop that prints numbers 1 to 100
        for (let i = 1; i <= 100; i++) {
            setTimeout(() => {
                out(`${i}`, 'print'); // Use 'print' type to simulate print statements
            }, i * 10); // Small delay between each print
        }
        
        // Add a final message after the loop
        setTimeout(() => {
            out('Loop completed! This should be the last visible item.', 'success');
        }, 1100); // After all the loop iterations
    }

    // Test function for immediate live scrolling during loop execution
    function testLiveLoopScroll(): void {
        console.log('Testing LIVE auto-scroll during loop execution (simulating for i = 1 to 50)');
        
        // Simulate a faster loop that prints numbers 1 to 50 with immediate scrolling
        for (let i = 1; i <= 50; i++) {
            setTimeout(() => {
                out(`Loop iteration ${i}`, 'print'); // Use 'print' type to trigger immediate scroll
            }, i * 50); // 50ms delay between each print for visible live scrolling
        }
        
        // Add a final message after the loop
        setTimeout(() => {
            out('Live loop completed! You should have seen each iteration scroll immediately.', 'success');
        }, 2600); // After all the loop iterations
    }

    // Test function for stop button states
    function testStopButtonStates(): void {
        console.log('Testing stop button states...');
        
        // Test hidden state
        updateStopButtonState('hidden');
        setTimeout(() => {
            console.log('Testing normal state...');
            updateStopButtonState('normal');
        }, 1000);
        
        setTimeout(() => {
            console.log('Testing long-running state...');
            updateStopButtonState('long-running');
        }, 2000);
        
        setTimeout(() => {
            console.log('Testing critical state...');
            updateStopButtonState('critical');
        }, 3000);
        
        setTimeout(() => {
            console.log('Resetting to hidden state...');
            updateStopButtonState('hidden');
        }, 4000);
    }

    // Test function for long running execution simulation
    function testLongRunningExecution(): void {
        console.log('Testing long running execution detection...');
        
        // Simulate execution start
        isExecuting = true;
        startExecutionMonitoring();
        
        // Simulate a long running operation
        setTimeout(() => {
            console.log('Simulating execution completion...');
            isExecuting = false;
            stopExecutionMonitoring();
            updateStopButtonState('hidden');
        }, 6000); // 6 seconds to trigger long-running state
    }

    // Debug function to analyze scrollable elements
    function debugScrollElements(): void {
        console.log('=== SCROLL DEBUG ANALYSIS ===');
        
        // Check all potential scrollable elements
        const elements = [
            { name: 'outputConsole (output)', element: outputConsole },
            { name: 'consoleContent (.console-content)', element: consoleContent },
            { name: 'console-container', element: document.querySelector('.console-container') },
            { name: 'console-output', element: document.querySelector('.console-output') },
            { name: 'main-content', element: document.querySelector('.main-content') }
        ];
        
        elements.forEach(({ name, element }) => {
            if (element) {
                const computedStyle = window.getComputedStyle(element);
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;
                const scrollTop = element.scrollTop;
                const maxScroll = scrollHeight - clientHeight;
                
                console.log(`\n--- ${name} ---`);
                console.log('Element:', element);
                console.log('scrollHeight:', scrollHeight);
                console.log('clientHeight:', clientHeight);
                console.log('scrollTop:', scrollTop);
                console.log('maxScroll:', maxScroll);
                console.log('overflow-y:', computedStyle.overflowY);
                console.log('overflow-x:', computedStyle.overflowX);
                console.log('position:', computedStyle.position);
                console.log('Can scroll:', scrollHeight > clientHeight);
                console.log('Is at bottom:', Math.abs(scrollTop - maxScroll) <= 1);
            } else {
                console.log(`\n--- ${name} ---`);
                console.log('Element not found!');
            }
        });
        
        // Check which element actually has scrollable content
        console.log('\n=== SCROLLABLE ELEMENT ANALYSIS ===');
        const scrollableElements = elements.filter(({ element }) => {
            if (!element) return false;
            return element.scrollHeight > element.clientHeight;
        });
        
        console.log('Scrollable elements found:', scrollableElements.length);
        scrollableElements.forEach(({ name, element }) => {
            if (element) {
                console.log(`- ${name}: scrollHeight=${element.scrollHeight}, clientHeight=${element.clientHeight}`);
            }
        });
        
        // Find the element with the most content
        const elementWithMostContent = elements.reduce((max, current) => {
            if (!current.element) return max;
            if (!max.element) return current;
            return current.element.scrollHeight > max.element.scrollHeight ? current : max;
        }, { name: 'none', element: null });
        
        console.log('\nElement with most content:', elementWithMostContent.name);
        if (elementWithMostContent.element) {
            console.log('This should be our scroll target!');
        }
    }

    // Make functions globally available for debugging
    (window as any).toggleAutoScroll = toggleAutoScroll;
    (window as any).scrollOutputToBottom = scrollOutputToBottom;
    (window as any).scrollLastElementIntoView = scrollLastElementIntoView;
    (window as any).testAutoScroll = testAutoScroll;
    (window as any).testLongContentScroll = testLongContentScroll;
    (window as any).testLoopScroll = testLoopScroll;
    (window as any).testLiveLoopScroll = testLiveLoopScroll;
    (window as any).testStopButtonStates = testStopButtonStates;
    (window as any).testLongRunningExecution = testLongRunningExecution;
    (window as any).scrollToVeryBottom = scrollToVeryBottom;
    (window as any).forceImmediateScroll = forceImmediateScroll;
    (window as any).performDebouncedScroll = performDebouncedScroll;
    (window as any).performImmediateScroll = performImmediateScroll;
    (window as any).debugScrollElements = debugScrollElements;
    (window as any).updateStopButtonState = updateStopButtonState;
    (window as any).startExecutionMonitoring = startExecutionMonitoring;
    (window as any).stopExecutionMonitoring = stopExecutionMonitoring;
    
    // Start the initialization
    initializeUI();
    initializeFirstTab();
    setupKeyboardShortcuts();
    setupTooltips();
    
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