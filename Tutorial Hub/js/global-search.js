/**
 * Global Search Functionality
 * Search across all lessons and exercises
 */

class GlobalSearch {
    constructor() {
        console.log('GlobalSearch initializing...');
        this.searchData = this.buildSearchIndex();
        console.log('Search index built with', this.searchData.length, 'items');
        this.init();
        console.log('GlobalSearch initialized successfully');
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
        if (!navbarActions) {
            console.error('navbar-actions not found');
            return;
        }

        console.log('Creating search button...');

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

        searchBtn.addEventListener('click', () => {
            console.log('Search button clicked');
            this.openSearch();
        });

        // Insert as the first button in navbar actions
        const firstBtn = navbarActions.firstElementChild;
        if (firstBtn) {
            navbarActions.insertBefore(searchBtn, firstBtn);
        } else {
            navbarActions.appendChild(searchBtn);
        }
        
        console.log('Search button created and added to navbar');
    }

    createSearchModal() {
        console.log('Creating search modal...');
        
        const modal = document.createElement('div');
        modal.id = 'globalSearchModal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.85) !important;
            backdrop-filter: blur(10px) !important;
            z-index: 999999 !important;
            display: none;
            align-items: flex-start !important;
            justify-content: center !important;
            padding: 10vh 1rem 1rem !important;
            overflow-y: auto !important;
            isolation: isolate !important;
        `;

        modal.innerHTML = `
            <div id="searchContainer" style="position: relative; width: 100%; max-width: 700px; background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 16px; backdrop-filter: blur(20px); box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5); animation: slideDown 0.3s; overflow: hidden; display: block; isolation: isolate;">
                <div style="padding: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <i class="ri-search-line" style="font-size: 1.5rem; color: rgb(147, 51, 234);"></i>
                        <input 
                            type="text" 
                            id="globalSearchInput" 
                            placeholder="Search lessons, exercises, topics..." 
                            style="flex: 1; background: transparent; border: none; outline: none; font-size: 1.125rem; color: rgba(255, 255, 255, 0.95); font-weight: 500; font-family: 'Inter', sans-serif;"
                            autocomplete="off"
                        />
                        <button id="closeSearch" style="padding: 0.5rem; background: transparent; border: none; color: rgba(255, 255, 255, 0.7); cursor: pointer; border-radius: 8px; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                            <i class="ri-close-line" style="font-size: 1.5rem;"></i>
                        </button>
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="filter-btn" data-filter="all" style="padding: 0.375rem 0.75rem; background: rgb(147, 51, 234); border: none; border-radius: 50px; color: white; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">All</button>
                        <button class="filter-btn" data-filter="lesson" style="padding: 0.375rem 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50px; color: rgba(255, 255, 255, 0.95); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">Lessons</button>
                        <button class="filter-btn" data-filter="exercise" style="padding: 0.375rem 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50px; color: rgba(255, 255, 255, 0.95); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">Exercises</button>
                        <button class="filter-btn" data-filter="beginner" style="padding: 0.375rem 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50px; color: rgba(255, 255, 255, 0.95); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">Beginner</button>
                        <button class="filter-btn" data-filter="intermediate" style="padding: 0.375rem 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50px; color: rgba(255, 255, 255, 0.95); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">Intermediate</button>
                        <button class="filter-btn" data-filter="advanced" style="padding: 0.375rem 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50px; color: rgba(255, 255, 255, 0.95); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">Advanced</button>
                    </div>
                </div>
                <div id="searchResults" style="position: relative; max-height: 60vh; overflow-y: auto; padding: 1.5rem; min-height: 200px; background: rgba(0, 0, 0, 0.2); display: block; width: 100%; box-sizing: border-box;"></div>
                <div style="padding: 1rem 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: space-between; font-size: 0.8125rem; color: rgba(255, 255, 255, 0.5);">
                    <div>
                        <kbd style="padding: 0.25rem 0.5rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; font-family: monospace;">Ctrl</kbd>
                        +
                        <kbd style="padding: 0.25rem 0.5rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; font-family: monospace;">K</kbd>
                        to open
                    </div>
                    <div>
                        <kbd style="padding: 0.25rem 0.5rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; font-family: monospace;">ESC</kbd>
                        to close
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        console.log('Search modal added to DOM');

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

        // Verify modal structure
        console.log('Modal children:', modal.children.length);
        console.log('SearchContainer exists:', document.getElementById('searchContainer') !== null);
        console.log('SearchResults exists:', document.getElementById('searchResults') !== null);
        
        // Setup event listeners - use querySelector from modal to avoid conflicts
        const searchInput = modal.querySelector('#globalSearchInput');
        const closeBtn = modal.querySelector('#closeSearch');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSearch());
        }
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'globalSearchModal') this.closeSearch();
        });

        // Filter buttons - use querySelector from modal
        modal.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Filter clicked:', btn.dataset.filter);
                modal.querySelectorAll('.filter-btn').forEach(b => {
                    b.style.background = 'rgba(255, 255, 255, 0.05)';
                    b.style.color = 'rgba(255, 255, 255, 0.95)';
                    b.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                });
                btn.style.background = 'rgb(147, 51, 234)';
                btn.style.color = 'white';
                btn.style.border = 'none';
                
                this.currentFilter = btn.dataset.filter;
                const query = modal.querySelector('#globalSearchInput')?.value || '';
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
        if (!modal) {
            console.error('Search modal not found');
            return;
        }
        console.log('Modal element:', modal);
        console.log('Setting modal display to flex...');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        console.log('Modal display set to:', modal.style.display);
        
        setTimeout(() => {
            const input = document.getElementById('globalSearchInput');
            if (input) {
                input.focus();
                console.log('Input focused');
            } else {
                console.error('Search input not found');
            }
        }, 100);
        
        // Show all results initially
        console.log('Opening search, showing all results...');
        this.handleSearch('');
    }

    closeSearch() {
        const modal = document.getElementById('globalSearchModal');
        if (modal) {
            modal.style.display = 'none';
        }
        const input = document.getElementById('globalSearchInput');
        if (input) {
            input.value = '';
        }
    }

    handleSearch(query) {
        // Check for duplicate elements
        const allSearchResults = document.querySelectorAll('#searchResults');
        console.log('Number of #searchResults elements found:', allSearchResults.length);
        if (allSearchResults.length > 1) {
            console.warn('DUPLICATE #searchResults FOUND!', allSearchResults);
        }
        
        // Get the one inside the modal specifically
        const modal = document.getElementById('globalSearchModal');
        const resultsContainer = modal ? modal.querySelector('#searchResults') : null;
        
        if (!resultsContainer) {
            console.error('Results container not found inside modal');
            return;
        }
        
        console.log('Results container parent:', resultsContainer.parentElement);
        console.log('Results container parent ID:', resultsContainer.parentElement?.id);
        console.log('Is inside searchContainer?', resultsContainer.closest('#searchContainer') !== null);
        console.log('Is inside modal?', resultsContainer.closest('#globalSearchModal') !== null);
        
        const lowerQuery = query.toLowerCase().trim();
        console.log('Searching for:', query, 'Filter:', this.currentFilter);
        
        let results = this.searchData;
        console.log('Total items in search index:', results.length);

        // Apply filter
        if (this.currentFilter !== 'all') {
            results = results.filter(item => {
                return item.type === this.currentFilter || item.level === this.currentFilter;
            });
            console.log('After filter:', results.length);
        }

        // Apply search query
        if (lowerQuery) {
            results = results.filter(item => {
                return item.title.toLowerCase().includes(lowerQuery) ||
                       item.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
                       item.id.toLowerCase().includes(lowerQuery);
            });
            console.log('After search query:', results.length);
        }

        // Display results
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.7);">
                    <i class="ri-search-line" style="font-size: 3rem; opacity: 0.5; margin-bottom: 1rem; display: block;"></i>
                    <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: rgba(255, 255, 255, 0.95);">No results found</div>
                    <div style="font-size: 0.875rem;">Try a different search term or filter</div>
                </div>
            `;
            return;
        }

        let html = `<div style="font-size: 0.875rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 1rem;">${results.length} result${results.length !== 1 ? 's' : ''}</div>`;
        
        results.forEach(result => {
            const icon = result.icon || 'ri-book-open-line';
            const levelColorMap = {
                'beginner': 'rgb(16, 185, 129)',
                'intermediate': 'rgb(59, 130, 246)',
                'advanced': 'rgb(147, 51, 234)'
            };
            const levelColor = levelColorMap[result.level];
            
            const levelBg = result.level === 'beginner' ? 'rgba(16, 185, 129, 0.15)' : result.level === 'intermediate' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(147, 51, 234, 0.15)';
            
            html += `
                <a href="${result.file}" style="display: flex !important; align-items: center; gap: 1rem; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; text-decoration: none; transition: all 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateX(8px)'; this.style.borderColor='rgb(147, 51, 234)'; this.style.background='rgba(147, 51, 234, 0.15)'" onmouseout="this.style.transform='translateX(0)'; this.style.borderColor='rgba(255, 255, 255, 0.15)'; this.style.background='rgba(255, 255, 255, 0.05)'">
                    <div style="width: 56px; height: 56px; background: ${levelBg}; border: 2px solid ${levelColor}; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="${icon}" style="font-size: 1.75rem; color: ${levelColor};"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 1rem; font-weight: 600; color: rgba(255, 255, 255, 0.95); margin-bottom: 0.25rem; font-family: 'Inter', sans-serif;">${result.title}</div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem;">
                            <span style="padding: 0.25rem 0.625rem; background: ${levelBg}; border: 1px solid ${levelColor}; border-radius: 50px; color: ${levelColor}; font-weight: 600; text-transform: capitalize;">${result.level}</span>
                            <span style="color: rgba(255, 255, 255, 0.7); text-transform: capitalize;">${result.type}</span>
                        </div>
                    </div>
                    <i class="ri-arrow-right-line" style="color: rgba(255, 255, 255, 0.5); font-size: 1.25rem; flex-shrink: 0;"></i>
                </a>
            `;
        });

        console.log('Rendering', results.length, 'results to container');
        console.log('HTML to render (first 500 chars):', html.substring(0, 500));
        console.log('Results container element:', resultsContainer);
        console.log('Results container display:', window.getComputedStyle(resultsContainer).display);
        console.log('Results container visibility:', window.getComputedStyle(resultsContainer).visibility);
        
        resultsContainer.innerHTML = html;
        
        console.log('Results rendered successfully');
        console.log('Container innerHTML length:', resultsContainer.innerHTML.length);
        console.log('Container children count:', resultsContainer.children.length);
        console.log('First child:', resultsContainer.firstElementChild);
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

