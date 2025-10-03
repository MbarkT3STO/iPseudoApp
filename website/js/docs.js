// ===== Documentation Pages Interactive Features =====

// Copy code functionality
window.copyCode = function(button) {
    const codeBlock = button.closest('.code-block');
    const codeContent = codeBlock.querySelector('.code-content');
    
    if (!codeContent) return;
    
    // Get text content
    const code = codeContent.textContent;
    
    // Copy to clipboard
    navigator.clipboard.writeText(code).then(() => {
        // Update button
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="ri-check-line"></i><span>Copied!</span>';
        button.style.background = 'rgba(16, 185, 129, 0.2)';
        button.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        button.style.color = 'rgb(16, 185, 129)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        button.innerHTML = '<i class="ri-error-warning-line"></i><span>Failed</span>';
        setTimeout(() => {
            button.innerHTML = '<i class="ri-file-copy-line"></i><span>Copy</span>';
        }, 2000);
    });
};

// Highlight current section in sidebar while scrolling
const sections = document.querySelectorAll('.doc-section');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    if (current) {
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }
});

// Add line numbers to code blocks
document.querySelectorAll('.code-content').forEach(code => {
    const lines = code.textContent.split('\n');
    let html = '';
    
    lines.forEach((line, index) => {
        if (line.trim()) {
            const lineNumber = `<span class="line-number">${index + 1}</span>`;
            html += lineNumber + line + '\n';
        } else {
            html += '\n';
        }
    });
    
    // Don't replace if already has line numbers
    if (!code.textContent.includes('class="line-number"')) {
        // code.innerHTML = html;
    }
});

// Console message
console.log('%c📚 iPseudo IDE Documentation', 
    'font-size: 16px; font-weight: bold; color: rgb(147, 51, 234);'
);

