// Configure Monaco Editor loader
// Use an absolute URL for the 'vs' path so AMD loader finds files correctly under file:// in Electron
(() => {
    const href = window.location.href; // e.g. file:///.../dist/renderer/index.html
    const base = href.substring(0, href.lastIndexOf('/') + 1); // .../dist/renderer/
    require.config({
        paths: {
            'vs': base + 'monaco/vs'
        }
    });
})();

// Define custom language for pseudocode
const pseudocodeLanguage = {
    defaultToken: '',
    tokenizer: {
        root: [
            // Keywords
            [/\b(var|input|print|if|then|elseif|else|endif|while|endwhile|for|to|endfor|function|return|endfunction|and|or|not|break|continue|true|false|null)\b/, 'keyword'],

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
require(['vs/editor/editor.main'], function() {
    // 'app-debug' overlay intentionally left static; do not write runtime readiness text here.

    // Ensure editor container exists
    const editorContainer = document.getElementById('editor');
    if (!editorContainer) {
        console.error('Editor container not found');
        return;
    }

    // Register custom language
    monaco.languages.register({ id: 'pseudocode' });
    monaco.languages.setMonarchTokensProvider('pseudocode', pseudocodeLanguage);

    // Define custom theme
    monaco.editor.defineTheme('pseudoTheme', {
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
    let initialValue = '# Welcome to iPseudo IDE\n# Write your pseudocode here\n\n# Sample factorial calculation:\nvar n = 5\nvar fact = 1\n\nfor i = 1 to n\n    fact = fact * i\nendfor\n\nprint "Factorial of", n\nprint fact';

    // Determine editor font size from CSS variable (fallback to 15)
    const cssFontSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--editor-font-size')) || 15;

    // Create editor instance
    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: initialValue,
        language: 'pseudocode',
        theme: 'pseudoTheme',
        fontSize: cssFontSize,
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        minimap: {
            enabled: false
        },
        quickSuggestions: { other: true, comments: false, strings: false },
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        rulers: [80],
        bracketPairColorization: {
            enabled: true
        },
        readOnly: false,
        contextmenu: true,
        mouseWheelZoom: true,
        wordWrap: 'on'
    });

    // Make editor globally available
    window.editor = editor;

    // Set up editor change listeners
    setupEditorListeners();

    // Register completion provider with only reserved pseudocode keywords
    const reservedKeywords = ['var','input','print','if','then','elseif','else','endif','while','endwhile','for','to','endfor','function','return','endfunction','and','or','not','break','continue','true','false','null'];
    monaco.languages.registerCompletionItemProvider('pseudocode', {
        provideCompletionItems: function(model, position) {
            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };

            // Scan model for current var and function/procedure declarations
            const text = model.getValue();
            const varRe = /\bvar\s+([a-zA-Z_]\w*)/gi;
            const funcRe = /^\s*(?:function|procedure)\s+([a-zA-Z_]\w*)/gim;
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
            // reserved keywords first
            for (const k of reservedKeywords) {
                suggestions.push({ label: k, kind: monaco.languages.CompletionItemKind.Keyword, insertText: k, range, sortText: '0' + k });
            }
            // functions
            Array.from(funcs).sort().forEach(f => {
                suggestions.push({ label: f + '()', kind: monaco.languages.CompletionItemKind.Function, insertText: f + '()', range, sortText: '1' + f });
            });
            // variables
            Array.from(vars).sort().forEach(v => {
                suggestions.push({ label: v, kind: monaco.languages.CompletionItemKind.Variable, insertText: v, range, sortText: '2' + v });
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
        try { window.onEditorReady(editor); } catch (e) { console.error('onEditorReady hook failed', e); }
    }

    // Auto indentation on Enter: copy previous line's leading whitespace when available
    editor.addCommand(monaco.KeyCode.Enter, () => {
        try {
            const pos = editor.getPosition();
            const model = editor.getModel();
            if (!model || !pos) {
                editor.trigger('keyboard', 'type', { text: '\n' });
                return;
            }

            // Determine indent unit (use tabSize from options if available, fallback to 4 spaces)
            const tabSize = (editor.getOption && editor.getOption(monaco.editor.EditorOption.tabSize)) || 4;
            const indentUnit = ' '.repeat(tabSize);

            // Helpers to detect block openers and closers
            const openerRe = /^\s*(if\b.*\bthen|for\b.*\bto\b.*|while\b.*|function\b.*)$/i;
            const closerRe = /^\s*(endif|endfor|endwhile|endfunction)\b/i;

            // Compute nesting level by scanning from start to the previous line
            let level = 0;
            const prevLineNumber = Math.max(1, pos.lineNumber - 1);
            for (let i = 1; i <= prevLineNumber; i++) {
                const text = model.getLineContent(i).trim();
                if (!text) continue;
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
            const range = new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);
            editor.executeEdits('autoIndent', [{ range, text: '\n' + indent, forceMoveMarkers: true }]);
            // Move cursor to after inserted indent
            const newPosition = { lineNumber: pos.lineNumber + 1, column: indent.length + 1 };
            editor.setPosition(newPosition);
        } catch (err) {
            editor.trigger('keyboard', 'type', { text: '\n' });
        }
    });
});

function setupEditorListeners() {
    if (!window.editor) return;

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
                    updateTabDirtyState(window.activeFilePath, isDirty);
                    
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
