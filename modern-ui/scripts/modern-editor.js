// Configure Monaco Editor loader
// Use an absolute URL for the 'vs' path so AMD loader finds files correctly under file:// in Electron
(() => {
    const href = window.location.href; // e.g. file:///.../dist/renderer/index.html
    const base = href.substring(0, href.lastIndexOf('/') + 1); // .../dist/renderer/
    window.require.config({
        paths: {
            'vs': base + 'monaco/vs'
        }
    });
})();
// Fallback clipboard actions when Monaco commands fail
function handleClipboardAction(action) {
    if (!window.editor)
        return;
    const selection = window.editor.getSelection();
    if (!selection)
        return;
    const model = window.editor.getModel();
    if (!model)
        return;
    try {
        switch (action) {
            case 'cut':
                if (!selection.isEmpty()) {
                    const selectedText = model.getValueInRange(selection);
                    navigator.clipboard.writeText(selectedText).then(() => {
                        window.editor.executeEdits('cut', [{
                                range: selection,
                                text: ''
                            }]);
                    });
                }
                break;
            case 'copy':
                if (!selection.isEmpty()) {
                    const selectedText = model.getValueInRange(selection);
                    navigator.clipboard.writeText(selectedText);
                }
                break;
            case 'paste':
                navigator.clipboard.readText().then(text => {
                    window.editor.executeEdits('paste', [{
                            range: selection,
                            text: text
                        }]);
                });
                break;
        }
    }
    catch (error) {
        console.error('Clipboard action failed:', action, error);
    }
}
// Monaco Editor custom context menu
function showMonacoContextMenu(e) {
    console.log('Context menu triggered!', e);
    // Remove existing context menu
    const existingMenu = document.getElementById('monaco-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    // Check if code is currently executing
    const isExecuting = window.isExecuting || false;
    const stopButton = document.getElementById('btnStop');
    const isStopButtonVisible = stopButton && stopButton.style.display !== 'none';
    const menu = document.createElement('div');
    menu.id = 'monaco-context-menu';
    menu.className = 'context-menu';
    menu.innerHTML = `
        <div class="context-menu-item" data-action="cut">
            <i class="ri-scissors-line"></i>
            <span>Cut</span>
            <span class="shortcut">Ctrl+X</span>
        </div>
        <div class="context-menu-item" data-action="copy">
            <i class="ri-file-copy-line"></i>
            <span>Copy</span>
            <span class="shortcut">Ctrl+C</span>
        </div>
        <div class="context-menu-item" data-action="paste">
            <i class="ri-clipboard-line"></i>
            <span>Paste</span>
            <span class="shortcut">Ctrl+V</span>
        </div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="select-all">
            <i class="ri-checkbox-multiple-line"></i>
            <span>Select All</span>
            <span class="shortcut">Ctrl+A</span>
        </div>
        <div class="context-menu-item" data-action="format">
            <i class="ri-code-s-slash-line"></i>
            <span>Format Code</span>
            <span class="shortcut">Ctrl+Shift+F</span>
        </div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="run">
            <i class="ri-play-line"></i>
            <span>Run Code</span>
            <span class="shortcut">F5</span>
        </div>
        ${isExecuting || isStopButtonVisible ? `
        <div class="context-menu-item" data-action="stop">
            <i class="ri-stop-line"></i>
            <span>Stop Execution</span>
            <span class="shortcut">Ctrl+.</span>
        </div>
        ` : ''}
    `;
    // Position menu
    menu.style.position = 'fixed';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.style.zIndex = '10000';
    document.body.appendChild(menu);
    console.log('Context menu added to DOM');
    // Handle menu actions
    menu.addEventListener('click', (e) => {
        const action = e.target.closest('.context-menu-item')?.getAttribute('data-action');
        if (action && window.editor) {
            try {
                switch (action) {
                    case 'cut':
                        // Use manual implementation directly
                        handleClipboardAction('cut');
                        break;
                    case 'copy':
                        handleClipboardAction('copy');
                        break;
                    case 'paste':
                        handleClipboardAction('paste');
                        break;
                    case 'select-all':
                        // Manual select all
                        const model = window.editor.getModel();
                        if (model) {
                            window.editor.setSelection(model.getFullModelRange());
                        }
                        break;
                    case 'format':
                        // Call the format function from the main app
                        if (typeof window.formatPseudocode === 'function') {
                            window.formatPseudocode();
                        }
                        break;
                    case 'run':
                        // Trigger the run button click
                        const runButton = document.getElementById('btnRun');
                        if (runButton && !runButton.disabled) {
                            runButton.click();
                        }
                        break;
                    case 'stop':
                        // Trigger the stop button click
                        const stopButton = document.getElementById('btnStop');
                        if (stopButton && !stopButton.disabled) {
                            stopButton.click();
                        }
                        break;
                }
            }
            catch (error) {
                console.error('Context menu action failed:', action, error);
                // Fallback to manual implementation for clipboard operations
                if (action === 'cut' || action === 'copy' || action === 'paste') {
                    handleClipboardAction(action);
                }
            }
            menu.remove();
        }
    });
    // Close menu on outside click
    setTimeout(() => {
        document.addEventListener('click', () => {
            menu.remove();
        }, { once: true });
    }, 100);
}
// Function to get hover information for pseudocode keywords
function getKeywordHoverInfo(keyword) {
    const hoverData = {
        'var': {
            label: 'var',
            category: 'Variable Declaration',
            description: 'Declares a new variable that can be modified throughout the program.',
            usage: 'var variableName = value',
            example: 'var age = 25'
        },
        'const': {
            label: 'const',
            category: 'Constant Declaration',
            description: 'Declares a constant value that cannot be changed after initialization.',
            usage: 'const constantName = value',
            example: 'const PI = 3.14159'
        },
        'if': {
            label: 'if',
            category: 'Conditional Statement',
            description: 'Executes code block if the specified condition is true.',
            usage: 'if condition then',
            example: 'if score >= 90 then'
        },
        'else': {
            label: 'else',
            category: 'Conditional Statement',
            description: 'Executes code block if the previous if condition is false.',
            usage: 'else',
            example: 'else\n    print "Failed"'
        },
        'elseif': {
            label: 'elseif',
            category: 'Conditional Statement',
            description: 'Checks another condition if previous if/elseif conditions are false.',
            usage: 'elseif condition then',
            example: 'elseif score >= 60 then'
        },
        'endif': {
            label: 'endif',
            category: 'Block Terminator',
            description: 'Closes an if statement block. Must be used to end if/elseif/else blocks.',
            usage: 'endif',
            example: 'endif'
        },
        'for': {
            label: 'for',
            category: 'Loop Statement',
            description: 'Repeats a code block for a specified range of values.',
            usage: 'for variable = start to end',
            example: 'for i = 1 to 10'
        },
        'to': {
            label: 'to',
            category: 'Loop Range',
            description: 'Specifies the end value in a for loop. Used with for statements.',
            usage: 'for variable = start to end',
            example: 'for i = 1 to 10'
        },
        'endfor': {
            label: 'endfor',
            category: 'Block Terminator',
            description: 'Closes a for loop block. Must be used to end for loops.',
            usage: 'endfor',
            example: 'endfor'
        },
        'while': {
            label: 'while',
            category: 'Loop Statement',
            description: 'Repeats a code block while the specified condition is true.',
            usage: 'while condition',
            example: 'while x < 10'
        },
        'endwhile': {
            label: 'endwhile',
            category: 'Block Terminator',
            description: 'Closes a while loop block. Must be used to end while loops.',
            usage: 'endwhile',
            example: 'endwhile'
        },
        'function': {
            label: 'function',
            category: 'Function Declaration',
            description: 'Declares a new function that can be called with parameters.',
            usage: 'function functionName(parameters)',
            example: 'function addNumbers(a, b)'
        },
        'endfunction': {
            label: 'endfunction',
            category: 'Block Terminator',
            description: 'Closes a function block. Must be used to end function declarations.',
            usage: 'endfunction',
            example: 'endfunction'
        },
        'return': {
            label: 'return',
            category: 'Function Control',
            description: 'Returns a value from a function and exits the function.',
            usage: 'return expression',
            example: 'return result'
        },
        'break': {
            label: 'break',
            category: 'Loop Control',
            description: 'Exits the current loop immediately, continuing execution after the loop.',
            usage: 'break',
            example: 'break'
        },
        'continue': {
            label: 'continue',
            category: 'Loop Control',
            description: 'Skips the rest of the current loop iteration and continues with the next iteration.',
            usage: 'continue',
            example: 'continue'
        },
        'print': {
            label: 'print',
            category: 'Output Statement',
            description: 'Displays text or values to the console output.',
            usage: 'print expression',
            example: 'print "Hello World"'
        },
        'input': {
            label: 'input',
            category: 'Input Statement',
            description: 'Prompts the user for input and stores the value in a variable.',
            usage: 'input prompt',
            example: 'var name = input "Enter your name: "'
        },
        'then': {
            label: 'then',
            category: 'Conditional',
            description: 'Indicates the beginning of the code block to execute when an if condition is true.',
            usage: 'if condition then',
            example: 'if x > 5 then'
        },
        'do': {
            label: 'do',
            category: 'Loop Control',
            description: 'Begins a do-while loop that executes at least once before checking the condition.',
            usage: 'do ... while condition',
            example: 'do ... while x < 10'
        },
        'until': {
            label: 'until',
            category: 'Loop Control',
            description: 'Used with repeat loops to specify the condition that must be met to exit the loop.',
            usage: 'repeat ... until condition',
            example: 'repeat ... until x > 10'
        },
        'repeat': {
            label: 'repeat',
            category: 'Loop Control',
            description: 'Begins a repeat-until loop that executes until a condition is met.',
            usage: 'repeat ... until condition',
            example: 'repeat ... until x > 10'
        },
        'case': {
            label: 'case',
            category: 'Switch Statement',
            description: 'Defines a specific case in a switch statement to match against a value.',
            usage: 'case value:',
            example: 'case 1:'
        },
        'switch': {
            label: 'switch',
            category: 'Switch Statement',
            description: 'Begins a switch statement that executes different code based on a value.',
            usage: 'switch expression',
            example: 'switch choice'
        },
        'endswitch': {
            label: 'endswitch',
            category: 'Block Terminator',
            description: 'Closes a switch statement block. Must be used to end switch statements.',
            usage: 'endswitch',
            example: 'endswitch'
        },
        'true': {
            label: 'true',
            category: 'Boolean Literal',
            description: 'Boolean literal representing the true value.',
            usage: 'true',
            example: 'var flag = true'
        },
        'false': {
            label: 'false',
            category: 'Boolean Literal',
            description: 'Boolean literal representing the false value.',
            usage: 'false',
            example: 'var flag = false'
        },
        'null': {
            label: 'null',
            category: 'Null Literal',
            description: 'Represents the absence of a value or uninitialized variable.',
            usage: 'null',
            example: 'var value = null'
        },
        'and': {
            label: 'and',
            category: 'Logical Operator',
            description: 'Logical AND operator that returns true only if both conditions are true.',
            usage: 'condition1 and condition2',
            example: 'if x > 5 and y < 10'
        },
        'or': {
            label: 'or',
            category: 'Logical Operator',
            description: 'Logical OR operator that returns true if at least one condition is true.',
            usage: 'condition1 or condition2',
            example: 'if x > 5 or y < 10'
        },
        'not': {
            label: 'not',
            category: 'Logical Operator',
            description: 'Logical NOT operator that inverts the boolean value of a condition.',
            usage: 'not condition',
            example: 'if not (x > 5)'
        },
        'mod': {
            label: 'mod',
            category: 'Arithmetic Operator',
            description: 'Modulo operator that returns the remainder of a division operation.',
            usage: 'a mod b',
            example: 'var remainder = 10 mod 3'
        },
        'div': {
            label: 'div',
            category: 'Arithmetic Operator',
            description: 'Integer division operator that returns the quotient without the remainder.',
            usage: 'a div b',
            example: 'var quotient = 10 div 3'
        },
        'algorithm': {
            label: 'algorithm',
            category: 'Algorithm Declaration',
            description: 'Declares the start of an algorithm with a given name. Must be the first statement in pseudocode.',
            usage: 'Algorithm <name>',
            example: 'Algorithm CalculateSum'
        },
        'endalgorithm': {
            label: 'endalgorithm',
            category: 'Algorithm Terminator',
            description: 'Marks the end of an algorithm. Must be the last statement in pseudocode.',
            usage: 'EndAlgorithm',
            example: 'EndAlgorithm'
        }
    };
    return hoverData[keyword] || null;
}
// Define custom language for pseudocode
const pseudocodeLanguage = {
    defaultToken: '',
    tokenizer: {
        root: [
            // Keywords - All reserved words from the pseudocode specification
            [/\b(var|const|if|then|else|elseif|endif|for|to|endfor|while|endwhile|do|until|repeat|case|switch|endswitch|function|endfunction|return|break|continue|print|input|true|false|null|and|or|not|mod|div|algorithm|endalgorithm)\b/, 'keyword'],
            // Strings
            [/".*?"/, 'string'],
            [/'.*?'/, 'string'],
            // Numbers
            [/\b\d+(\.\d+)?\b/, 'number'],
            // Comments
            [/#.*$/, 'comment'],
            // Operators
            [/[+\-*\/=<>!]+/, 'operator'],
        ]
    }
};
// Initialize Monaco Editor
window.require(['vs/editor/editor.main'], function () {
    // 'app-debug' overlay intentionally left static; do not write runtime readiness text here.
    // Ensure editor container exists
    const editorContainer = document.getElementById('editor');
    if (!editorContainer) {
        console.error('Editor container not found');
        return;
    }
    // Register custom language
    window.monaco.languages.register({ id: 'pseudocode' });
    window.monaco.languages.setMonarchTokensProvider('pseudocode', pseudocodeLanguage);
    // Define custom theme
    window.monaco.editor.defineTheme('pseudoTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
            { token: 'string', foreground: '4EC9B0' },
            { token: 'number', foreground: 'B5CEA8' },
            { token: 'comment', foreground: '608B4E', fontStyle: 'italic' },
            { token: 'operator', foreground: 'D4D4D4' }
        ],
        colors: {
            'editor.background': '#1E1E1E',
            'editor.foreground': '#D4D4D4',
            'editor.lineHighlightBackground': '#2A2A2A',
            'editor.selectionBackground': '#264F78',
            'editorCursor.foreground': '#569CD6',
            'editorLineNumber.foreground': '#858585'
        }
    });
    // Default initial value with welcome message and sample code
    let initialValue = 'Algorithm FactorialCalculation\n# Welcome to iPseudo IDE\n# Write your pseudocode here\n\n# Sample factorial calculation:\nvar n = 5\nvar fact = 1\n\nfor i = 1 to n\n    fact = fact * i\nendfor\n\nprint "Factorial of", n\nprint fact\n\nEndAlgorithm';
    // Determine editor font size from CSS variable (fallback to 15)
    const cssFontSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--editor-font-size')) || 15;
    // Load minimap setting from localStorage
    let minimapEnabled = true; // Default to true
    try {
        const savedSettings = localStorage.getItem('iPseudoSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            minimapEnabled = settings.minimap !== undefined ? settings.minimap : true;
        }
    }
    catch (error) {
        console.error('Error loading minimap setting:', error);
    }
    // Create editor instance
    const editor = window.monaco.editor.create(document.getElementById('editor'), {
        value: initialValue,
        language: 'pseudocode',
        theme: 'pseudoTheme',
        fontSize: 18,
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        minimap: {
            enabled: minimapEnabled
        },
        quickSuggestions: { other: true, comments: false, strings: false },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        wordBasedSuggestions: false,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        rulers: [],
        bracketPairColorization: {
            enabled: true
        },
        readOnly: false,
        contextmenu: false,
        mouseWheelZoom: true,
        wordWrap: 'on',
        scrollbar: {
            alwaysConsumeMouseWheel: true,
            vertical: 'auto',
            horizontal: 'auto'
        }
    });
    // Make editor globally available
    window.editor = editor;
    // Add custom context menu for Monaco Editor
    editor.onContextMenu((e) => {
        console.log('Monaco onContextMenu triggered', e);
        e.event.preventDefault();
        showMonacoContextMenu(e.event);
    });
    // Also add direct event listener to editor container as fallback
    if (editorContainer) {
        editorContainer.addEventListener('contextmenu', (e) => {
            console.log('Direct contextmenu event on editor container', e);
            e.preventDefault();
            showMonacoContextMenu(e);
        });
    }
    // Add keydown listener for Enter key
    editor.onKeyDown((e) => {
        if (e.keyCode === 3 /* Enter */) {
            // Use setTimeout to ensure this runs after the new line is created
            setTimeout(() => {
                const position = editor.getPosition();
                editor.revealLineInCenter(position.lineNumber, 0); // Scroll to the new line
            }, 0);
        }
    });
    // Set up editor change listeners
    setupEditorListeners();
    // Register hover provider for pseudocode keywords
    window.monaco.languages.registerHoverProvider('pseudocode', {
        provideHover: function (model, position) {
            const word = model.getWordAtPosition(position);
            if (!word)
                return null;
            const wordText = word.word.toLowerCase();
            const hoverInfo = getKeywordHoverInfo(wordText);
            if (hoverInfo) {
                return {
                    range: new window.monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
                    contents: [
                        {
                            value: `**${hoverInfo.label}** - ${hoverInfo.category}\n\n${hoverInfo.description}\n\n**Usage:** \`${hoverInfo.usage}\`\n\n**Example:** \`${hoverInfo.example}\``
                        }
                    ]
                };
            }
            return null;
        }
    });
    // Register completion provider with all reserved pseudocode keywords
    const reservedKeywords = ['var', 'const', 'if', 'then', 'else', 'elseif', 'endif', 'for', 'to', 'endfor', 'while', 'endwhile', 'do', 'until', 'repeat', 'case', 'switch', 'endswitch', 'function', 'endfunction', 'return', 'break', 'continue', 'print', 'input', 'true', 'false', 'null', 'and', 'or', 'not', 'mod', 'div', 'algorithm', 'endalgorithm'];
    window.monaco.languages.registerCompletionItemProvider('pseudocode', {
        triggerCharacters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        provideCompletionItems: function (model, position) {
            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };
            // Scan model for current var, const, and function declarations
            const text = model.getValue();
            const varRe = /\b(?:var|const)\s+([a-zA-Z_]\w*)/gi;
            const funcRe = /^\s*function\s+([a-zA-Z_]\w*)/gim;
            const vars = new Set();
            const funcs = new Set();
            let m;
            while ((m = varRe.exec(text))) {
                vars.add(m[1]);
            }
            while ((m = funcRe.exec(text))) {
                funcs.add(m[1]);
            }
            const suggestions = [];
            // Define keyword suggestions with descriptions
            const keywordSuggestions = [
                { label: 'var', detail: 'Declare a variable', documentation: 'Declares a new variable that can be modified' },
                { label: 'const', detail: 'Declare a constant', documentation: 'Declares a constant value that cannot be changed' },
                { label: 'if', detail: 'Conditional statement', documentation: 'Executes code if condition is true' },
                { label: 'then', detail: 'If condition block', documentation: 'Indicates the beginning of code block when if condition is true' },
                { label: 'else', detail: 'Alternative condition', documentation: 'Executes code if previous condition is false' },
                { label: 'elseif', detail: 'Additional condition', documentation: 'Checks another condition if previous ones are false' },
                { label: 'endif', detail: 'End if block', documentation: 'Closes an if statement block' },
                { label: 'for', detail: 'For loop', documentation: 'Repeats code for a range of values' },
                { label: 'to', detail: 'Loop range', documentation: 'Specifies the end value in a for loop' },
                { label: 'endfor', detail: 'End for loop', documentation: 'Closes a for loop block' },
                { label: 'while', detail: 'While loop', documentation: 'Repeats code while condition is true' },
                { label: 'endwhile', detail: 'End while loop', documentation: 'Closes a while loop block' },
                { label: 'do', detail: 'Do-while loop', documentation: 'Begins a do-while loop that executes at least once' },
                { label: 'until', detail: 'Repeat until condition', documentation: 'Used with repeat loops for exit condition' },
                { label: 'repeat', detail: 'Repeat-until loop', documentation: 'Begins a repeat-until loop' },
                { label: 'case', detail: 'Switch case', documentation: 'Defines a specific case in a switch statement' },
                { label: 'switch', detail: 'Switch statement', documentation: 'Begins a switch statement' },
                { label: 'endswitch', detail: 'End switch', documentation: 'Closes a switch statement block' },
                { label: 'function', detail: 'Function declaration', documentation: 'Declares a new function' },
                { label: 'endfunction', detail: 'End function', documentation: 'Closes a function block' },
                { label: 'return', detail: 'Return value', documentation: 'Returns a value from a function' },
                { label: 'break', detail: 'Break loop', documentation: 'Exits the current loop immediately' },
                { label: 'continue', detail: 'Continue loop', documentation: 'Skips to the next iteration of the loop' },
                { label: 'print', detail: 'Print output', documentation: 'Displays text or values to the console' },
                { label: 'input', detail: 'Get user input', documentation: 'Prompts user for input and stores the value' },
                { label: 'true', detail: 'Boolean true', documentation: 'Boolean literal representing the true value' },
                { label: 'false', detail: 'Boolean false', documentation: 'Boolean literal representing the false value' },
                { label: 'null', detail: 'Null value', documentation: 'Represents the absence of a value' },
                { label: 'and', detail: 'Logical AND', documentation: 'Logical AND operator' },
                { label: 'or', detail: 'Logical OR', documentation: 'Logical OR operator' },
                { label: 'not', detail: 'Logical NOT', documentation: 'Logical NOT operator' },
                { label: 'mod', detail: 'Modulo operator', documentation: 'Returns the remainder of division' },
                { label: 'div', detail: 'Integer division', documentation: 'Returns the quotient without remainder' },
                { label: 'algorithm', detail: 'Algorithm declaration', documentation: 'Declares the start of an algorithm with a given name' },
                { label: 'endalgorithm', detail: 'End algorithm', documentation: 'Marks the end of an algorithm' }
            ];
            // Add keyword suggestions (filter by current word if any)
            const currentWord = word.word.toLowerCase();
            keywordSuggestions.forEach(kw => {
                // Show all suggestions if no current word, or filter by current word
                if (!currentWord || kw.label.toLowerCase().startsWith(currentWord)) {
                    suggestions.push({
                        label: kw.label,
                        kind: window.monaco.languages.CompletionItemKind.Keyword,
                        insertText: kw.label,
                        range,
                        sortText: '0' + kw.label,
                        detail: kw.detail,
                        documentation: kw.documentation
                    });
                }
            });
            // Add function suggestions
            Array.from(funcs).sort().forEach(f => {
                suggestions.push({
                    label: f + '()',
                    kind: window.monaco.languages.CompletionItemKind.Function,
                    insertText: f + '()',
                    range,
                    sortText: '1' + f,
                    detail: 'User-defined function',
                    documentation: `Function: ${f}()`
                });
            });
            // Add variable suggestions
            Array.from(vars).sort().forEach(v => {
                suggestions.push({
                    label: v,
                    kind: window.monaco.languages.CompletionItemKind.Variable,
                    insertText: v,
                    range,
                    sortText: '2' + v,
                    detail: 'Variable',
                    documentation: `Variable: ${v}`
                });
            });
            return { suggestions };
        }
    });
    // Add content change listener to handle run button state
    const runButton = document.getElementById('btnRun');
    if (runButton) {
        // Initial state
        runButton.disabled = !editor.getValue().trim();
        // Listen for content changes
        editor.onDidChangeModelContent(() => {
            const content = editor.getValue().trim();
            runButton.disabled = !content;
        });
    }
    // Notify other scripts that editor is ready (if a global hook exists)
    if (window.onEditorReady && typeof window.onEditorReady === 'function') {
        try {
            window.onEditorReady(editor);
        }
        catch (e) {
            console.error('onEditorReady hook failed', e);
        }
    }
    // Auto indentation on Enter: copy previous line's leading whitespace when available
    editor.addCommand(window.monaco.KeyCode.Enter, () => {
        try {
            const pos = editor.getPosition();
            const model = editor.getModel();
            if (!model || !pos) {
                editor.trigger('keyboard', 'type', { text: '\n' });
                return;
            }
            // Determine indent unit (use tabSize from options if available, fallback to 4 spaces)
            const tabSize = (editor.getOption && editor.getOption(window.monaco.editor.EditorOption.tabSize)) || 4;
            const indentUnit = ' '.repeat(tabSize);
            // Helpers to detect block openers and closers
            const openerRe = /^\s*(if\b.*(?:\bthen)?|for\b.*\bto\b.*|while\b.*|function\b.*)$/i;
            const closerRe = /^\s*(endif|endfor|endwhile|endfunction)\b/i;
            // Compute nesting level by scanning from start to the previous line
            let level = 0;
            const prevLineNumber = Math.max(1, pos.lineNumber - 1);
            for (let i = 1; i <= prevLineNumber; i++) {
                const text = model.getLineContent(i).trim();
                if (!text)
                    continue;
                if (closerRe.test(text)) {
                    level = Math.max(0, level - 1);
                    continue;
                }
                if (openerRe.test(text)) {
                    level++;
                    continue;
                }
                // 'else' and 'elseif' should not change the nesting count but are typically at the same level
                // so we don't modify level here; the computed level will place subsequent lines correctly.
            }
            const indent = indentUnit.repeat(level);
            // Insert newline + computed indent
            const range = new window.monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);
            editor.executeEdits('autoIndent', [{ range, text: '\n' + indent, forceMoveMarkers: true }]);
            // Move cursor to after inserted indent
            const newPosition = { lineNumber: pos.lineNumber + 1, column: indent.length + 1 };
            editor.setPosition(newPosition);
        }
        catch (err) {
            editor.trigger('keyboard', 'type', { text: '\n' });
        }
    });
});
function setupEditorListeners() {
    if (!window.editor)
        return;
    // Track cursor position changes
    window.editor.onDidChangeCursorPosition((e) => {
        if (window.activeFilePath && window.openFiles && window.openFiles.has(window.activeFilePath)) {
            const file = window.openFiles.get(window.activeFilePath);
            if (file) {
                file.cursorPosition = e.position;
            }
        }
    });
    // Track scroll position changes
    window.editor.onDidScrollChange((e) => {
        if (window.activeFilePath && window.openFiles && window.openFiles.has(window.activeFilePath)) {
            const file = window.openFiles.get(window.activeFilePath);
            if (file) {
                file.scrollPosition = e.scrollTop;
            }
        }
    });
    // Track content changes
    window.editor.onDidChangeModelContent(() => {
        if (window.activeFilePath && window.openFiles && window.openFiles.has(window.activeFilePath)) {
            const content = window.editor.getValue();
            const file = window.openFiles.get(window.activeFilePath);
            if (file) {
                file.content = content;
                const isDirty = content !== (file.originalContent || '');
                if (file.dirty !== isDirty) {
                    file.dirty = isDirty;
                    window.updateTabDirtyState(window.activeFilePath, isDirty);
                    // Update window title
                    const fileName = window.activeFilePath.split('/').pop();
                    document.title = `${fileName}${isDirty ? ' *' : ''} - iPseudo IDE`;
                }
            }
        }
    });
}
// Make this function globally available
window.setupEditorListeners = setupEditorListeners;
