/**
 * Enhanced Search Functionality for Tutorial Hub
 * Features: Advanced filtering, keyboard navigation, fuzzy search
 */

class TutorialSearch {
    constructor() {
        this.lessons = this.getLessonsData();
        this.selectedIndex = -1;
        this.currentFilter = 'all';
        this.init();
    }

    getLessonsData() {
        return [
            // Lessons
            { id: '01', title: 'Introduction to Pseudocode', level: 'beginner', file: '01-introduction-to-pseudocode.html', icon: 'ri-book-open-line', type: 'lesson', duration: '10 min', keywords: ['pseudocode', 'introduction', 'basics', 'what is', 'why use', 'fundamentals'] },
            { id: '02', title: 'Getting Started with iPseudo', level: 'beginner', file: '02-getting-started.html', icon: 'ri-rocket-line', type: 'lesson', duration: '15 min', keywords: ['getting started', 'first program', 'hello world', 'setup', 'interface', 'ide'] },
            { id: '03', title: 'Variables and Data Types', level: 'beginner', file: '03-variables-and-data-types.html', icon: 'ri-database-2-line', type: 'lesson', duration: '20 min', keywords: ['variables', 'data types', 'integer', 'string', 'boolean', 'declaration', 'real'] },
            { id: '04', title: 'Input and Output', level: 'beginner', file: '04-input-and-output.html', icon: 'ri-input-method-line', type: 'lesson', duration: '15 min', keywords: ['input', 'output', 'print', 'read', 'display', 'user input', 'io'] },
            { id: '05', title: 'Operators', level: 'beginner', file: '05-operators.html', icon: 'ri-calculator-line', type: 'lesson', duration: '20 min', keywords: ['operators', 'arithmetic', 'comparison', 'logical', 'math', 'modulo'] },
            { id: '06', title: 'Comments and Documentation', level: 'beginner', file: '06-comments-and-documentation.html', icon: 'ri-chat-3-line', type: 'lesson', duration: '10 min', keywords: ['comments', 'documentation', 'code comments', 'best practices', 'notes'] },
            { id: '07', title: 'Conditional Statements', level: 'intermediate', file: '07-conditional-statements.html', icon: 'ri-git-branch-line', type: 'lesson', duration: '25 min', keywords: ['if', 'else', 'conditional', 'decision', 'branching', 'switch', 'elseif'] },
            { id: '08', title: 'Loops', level: 'intermediate', file: '08-loops.html', icon: 'ri-loop-right-line', type: 'lesson', duration: '30 min', keywords: ['loops', 'for', 'while', 'repeat', 'iteration', 'do'] },
            { id: '09', title: 'Nested Loops', level: 'intermediate', file: '09-nested-loops.html', icon: 'ri-grid-line', type: 'lesson', duration: '20 min', keywords: ['nested loops', 'nested', 'complex loops', 'matrix', 'pattern'] },
            { id: '10', title: 'Functions', level: 'intermediate', file: '10-functions.html', icon: 'ri-function-line', type: 'lesson', duration: '25 min', keywords: ['functions', 'return', 'parameters', 'arguments', 'reusable code', 'modular'] },
            { id: '11', title: 'Procedures', level: 'intermediate', file: '11-procedures.html', icon: 'ri-code-s-slash-line', type: 'lesson', duration: '20 min', keywords: ['procedures', 'subroutines', 'methods', 'void', 'call'] },
            { id: '12', title: 'Arrays', level: 'intermediate', file: '12-arrays.html', icon: 'ri-list-check', type: 'lesson', duration: '30 min', keywords: ['arrays', 'list', 'collection', 'indexing', 'elements', 'index'] },
            { id: '13', title: 'String Operations', level: 'intermediate', file: '13-string-operations.html', icon: 'ri-text', type: 'lesson', duration: '25 min', keywords: ['strings', 'text', 'concatenation', 'substring', 'manipulation', 'length'] },
            { id: '14', title: 'Multidimensional Arrays', level: 'advanced', file: '14-multidimensional-arrays.html', icon: 'ri-layout-grid-line', type: 'lesson', duration: '30 min', keywords: ['2d arrays', 'matrix', 'multidimensional', 'grid', 'table'] },
            { id: '15', title: 'Recursion', level: 'advanced', file: '15-recursion.html', icon: 'ri-refresh-line', type: 'lesson', duration: '35 min', keywords: ['recursion', 'recursive', 'factorial', 'fibonacci', 'base case'] },
            { id: '16', title: 'Sorting Algorithms', level: 'advanced', file: '16-sorting-algorithms.html', icon: 'ri-sort-asc', type: 'lesson', duration: '40 min', keywords: ['sorting', 'bubble sort', 'quick sort', 'merge sort', 'algorithms', 'selection'] },
            { id: '17', title: 'Searching Algorithms', level: 'advanced', file: '17-searching-algorithms.html', icon: 'ri-search-line', type: 'lesson', duration: '30 min', keywords: ['searching', 'linear search', 'binary search', 'find', 'algorithm'] },
            { id: '18', title: 'Data Structures', level: 'advanced', file: '18-data-structures.html', icon: 'ri-stack-line', type: 'lesson', duration: '45 min', keywords: ['data structures', 'stack', 'queue', 'linked list', 'tree', 'heap'] },
            { id: '19', title: 'Algorithm Design Patterns', level: 'advanced', file: '19-algorithm-design-patterns.html', icon: 'ri-puzzle-line', type: 'lesson', duration: '35 min', keywords: ['algorithm design', 'patterns', 'strategies', 'optimization', 'divide', 'conquer'] },
            { id: '20', title: 'Best Practices', level: 'advanced', file: '20-best-practices.html', icon: 'ri-medal-line', type: 'lesson', duration: '30 min', keywords: ['best practices', 'tips', 'coding standards', 'clean code', 'efficiency'] },
            
            // Exercises
            { id: 'EX-01', title: 'Variables Practice Exercises', level: 'beginner', file: 'Exercises/exercises-variables.html', icon: 'ri-edit-box-line', type: 'exercise', duration: '20 min', keywords: ['variables', 'practice', 'exercises', 'problems', 'hands-on', 'declaration'] },
            { id: 'EX-02', title: 'Operators Practice Exercises', level: 'beginner', file: 'Exercises/exercises-operators.html', icon: 'ri-calculator-fill', type: 'exercise', duration: '25 min', keywords: ['operators', 'practice', 'exercises', 'arithmetic', 'logical', 'comparison'] },
            { id: 'EX-03', title: 'Conditional Statements Exercises', level: 'intermediate', file: 'Exercises/exercises-conditionals.html', icon: 'ri-git-branch-fill', type: 'exercise', duration: '30 min', keywords: ['conditionals', 'if', 'else', 'practice', 'exercises', 'decision'] },
            { id: 'EX-04', title: 'Loops Practice Exercises', level: 'intermediate', file: 'Exercises/exercises-loops.html', icon: 'ri-loop-right-fill', type: 'exercise', duration: '35 min', keywords: ['loops', 'for', 'while', 'practice', 'exercises', 'iteration'] },
            { id: 'EX-05', title: 'Functions Practice Exercises', level: 'intermediate', file: 'Exercises/exercises-functions.html', icon: 'ri-function-fill', type: 'exercise', duration: '30 min', keywords: ['functions', 'return', 'practice', 'exercises', 'parameters'] },
            { id: 'EX-06', title: 'Arrays Practice Exercises', level: 'intermediate', file: 'Exercises/exercises-arrays.html', icon: 'ri-list-check-2', type: 'exercise', duration: '40 min', keywords: ['arrays', 'list', 'practice', 'exercises', 'collection'] },
            
            // Quizzes (only existing quizzes)
            { id: 'Q-01', title: 'Introduction to Pseudocode Quiz', level: 'beginner', file: 'quizzes/quiz.html?lesson=1', icon: 'ri-questionnaire-line', type: 'quiz', duration: '5 min', keywords: ['quiz', 'test', 'assessment', 'introduction', 'basics', 'pseudocode'] },
            { id: 'Q-02', title: 'Getting Started Quiz', level: 'beginner', file: 'quizzes/quiz.html?lesson=2', icon: 'ri-questionnaire-line', type: 'quiz', duration: '5 min', keywords: ['quiz', 'test', 'getting started', 'ipseudo', 'basics', 'assessment'] },
            { id: 'Q-03', title: 'Variables and Data Types Quiz', level: 'beginner', file: 'quizzes/quiz.html?lesson=3', icon: 'ri-questionnaire-line', type: 'quiz', duration: '7 min', keywords: ['quiz', 'test', 'variables', 'data types', 'assessment'] },
            { id: 'Q-04', title: 'Operators Quiz', level: 'beginner', file: 'quizzes/quiz.html?lesson=5', icon: 'ri-questionnaire-line', type: 'quiz', duration: '7 min', keywords: ['quiz', 'test', 'operators', 'arithmetic', 'assessment'] },
            { id: 'Q-05', title: 'Conditional Statements Quiz', level: 'intermediate', file: 'quizzes/quiz.html?lesson=7', icon: 'ri-questionnaire-line', type: 'quiz', duration: '8 min', keywords: ['quiz', 'test', 'conditionals', 'if', 'else', 'assessment'] },
            { id: 'Q-06', title: 'Loops Quiz', level: 'intermediate', file: 'quizzes/quiz.html?lesson=8', icon: 'ri-questionnaire-line', type: 'quiz', duration: '10 min', keywords: ['quiz', 'test', 'loops', 'for', 'while', 'assessment'] },
            { id: 'Q-07', title: 'Functions Quiz', level: 'intermediate', file: 'quizzes/quiz.html?lesson=10', icon: 'ri-questionnaire-line', type: 'quiz', duration: '8 min', keywords: ['quiz', 'test', 'functions', 'return', 'assessment'] },
            { id: 'Q-08', title: 'Arrays Quiz', level: 'intermediate', file: 'quizzes/quiz.html?lesson=12', icon: 'ri-questionnaire-line', type: 'quiz', duration: '10 min', keywords: ['quiz', 'test', 'arrays', 'list', 'assessment'] },
            { id: 'Q-09', title: 'Recursion Quiz', level: 'advanced', file: 'quizzes/quiz.html?lesson=15', icon: 'ri-questionnaire-line', type: 'quiz', duration: '12 min', keywords: ['quiz', 'test', 'recursion', 'recursive', 'assessment'] },
            { id: 'Q-10', title: 'Sorting Algorithms Quiz', level: 'advanced', file: 'quizzes/quiz.html?lesson=16', icon: 'ri-questionnaire-line', type: 'quiz', duration: '12 min', keywords: ['quiz', 'test', 'algorithms', 'sorting', 'searching', 'assessment'] }
        ];
    }


    init() {
        this.createSearchBar();
        this.injectStyles();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-search-container {
                max-width: 700px;
                margin: 2rem auto;
                animation: fadeInUp 0.6s ease-out;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .search-input-wrapper {
                position: relative;
                margin-bottom: 0.75rem;
            }

            .search-input-enhanced {
                width: 100%;
                padding: 1.125rem 3.5rem 1.125rem 3.5rem;
                background: var(--glass-bg);
                border: 2px solid var(--glass-border);
                border-radius: 16px;
                color: var(--text-primary);
                font-size: 1.0625rem;
                font-weight: 500;
                backdrop-filter: blur(10px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
            }

            .search-input-enhanced:focus {
                outline: none;
                border-color: var(--color-purple-500);
                box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
            }

            .search-input-enhanced::placeholder {
                color: var(--text-tertiary);
                font-weight: 400;
            }

            .search-icon-left {
                position: absolute;
                left: 1.25rem;
                top: 50%;
                transform: translateY(-50%);
                font-size: 1.5rem;
                color: var(--color-purple-500);
                pointer-events: none;
                transition: all 0.3s;
            }

            .search-input-enhanced:focus ~ .search-icon-left {
                transform: translateY(-50%) scale(1.1);
            }

            .search-clear-btn {
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(147, 51, 234, 0.1);
                border: none;
                color: var(--color-purple-500);
                cursor: pointer;
                font-size: 1.25rem;
                padding: 0.5rem;
                border-radius: 8px;
                display: none;
                transition: all 0.2s;
            }

            .search-clear-btn:hover {
                background: rgba(147, 51, 234, 0.2);
                transform: translateY(-50%) scale(1.1);
            }

            .search-filter-bar {
                display: flex;
                gap: 0.375rem;
                flex-wrap: nowrap;
                margin-bottom: 1rem;
                padding: 0 0.25rem;
                justify-content: center;
            }

            .filter-chip {
                padding: 0.5rem 0.875rem;
                background: var(--glass-bg);
                border: 2px solid transparent;
                border-radius: 50px;
                color: var(--text-secondary);
                font-size: 0.8125rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                white-space: nowrap;
                flex: 0 1 auto;
                min-width: fit-content;
                display: inline-flex;
                align-items: center;
                gap: 0.25rem;
            }

            .filter-chip i {
                font-size: 0.875rem;
            }

            .filter-chip:hover {
                background: rgba(147, 51, 234, 0.1);
                color: var(--color-purple-500);
                border-color: rgba(147, 51, 234, 0.3);
                transform: translateY(-2px);
            }

            .filter-chip.active {
                background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500));
                color: white;
                border-color: transparent;
                box-shadow: 0 4px 16px rgba(147, 51, 234, 0.4);
            }

            .search-suggestions {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 16px;
                padding: 1.5rem;
                backdrop-filter: blur(10px);
                margin-bottom: 1rem;
                animation: slideDown 0.3s ease-out;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .suggestions-title {
                font-size: 0.8125rem;
                font-weight: 700;
                color: var(--text-tertiary);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 0.75rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .suggestion-chips {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }

            .suggestion-chip {
                padding: 0.5rem 1rem;
                background: rgba(147, 51, 234, 0.08);
                border: 1px solid rgba(147, 51, 234, 0.2);
                border-radius: 50px;
                color: var(--text-primary);
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 0.375rem;
            }

            .suggestion-chip:hover {
                background: rgba(147, 51, 234, 0.15);
                border-color: var(--color-purple-500);
                transform: translateY(-2px);
            }

            .search-results-enhanced {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 16px;
                padding: 1.5rem;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                animation: slideDown 0.3s ease-out;
            }

            .results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid var(--glass-border);
            }

            .results-count {
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-tertiary);
            }

            .result-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                text-decoration: none;
                border-radius: 12px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                margin-bottom: 0.75rem;
                border: 2px solid transparent;
            }

            .result-item:hover,
            .result-item.selected {
                background: rgba(147, 51, 234, 0.1);
                border-color: rgba(147, 51, 234, 0.3);
                transform: translateX(8px);
            }

            .result-icon-box {
                flex-shrink: 0;
                width: 56px;
                height: 56px;
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.75rem;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                transition: all 0.3s;
            }

            .result-item:hover .result-icon-box {
                transform: scale(1.1) rotate(5deg);
            }

            .result-content {
                flex: 1;
                min-width: 0;
            }

            .result-title {
                font-size: 1rem;
                font-weight: 700;
                color: var(--text-primary);
                margin-bottom: 0.375rem;
                line-height: 1.4;
            }

            .result-meta {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex-wrap: wrap;
                font-size: 0.8125rem;
            }

            .result-badge {
                padding: 0.25rem 0.625rem;
                border-radius: 50px;
                font-weight: 700;
                text-transform: capitalize;
                border: 1px solid;
            }

            .result-arrow {
                flex-shrink: 0;
                font-size: 1.5rem;
                color: var(--text-tertiary);
                transition: all 0.3s;
            }

            .result-item:hover .result-arrow {
                color: var(--color-purple-500);
                transform: translateX(4px);
            }

            .no-results {
                text-align: center;
                padding: 3rem 1.5rem;
            }

            .no-results-icon {
                font-size: 3.5rem;
                color: var(--text-tertiary);
                opacity: 0.5;
                margin-bottom: 1rem;
            }

            .no-results-title {
                font-size: 1.125rem;
                font-weight: 700;
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }

            .no-results-text {
                font-size: 0.9375rem;
                color: var(--text-secondary);
            }

            .search-highlight {
                background: linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3));
                padding: 0 0.25rem;
                border-radius: 4px;
                font-weight: 700;
            }

            @media (max-width: 768px) {
                .search-filter-bar {
                    gap: 0.25rem;
                }

                .filter-chip {
                    padding: 0.425rem 0.75rem;
                    font-size: 0.75rem;
                    gap: 0.2rem;
                }

                .filter-chip i {
                    font-size: 0.8125rem;
                }
            }

            @media (max-width: 640px) {
                .search-input-enhanced {
                    padding: 1rem 3rem 1rem 3rem;
                    font-size: 1rem;
                }

                .search-filter-bar {
                    gap: 0.2rem;
                }

                .filter-chip {
                    padding: 0.375rem 0.625rem;
                    font-size: 0.6875rem;
                }

                .filter-chip i {
                    display: none;
                }

                .result-icon-box {
                    width: 48px;
                    height: 48px;
                    font-size: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createSearchBar() {
        const container = document.querySelector('.tutorial-hero-content') || document.querySelector('.container');
        if (!container) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'enhanced-search-container';
        searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <input 
                    type="text" 
                    id="lessonSearch" 
                    class="search-input-enhanced"
                    placeholder="Search lessons, exercises, quizzes, topics..." 
                    autocomplete="off"
                    spellcheck="false"
                />
                <i class="ri-search-line search-icon-left"></i>
                <button id="clearSearch" class="search-clear-btn" title="Clear search">
                    <i class="ri-close-line"></i>
                </button>
            </div>
            
            <div class="search-filter-bar">
                <button class="filter-chip active" data-filter="all">
                    <i class="ri-apps-line"></i> All
                </button>
                <button class="filter-chip" data-filter="lesson">
                    <i class="ri-book-open-line"></i> Lessons
                </button>
                <button class="filter-chip" data-filter="exercise">
                    <i class="ri-edit-box-line"></i> Exercises
                </button>
                <button class="filter-chip" data-filter="quiz">
                    <i class="ri-questionnaire-line"></i> Quizzes
                </button>
                <button class="filter-chip" data-filter="beginner">
                    <i class="ri-seedling-line"></i> Beginner
                </button>
                <button class="filter-chip" data-filter="intermediate">
                    <i class="ri-plant-line"></i> Intermediate
                </button>
                <button class="filter-chip" data-filter="advanced">
                    <i class="ri-rocket-2-line"></i> Advanced
                </button>
            </div>

            <div id="searchSuggestions"></div>
            <div id="searchResults"></div>
        `;

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
        const suggestionsDiv = document.getElementById('searchSuggestions');

        if (!searchInput) return;

        // Search input handler
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(debounceTimer);
            
            if (query.length === 0) {
                resultsDiv.innerHTML = '';
                clearBtn.style.display = 'none';
                this.selectedIndex = -1;
                return;
            }

            clearBtn.style.display = 'block';
            
            debounceTimer = setTimeout(() => {
                this.performSearch(query);
            }, 150);
        });

        // Clear button
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            resultsDiv.innerHTML = '';
            clearBtn.style.display = 'none';
            this.selectedIndex = -1;
            searchInput.focus();
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const results = resultsDiv.querySelectorAll('.result-item');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, results.length - 1);
                this.updateSelectedResult(results);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelectedResult(results);
            } else if (e.key === 'Enter' && this.selectedIndex >= 0) {
                e.preventDefault();
                results[this.selectedIndex]?.click();
            }
        });

        // Filter chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.currentFilter = chip.dataset.filter;
                
                const query = searchInput.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            });
        });
    }

    updateSelectedResult(results) {
        results.forEach((result, index) => {
            if (index === this.selectedIndex) {
                result.classList.add('selected');
                result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                result.classList.remove('selected');
            }
        });
    }

    performSearch(query) {
        const resultsDiv = document.getElementById('searchResults');
        if (!resultsDiv) return;

        this.selectedIndex = -1;
        const lowerQuery = query.toLowerCase();

        // Filter by level or content type
        let filteredLessons = this.lessons;
        if (this.currentFilter !== 'all') {
            filteredLessons = this.lessons.filter(l => {
                // Check if filter is a content type or a level
                return l.level === this.currentFilter || l.type === this.currentFilter;
            });
        }

        // Search with fuzzy matching
        const results = filteredLessons.filter(lesson => {
            const searchText = `${lesson.title} ${lesson.level} ${lesson.type} ${lesson.keywords.join(' ')}`.toLowerCase();
            return searchText.includes(lowerQuery);
        }).sort((a, b) => {
            // Sort by relevance - exact title matches first
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();
            const aExact = aTitle.includes(lowerQuery);
            const bExact = bTitle.includes(lowerQuery);
            
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return 0;
        });

        // Display results
        if (results.length === 0) {
            resultsDiv.innerHTML = `
                <div class="search-results-enhanced">
                    <div class="no-results">
                        <div class="no-results-icon">
                            <i class="ri-search-line"></i>
                        </div>
                        <div class="no-results-title">No results found</div>
                        <div class="no-results-text">Try searching for "${query}" with different keywords or filters</div>
                    </div>
                </div>
            `;
            return;
        }

        const levelConfig = {
            'beginner': {
                color: 'rgb(16, 185, 129)',
                bg: 'rgba(16, 185, 129, 0.15)',
                gradient: 'linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))'
            },
            'intermediate': {
                color: 'rgb(59, 130, 246)',
                bg: 'rgba(59, 130, 246, 0.15)',
                gradient: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))'
            },
            'advanced': {
                color: 'rgb(147, 51, 234)',
                bg: 'rgba(147, 51, 234, 0.15)',
                gradient: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(126, 34, 206))'
            }
        };

        const typeConfig = {
            'lesson': {
                color: 'rgb(59, 130, 246)',
                bg: 'rgba(59, 130, 246, 0.1)',
                icon: 'ri-book-open-line',
                label: 'Lesson'
            },
            'exercise': {
                color: 'rgb(234, 88, 12)',
                bg: 'rgba(234, 88, 12, 0.1)',
                icon: 'ri-edit-box-line',
                label: 'Exercise'
            },
            'quiz': {
                color: 'rgb(251, 191, 36)',
                bg: 'rgba(251, 191, 36, 0.1)',
                icon: 'ri-questionnaire-line',
                label: 'Quiz'
            }
        };

        const contentTypeLabel = this.currentFilter === 'lesson' ? 'lessons' : 
                                 this.currentFilter === 'exercise' ? 'exercises' : 
                                 this.currentFilter === 'quiz' ? 'quizzes' : 'results';

        let html = `
            <div class="search-results-enhanced">
                <div class="results-header">
                    <div class="results-count">
                        <i class="ri-checkbox-circle-line" style="color: var(--color-success);"></i>
                        Found ${results.length} ${results.length === 1 ? contentTypeLabel.slice(0, -1) : contentTypeLabel}
                    </div>
                </div>
        `;

        results.forEach(item => {
            const config = levelConfig[item.level];
            const typeInfo = typeConfig[item.type];
            
            html += `
                <a href="${item.file}" class="result-item">
                    <div class="result-icon-box" style="background: ${config.gradient}; border: 2px solid ${config.color};">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="result-content">
                        <div class="result-title">
                            ${this.highlightMatch(item.title, query)}
                        </div>
                        <div class="result-meta">
                            <span class="result-badge" style="background: ${config.bg}; color: ${config.color}; border-color: ${config.color};">
                                ${item.level}
                            </span>
                            <span class="result-badge" style="background: ${typeInfo.bg}; color: ${typeInfo.color}; border-color: ${typeInfo.color};">
                                <i class="${typeInfo.icon}" style="font-size: 0.875rem;"></i>
                                ${typeInfo.label}
                            </span>
                            <span style="color: var(--text-tertiary); display: flex; align-items: center; gap: 0.25rem;">
                                <i class="ri-time-line"></i>
                                ${item.duration}
                            </span>
                            <span style="color: var(--text-tertiary); display: flex; align-items: center; gap: 0.25rem;">
                                <i class="ri-hashtag"></i>
                                ${item.id}
                            </span>
                        </div>
                    </div>
                    <i class="ri-arrow-right-line result-arrow"></i>
                </a>
            `;
        });

        html += '</div>';
        resultsDiv.innerHTML = html;
    }

    highlightMatch(text, query) {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return text;

        const before = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const after = text.substring(index + query.length);

        return `${before}<span class="search-highlight">${match}</span>${after}`;
    }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname.includes('Tutorial Hub')) {
            new TutorialSearch();
        }
    });
} else {
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname.includes('Tutorial Hub')) {
        new TutorialSearch();
    }
}

