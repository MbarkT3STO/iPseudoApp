/**
 * Global Search Functionality
 * Search across all lessons and exercises
 */

class GlobalSearch {
    constructor() {
        this.searchData = this.buildSearchIndex();
        this.init();
    }

    init() {
        this.createSearchButton();
        this.createSearchModal();
        this.setupKeyboardShortcut();
    }

    buildSearchIndex() {
        const lessons = [
            { id: '01', title: 'Introduction to Pseudocode', file: '01-introduction-to-pseudocode.html', level: 'beginner', type: 'lesson', icon: 'ri-file-text-line', keywords: ['pseudocode', 'introduction', 'basics', 'algorithm', 'programming'] },
            { id: '02', title: 'Getting Started with iPseudo', file: '02-getting-started.html', level: 'beginner', type: 'lesson', icon: 'ri-rocket-line', keywords: ['ipseudo', 'setup', 'installation', 'start', 'ide'] },
            { id: '03', title: 'Variables and Data Types', file: '03-variables-and-data-types.html', level: 'beginner', type: 'lesson', icon: 'ri-database-2-line', keywords: ['variables', 'data types', 'integer', 'string', 'boolean', 'real', 'declaration'] },
            { id: '04', title: 'Input and Output', file: '04-input-and-output.html', level: 'beginner', type: 'lesson', icon: 'ri-input-method-line', keywords: ['input', 'output', 'print', 'read', 'display', 'prompt'] },
            { id: '05', title: 'Operators', file: '05-operators.html', level: 'beginner', type: 'lesson', icon: 'ri-calculator-line', keywords: ['operators', 'arithmetic', 'comparison', 'logical', 'modulo', 'division'] },
            { id: '06', title: 'Comments and Documentation', file: '06-comments-and-documentation.html', level: 'beginner', type: 'lesson', icon: 'ri-chat-3-line', keywords: ['comments', 'documentation', 'notes', 'description'] },
            { id: '07', title: 'Conditional Statements', file: '07-conditional-statements.html', level: 'intermediate', type: 'lesson', icon: 'ri-git-branch-line', keywords: ['if', 'else', 'elseif', 'conditional', 'decision', 'branching'] },
            { id: '08', title: 'Loops', file: '08-loops.html', level: 'intermediate', type: 'lesson', icon: 'ri-loop-right-line', keywords: ['loops', 'for', 'while', 'do', 'repeat', 'iteration'] },
            { id: '09', title: 'Nested Loops', file: '09-nested-loops.html', level: 'intermediate', type: 'lesson', icon: 'ri-grid-line', keywords: ['nested', 'loops', 'matrix', 'pattern', 'double loop'] },
            { id: '10', title: 'Functions', file: '10-functions.html', level: 'intermediate', type: 'lesson', icon: 'ri-function-line', keywords: ['functions', 'return', 'parameters', 'arguments', 'modular'] },
            { id: '11', title: 'Procedures', file: '11-procedures.html', level: 'intermediate', type: 'lesson', icon: 'ri-code-s-slash-line', keywords: ['procedures', 'subroutines', 'void', 'call'] },
            { id: '12', title: 'Arrays', file: '12-arrays.html', level: 'intermediate', type: 'lesson', icon: 'ri-list-check', keywords: ['arrays', 'list', 'index', 'collection', 'elements'] },
            { id: '13', title: 'String Operations', file: '13-string-operations.html', level: 'intermediate', type: 'lesson', icon: 'ri-text', keywords: ['string', 'text', 'concatenation', 'substring', 'length'] },
            { id: '14', title: 'Multidimensional Arrays', file: '14-multidimensional-arrays.html', level: 'advanced', type: 'lesson', icon: 'ri-layout-grid-line', keywords: ['multidimensional', 'arrays', 'matrix', '2d', 'grid'] },
            { id: '15', title: 'Recursion', file: '15-recursion.html', level: 'advanced', type: 'lesson', icon: 'ri-refresh-line', keywords: ['recursion', 'recursive', 'base case', 'factorial', 'fibonacci'] },
            { id: '16', title: 'Sorting Algorithms', file: '16-sorting-algorithms.html', level: 'advanced', type: 'lesson', icon: 'ri-sort-asc', keywords: ['sorting', 'bubble', 'selection', 'insertion', 'quicksort', 'mergesort'] },
            { id: '17', title: 'Searching Algorithms', file: '17-searching-algorithms.html', level: 'advanced', type: 'lesson', icon: 'ri-search-line', keywords: ['searching', 'linear', 'binary', 'search', 'find'] },
            { id: '18', title: 'Data Structures', file: '18-data-structures.html', level: 'advanced', type: 'lesson', icon: 'ri-stack-line', keywords: ['data structures', 'stack', 'queue', 'linked list', 'tree'] },
            { id: '19', title: 'Algorithm Design Patterns', file: '19-algorithm-design-patterns.html', level: 'advanced', type: 'lesson', icon: 'ri-puzzle-line', keywords: ['algorithm', 'design', 'patterns', 'divide', 'conquer', 'dynamic'] },
            { id: '20', title: 'Best Practices', file: '20-best-practices.html', level: 'advanced', type: 'lesson', icon: 'ri-medal-line', keywords: ['best practices', 'optimization', 'clean code', 'efficiency'] },
            
            // Exercises
            { id: 'ex-variables', title: 'Variables Exercises', file: 'Exercises/exercises-variables.html', level: 'beginner', type: 'exercise', icon: 'ri-database-2-fill', keywords: ['variables', 'practice', 'exercises', 'problems'] },
            { id: 'ex-operators', title: 'Operators Exercises', file: 'Exercises/exercises-operators.html', level: 'beginner', type: 'exercise', icon: 'ri-calculator-fill', keywords: ['operators', 'practice', 'exercises', 'problems'] },
            { id: 'ex-conditionals', title: 'Conditionals Exercises', file: 'Exercises/exercises-conditionals.html', level: 'intermediate', type: 'exercise', icon: 'ri-git-branch-fill', keywords: ['conditionals', 'if', 'else', 'practice', 'exercises'] },
            { id: 'ex-loops', title: 'Loops Exercises', file: 'Exercises/exercises-loops.html', level: 'intermediate', type: 'exercise', icon: 'ri-loop-right-fill', keywords: ['loops', 'for', 'while', 'practice', 'exercises'] },
            { id: 'ex-functions', title: 'Functions Exercises', file: 'Exercises/exercises-functions.html', level: 'intermediate', type: 'exercise', icon: 'ri-function-fill', keywords: ['functions', 'return', 'practice', 'exercises'] },
            { id: 'ex-arrays', title: 'Arrays Exercises', file: 'Exercises/exercises-arrays.html', level: 'intermediate', type: 'exercise', icon: 'ri-list-check-2', keywords: ['arrays', 'list', 'practice', 'exercises'] }
        ];

        return lessons;
    }

    createSearchButton() {
        const navbarActions = document.querySelector('.navbar-actions');
        if (!navbarActions) return;

        const searchBtn = document.createElement('button');
        searchBtn.className = 'action-btn';
        searchBtn.id = 'globalSearchBtn';
        searchBtn.innerHTML = `
            <i class="ri-search-line"></i>
            <span>Search</span>
        `;
        searchBtn.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.625rem 1.25rem;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-md);
            color: var(--text-primary);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
            flex-shrink: 0;
        `;

        searchBtn.addEventListener('click', () => this.openSearch());

        // Insert before the "Try Live" button
        const tryLiveBtn = navbarActions.querySelector('a[href*="ipseudoeditor"]');
        if (tryLiveBtn) {
            navbarActions.insertBefore(searchBtn, tryLiveBtn);
        } else {
            navbarActions.appendChild(searchBtn);
        }
    }

    createSearchModal() {
        const modal = document.createElement('div');
        modal.id = 'globalSearchModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: none;
            align-items: flex-start;
            justify-content: center;
            padding: 10vh 1rem 1rem;
            overflow-y: auto;
        `;

        modal.innerHTML = `
            <div id="searchContainer" style="width: 100%; max-width: 700px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-xl); backdrop-filter: blur(20px); box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3); animation: slideDown 0.3s;">
                <div style="padding: var(--space-lg); border-bottom: 1px solid var(--glass-border);">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <i class="ri-search-line" style="font-size: 1.5rem; color: var(--color-purple-500);"></i>
                        <input 
                            type="text" 
                            id="globalSearchInput" 
                            placeholder="Search lessons, exercises, topics..." 
                            style="flex: 1; background: transparent; border: none; outline: none; font-size: 1.125rem; color: var(--text-primary); font-weight: 500;"
                            autocomplete="off"
                        />
                        <button id="closeSearch" style="padding: 0.5rem; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; border-radius: var(--radius-sm); transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                            <i class="ri-close-line" style="font-size: 1.5rem;"></i>
                        </button>
                    </div>
                    <div style="margin-top: var(--space-md); display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="filter-btn" data-filter="all" style="padding: 0.375rem 0.75rem; background: var(--color-purple-500); border: none; border-radius: 50px; color: white; font-size: 0.875rem; font-weight: 600; cursor: pointer;">All</button>
                        <button class="filter-btn" data-filter="lesson" style="padding: 0.375rem 0.75rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50px; color: var(--text-primary); font-size: 0.875rem; font-weight: 600; cursor: pointer;">Lessons</button>
                        <button class="filter-btn" data-filter="exercise" style="padding: 0.375rem 0.75rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50px; color: var(--text-primary); font-size: 0.875rem; font-weight: 600; cursor: pointer;">Exercises</button>
                        <button class="filter-btn" data-filter="beginner" style="padding: 0.375rem 0.75rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50px; color: var(--text-primary); font-size: 0.875rem; font-weight: 600; cursor: pointer;">Beginner</button>
                        <button class="filter-btn" data-filter="intermediate" style="padding: 0.375rem 0.75rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50px; color: var(--text-primary); font-size: 0.875rem; font-weight: 600; cursor: pointer;">Intermediate</button>
                        <button class="filter-btn" data-filter="advanced" style="padding: 0.375rem 0.75rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50px; color: var(--text-primary); font-size: 0.875rem; font-weight: 600; cursor: pointer;">Advanced</button>
                    </div>
                </div>
                <div id="searchResults" style="max-height: 60vh; overflow-y: auto; padding: var(--space-lg);"></div>
                <div style="padding: var(--space-md) var(--space-lg); border-top: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between; font-size: 0.8125rem; color: var(--text-tertiary);">
                    <div>
                        <kbd style="padding: 0.25rem 0.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-sm);">Ctrl</kbd>
                        +
                        <kbd style="padding: 0.25rem 0.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-sm);">K</kbd>
                        to open
                    </div>
                    <div>
                        <kbd style="padding: 0.25rem 0.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-sm);">ESC</kbd>
                        to close
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add slide down animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

        // Setup event listeners
        document.getElementById('globalSearchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('closeSearch').addEventListener('click', () => this.closeSearch());
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'globalSearchModal') this.closeSearch();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.style.background = 'var(--glass-bg)';
                    b.style.color = 'var(--text-primary)';
                    b.style.border = '1px solid var(--glass-border)';
                });
                btn.style.background = 'var(--color-purple-500)';
                btn.style.color = 'white';
                btn.style.border = 'none';
                
                this.currentFilter = btn.dataset.filter;
                const query = document.getElementById('globalSearchInput').value;
                this.handleSearch(query);
            });
        });

        this.currentFilter = 'all';
    }

    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K or Cmd+K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            // ESC to close search
            if (e.key === 'Escape' && document.getElementById('globalSearchModal').style.display === 'flex') {
                this.closeSearch();
            }
        });
    }

    openSearch() {
        const modal = document.getElementById('globalSearchModal');
        modal.style.display = 'flex';
        setTimeout(() => {
            document.getElementById('globalSearchInput').focus();
        }, 100);
        
        // Show all results initially
        this.handleSearch('');
    }

    closeSearch() {
        document.getElementById('globalSearchModal').style.display = 'none';
        document.getElementById('globalSearchInput').value = '';
    }

    handleSearch(query) {
        const resultsContainer = document.getElementById('searchResults');
        const lowerQuery = query.toLowerCase().trim();
        
        let results = this.searchData;

        // Apply filter
        if (this.currentFilter !== 'all') {
            results = results.filter(item => {
                return item.type === this.currentFilter || item.level === this.currentFilter;
            });
        }

        // Apply search query
        if (lowerQuery) {
            results = results.filter(item => {
                return item.title.toLowerCase().includes(lowerQuery) ||
                       item.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
                       item.id.toLowerCase().includes(lowerQuery);
            });
        }

        // Display results
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: var(--space-2xl); color: var(--text-secondary);">
                    <i class="ri-search-line" style="font-size: 3rem; opacity: 0.5; margin-bottom: var(--space-md);"></i>
                    <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">No results found</div>
                    <div style="font-size: 0.875rem;">Try a different search term or filter</div>
                </div>
            `;
            return;
        }

        let html = `<div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: var(--space-md);">${results.length} result${results.length !== 1 ? 's' : ''}</div>`;
        
        results.forEach(result => {
            const icon = result.icon || 'ri-book-open-line';
            const levelColor = result.level === 'beginner' ? 'var(--color-success)' : result.level === 'intermediate' ? 'var(--color-blue-500)' : 'var(--color-purple-500)';
            
            html += `
                <a href="${result.file}" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); margin-bottom: 0.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); text-decoration: none; transition: all 0.2s;" onmouseover="this.style.transform='translateX(8px)'; this.style.borderColor='var(--color-purple-500)'; this.style.background='rgba(147, 51, 234, 0.1)'" onmouseout="this.style.transform='translateX(0)'; this.style.borderColor='var(--glass-border)'; this.style.background='var(--glass-bg)'">
                    <div style="width: 56px; height: 56px; background: linear-gradient(135deg, ${levelColor}22, ${levelColor}11); border: 2px solid ${levelColor}44; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background: radial-gradient(circle at 30% 30%, ${levelColor}33, transparent); opacity: 0.5;"></div>
                        <i class="${icon}" style="font-size: 1.75rem; color: ${levelColor}; position: relative; z-index: 1;"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">${result.title}</div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem;">
                            <span style="padding: 0.125rem 0.5rem; background: ${levelColor}33; border: 1px solid ${levelColor}; border-radius: 50px; color: ${levelColor}; font-weight: 600; text-transform: capitalize;">${result.level}</span>
                            <span style="color: var(--text-secondary); text-transform: capitalize;">${result.type}</span>
                        </div>
                    </div>
                    <i class="ri-arrow-right-line" style="color: var(--text-tertiary); font-size: 1.25rem; flex-shrink: 0;"></i>
                </a>
            `;
        });

        resultsContainer.innerHTML = html;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GlobalSearch();
    });
} else {
    new GlobalSearch();
}

