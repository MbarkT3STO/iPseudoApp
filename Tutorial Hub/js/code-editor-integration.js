/**
 * Live Code Editor Integration
 * Adds "Try in iPseudo" buttons to code examples
 */

class CodeEditorIntegration {
    constructor() {
        this.editorUrl = 'https://ipseudoeditor.netlify.app/';
        this.init();
    }

    init() {
        this.addTryButtons();
    }

    addTryButtons() {
        document.querySelectorAll('pre code').forEach((codeBlock, index) => {
            const pre = codeBlock.parentElement;
            const code = codeBlock.textContent;

            // Skip if code is too short or doesn't look like pseudocode
            if (code.trim().length < 20) return;

            const tryBtn = document.createElement('button');
            tryBtn.className = 'try-code-btn';
            tryBtn.innerHTML = `
                <i class="ri-play-circle-line"></i>
                <span>Try in iPseudo</span>
            `;
            tryBtn.style.cssText = `
                position: absolute;
                top: 0.5rem;
                right: 3rem;
                padding: 0.5rem 1rem;
                background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500));
                border: none;
                border-radius: var(--radius-sm);
                color: white;
                cursor: pointer;
                font-size: 0.875rem;
                font-weight: 600;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 0.375rem;
                box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
            `;

            tryBtn.addEventListener('mouseenter', () => {
                tryBtn.style.transform = 'translateY(-2px)';
                tryBtn.style.boxShadow = '0 4px 12px rgba(147, 51, 234, 0.4)';
            });

            tryBtn.addEventListener('mouseleave', () => {
                tryBtn.style.transform = 'translateY(0)';
                tryBtn.style.boxShadow = '0 2px 8px rgba(147, 51, 234, 0.3)';
            });

            tryBtn.addEventListener('click', () => {
                this.openInEditor(code);
            });

            // Adjust positioning if copy button exists
            const copyBtn = pre.querySelector('.copy-code-btn');
            if (copyBtn) {
                tryBtn.style.right = '4rem';
            }

            pre.appendChild(tryBtn);
        });
    }

    openInEditor(code) {
        // Encode the code for URL
        const encodedCode = encodeURIComponent(code);
        
        // Open in new tab with code pre-filled
        // Note: This assumes the editor supports a 'code' query parameter
        // If not, it will just open the editor
        window.open(`${this.editorUrl}?code=${encodedCode}`, '_blank');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CodeEditorIntegration();
    });
} else {
    new CodeEditorIntegration();
}

