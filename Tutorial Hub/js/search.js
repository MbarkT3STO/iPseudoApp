/**
 * Search Functionality for Tutorial Hub
 */

class TutorialSearch {
    constructor() {
        this.lessons = this.getLessonsData();
        this.init();
    }

    getLessonsData() {
        return [
            { id: '01', title: 'Introduction to Pseudocode', level: 'beginner', file: '01-introduction-to-pseudocode.html', keywords: ['pseudocode', 'introduction', 'basics', 'what is', 'why use'] },
            { id: '02', title: 'Getting Started with iPseudo', level: 'beginner', file: '02-getting-started.html', keywords: ['getting started', 'first program', 'hello world', 'setup', 'interface'] },
            { id: '03', title: 'Variables and Data Types', level: 'beginner', file: '03-variables-and-data-types.html', keywords: ['variables', 'data types', 'integer', 'string', 'boolean', 'declaration'] },
            { id: '04', title: 'Input and Output', level: 'beginner', file: '04-input-and-output.html', keywords: ['input', 'output', 'print', 'read', 'display', 'user input'] },
            { id: '05', title: 'Operators', level: 'beginner', file: '05-operators.html', keywords: ['operators', 'arithmetic', 'comparison', 'logical', 'math'] },
            { id: '06', title: 'Comments and Documentation', level: 'beginner', file: '06-comments-and-documentation.html', keywords: ['comments', 'documentation', 'code comments', 'best practices'] },
            { id: '07', title: 'Conditional Statements', level: 'intermediate', file: '07-conditional-statements.html', keywords: ['if', 'else', 'conditional', 'decision', 'branching', 'switch'] },
            { id: '08', title: 'Loops', level: 'intermediate', file: '08-loops.html', keywords: ['loops', 'for', 'while', 'repeat', 'iteration'] },
            { id: '09', title: 'Nested Loops', level: 'intermediate', file: '09-nested-loops.html', keywords: ['nested loops', 'nested', 'complex loops', 'matrix'] },
            { id: '10', title: 'Functions', level: 'intermediate', file: '10-functions.html', keywords: ['functions', 'return', 'parameters', 'arguments', 'reusable code'] },
            { id: '11', title: 'Procedures', level: 'intermediate', file: '11-procedures.html', keywords: ['procedures', 'subroutines', 'methods', 'void'] },
            { id: '12', title: 'Arrays', level: 'intermediate', file: '12-arrays.html', keywords: ['arrays', 'list', 'collection', 'indexing', 'elements'] },
            { id: '13', title: 'String Operations', level: 'intermediate', file: '13-string-operations.html', keywords: ['strings', 'text', 'concatenation', 'substring', 'manipulation'] },
            { id: '14', title: 'Multidimensional Arrays', level: 'advanced', file: '14-multidimensional-arrays.html', keywords: ['2d arrays', 'matrix', 'multidimensional', 'grid'] },
            { id: '15', title: 'Recursion', level: 'advanced', file: '15-recursion.html', keywords: ['recursion', 'recursive', 'factorial', 'fibonacci'] },
            { id: '16', title: 'Sorting Algorithms', level: 'advanced', file: '16-sorting-algorithms.html', keywords: ['sorting', 'bubble sort', 'quick sort', 'merge sort', 'algorithms'] },
            { id: '17', title: 'Searching Algorithms', level: 'advanced', file: '17-searching-algorithms.html', keywords: ['searching', 'linear search', 'binary search', 'find'] },
            { id: '18', title: 'Data Structures', level: 'advanced', file: '18-data-structures.html', keywords: ['data structures', 'stack', 'queue', 'linked list', 'tree'] },
            { id: '19', title: 'Algorithm Design Patterns', level: 'advanced', file: '19-algorithm-design-patterns.html', keywords: ['algorithm design', 'patterns', 'strategies', 'optimization'] },
            { id: '20', title: 'Best Practices', level: 'advanced', file: '20-best-practices.html', keywords: ['best practices', 'tips', 'coding standards', 'clean code'] }
        ];
    }

    init() {
        this.createSearchBar();
    }

    createSearchBar() {
        const container = document.querySelector('.tutorial-hero-content') || document.querySelector('.container');
        if (!container) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto var(--space-xl);">
                <div style="position: relative;">
                    <input type="text" id="lessonSearch" placeholder="Search lessons... (e.g., 'loops', 'arrays', 'sorting')" style="width: 100%; padding: 1rem 3rem 1rem 3rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); color: var(--text-primary); font-size: 1rem; backdrop-filter: blur(10px); transition: all 0.3s;">
                    <i class="ri-search-line" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-size: 1.25rem; color: var(--text-tertiary);"></i>
                    <button id="clearSearch" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-tertiary); cursor: pointer; font-size: 1.25rem; display: none;">
                        <i class="ri-close-circle-line"></i>
                    </button>
                </div>
                <div id="searchResults" style="margin-top: 1rem; display: none;"></div>
            </div>
        `;

        // Insert after hero badge or at the beginning
        const heroBadge = container.querySelector('.hero-badge');
        if (heroBadge) {
            heroBadge.after(searchContainer);
        } else {
            container.insertBefore(searchContainer, container.firstChild);
        }

        this.attachSearchListeners();
    }

    attachSearchListeners() {
        const searchInput = document.getElementById('lessonSearch');
        const clearBtn = document.getElementById('clearSearch');
        const resultsDiv = document.getElementById('searchResults');

        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length === 0) {
                resultsDiv.style.display = 'none';
                clearBtn.style.display = 'none';
                return;
            }

            clearBtn.style.display = 'block';
            this.performSearch(query, resultsDiv);
        });

        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = 'var(--color-purple-500)';
            searchInput.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
        });

        searchInput.addEventListener('blur', () => {
            searchInput.style.borderColor = 'var(--glass-border)';
            searchInput.style.boxShadow = 'none';
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            resultsDiv.style.display = 'none';
            clearBtn.style.display = 'none';
            searchInput.focus();
        });
    }

    performSearch(query, resultsDiv) {
        const results = this.lessons.filter(lesson => {
            const searchText = `${lesson.title} ${lesson.level} ${lesson.keywords.join(' ')}`.toLowerCase();
            return searchText.includes(query);
        });

        if (results.length === 0) {
            resultsDiv.innerHTML = `
                <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: var(--space-lg); text-align: center; backdrop-filter: blur(10px);">
                    <i class="ri-search-line" style="font-size: 2rem; color: var(--text-tertiary); margin-bottom: 0.5rem;"></i>
                    <div style="color: var(--text-secondary);">No lessons found for "${query}"</div>
                </div>
            `;
            resultsDiv.style.display = 'block';
            return;
        }

        let resultsHTML = `
            <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: var(--space-md); backdrop-filter: blur(10px);">
                <div style="font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: var(--space-sm); padding: 0 var(--space-sm);">
                    Found ${results.length} lesson${results.length !== 1 ? 's' : ''}
                </div>
        `;

        results.forEach(lesson => {
            const levelColor = {
                'beginner': 'var(--color-success)',
                'intermediate': 'var(--color-blue-500)',
                'advanced': 'var(--color-purple-500)'
            }[lesson.level];

            resultsHTML += `
                <a href="${lesson.file}" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); text-decoration: none; border-radius: var(--radius-md); transition: all 0.2s; margin-bottom: 0.5rem;">
                    <div style="flex-shrink: 0; width: 40px; height: 40px; background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500)); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.875rem;">
                        ${lesson.id}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">
                            ${this.highlightMatch(lesson.title, query)}
                        </div>
                        <div style="font-size: 0.75rem; color: ${levelColor}; text-transform: capitalize;">
                            ${lesson.level}
                        </div>
                    </div>
                    <i class="ri-arrow-right-line" style="color: var(--text-tertiary); font-size: 1.25rem;"></i>
                </a>
            `;
        });

        resultsHTML += '</div>';
        resultsDiv.innerHTML = resultsHTML;
        resultsDiv.style.display = 'block';

        // Add hover effects
        resultsDiv.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.background = 'rgba(147, 51, 234, 0.1)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.background = 'transparent';
            });
        });
    }

    highlightMatch(text, query) {
        const index = text.toLowerCase().indexOf(query);
        if (index === -1) return text;

        const before = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const after = text.substring(index + query.length);

        return `${before}<span style="background: rgba(147, 51, 234, 0.3); padding: 0 0.25rem; border-radius: 4px;">${match}</span>${after}`;
    }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            new TutorialSearch();
        }
    });
} else {
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        new TutorialSearch();
    }
}

