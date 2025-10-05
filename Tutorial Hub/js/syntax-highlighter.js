/**
 * Enhanced Syntax Highlighting for iPseudo Code
 */

class SyntaxHighlighter {
    constructor() {
        this.keywords = [
            'Algorithm', 'Endalgorithm', 'Function', 'Endfunction', 'Procedure', 'Endprocedure',
            'Var', 'Const', 'Declare', 'As', 'Type',
            'If', 'Then', 'Else', 'Elseif', 'Endif',
            'For', 'To', 'Step', 'Endfor', 'While', 'Endwhile', 'Repeat', 'Until',
            'Switch', 'Case', 'Default', 'Endswitch',
            'Return', 'Break', 'Continue',
            'Input', 'Output', 'Print', 'Read', 'Display',
            'AND', 'OR', 'NOT', 'MOD', 'DIV',
            'True', 'False', 'Null'
        ];
        
        this.init();
    }

    init() {
        this.highlightAllCodeBlocks();
    }

    highlightAllCodeBlocks() {
        document.querySelectorAll('pre code').forEach(codeBlock => {
            // Skip if already has span elements (manually highlighted)
            if (codeBlock.querySelector('span')) return;
            
            // Skip if already auto-highlighted
            if (codeBlock.classList.contains('auto-highlighted')) return;
            
            const code = codeBlock.textContent;
            
            // Detect if it's NOT pseudocode (detect other programming languages)
            const isPython = /\b(import|def|class|print\(|float\(|input\(|Scanner|System\.)/i.test(code);
            const isJava = /\b(public|static|void|class|import java|Scanner|System\.out)/i.test(code);
            const isJavaScript = /\b(const|let|var|function|console\.log|=>)/i.test(code);
            const isCpp = /\b(#include|std::|cout|cin|using namespace)/i.test(code);
            
            // Skip if it's another programming language
            if (isPython || isJava || isJavaScript || isCpp) {
                return;
            }
            
            // Only highlight if it has pseudocode keywords
            const hasPseudocodeKeywords = /\b(Algorithm|Endalgorithm|Var|Endfor|Endif|Endwhile|Endfunction|Endprocedure)\b/i.test(code);
            
            // Must have pseudocode-specific keywords to be highlighted
            if (!hasPseudocodeKeywords) {
                return;
            }
            
            // Apply syntax highlighting
            const highlighted = this.highlightSyntax(code);
            
            codeBlock.innerHTML = highlighted;
            codeBlock.classList.add('auto-highlighted');
        });
    }

    highlightSyntax(code) {
        // Escape HTML first
        let highlighted = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Highlight comments first (they take precedence)
        highlighted = highlighted.replace(/(#|\/\/)(.*)$/gm, '<span class="syntax-comment">$1$2</span>');

        // Highlight strings (both single and double quotes)
        highlighted = highlighted.replace(/(["'])([^"']*)\1/g, '<span class="syntax-string">$1$2$1</span>');

        // Highlight keywords
        this.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
            highlighted = highlighted.replace(regex, (match) => {
                // Don't highlight if already in a span
                return `<span class="syntax-keyword">${match}</span>`;
            });
        });

        // Highlight numbers
        highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, (match) => {
            return `<span class="syntax-number">${match}</span>`;
        });

        // Highlight operators
        highlighted = highlighted.replace(/([+\-*/%<>=!])/g, '<span class="syntax-operator">$1</span>');

        return highlighted;
    }
}

// Initialize syntax highlighting when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SyntaxHighlighter();
    });
} else {
    new SyntaxHighlighter();
}

