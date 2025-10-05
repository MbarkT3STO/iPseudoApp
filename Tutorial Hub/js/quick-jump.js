/**
 * Quick Jump Dropdown
 * Fast navigation to any lesson from anywhere
 */

class QuickJump {
    constructor() {
        this.lessons = this.getAllLessons();
        this.init();
    }

    getAllLessons() {
        return [
            { id: '01', title: 'Introduction to Pseudocode', level: 'beginner', file: '01-introduction-to-pseudocode.html' },
            { id: '02', title: 'Getting Started with iPseudo', level: 'beginner', file: '02-getting-started.html' },
            { id: '03', title: 'Variables and Data Types', level: 'beginner', file: '03-variables-and-data-types.html' },
            { id: '04', title: 'Input and Output', level: 'beginner', file: '04-input-and-output.html' },
            { id: '05', title: 'Operators', level: 'beginner', file: '05-operators.html' },
            { id: '06', title: 'Comments and Documentation', level: 'beginner', file: '06-comments-and-documentation.html' },
            { id: '07', title: 'Conditional Statements', level: 'intermediate', file: '07-conditional-statements.html' },
            { id: '08', title: 'Loops', level: 'intermediate', file: '08-loops.html' },
            { id: '09', title: 'Nested Loops', level: 'intermediate', file: '09-nested-loops.html' },
            { id: '10', title: 'Functions', level: 'intermediate', file: '10-functions.html' },
            { id: '11', title: 'Procedures', level: 'intermediate', file: '11-procedures.html' },
            { id: '12', title: 'Arrays', level: 'intermediate', file: '12-arrays.html' },
            { id: '13', title: 'String Operations', level: 'intermediate', file: '13-string-operations.html' },
            { id: '14', title: 'Multidimensional Arrays', level: 'advanced', file: '14-multidimensional-arrays.html' },
            { id: '15', title: 'Recursion', level: 'advanced', file: '15-recursion.html' },
            { id: '16', title: 'Sorting Algorithms', level: 'advanced', file: '16-sorting-algorithms.html' },
            { id: '17', title: 'Searching Algorithms', level: 'advanced', file: '17-searching-algorithms.html' },
            { id: '18', title: 'Data Structures', level: 'advanced', file: '18-data-structures.html' },
            { id: '19', title: 'Algorithm Design Patterns', level: 'advanced', file: '19-algorithm-design-patterns.html' },
            { id: '20', title: 'Best Practices', level: 'advanced', file: '20-best-practices.html' }
        ];
    }

    init() {
        // Only show quick jump on lesson pages, not on index, contact, statistics, or my-notes
        const isIndexPage = window.location.pathname.includes('index.html') || 
                           window.location.pathname.endsWith('/') || 
                           window.location.pathname.endsWith('/Tutorial Hub');
        const isSpecialPage = window.location.pathname.includes('contact.html') ||
                             window.location.pathname.includes('statistics.html') ||
                             window.location.pathname.includes('my-notes.html');
        
        if (isIndexPage || isSpecialPage) return;
        
        this.createQuickJump();
    }

    createQuickJump() {
        const navbar = document.querySelector('.navbar-brand');
        if (!navbar) return;

        const quickJumpContainer = document.createElement('div');
        quickJumpContainer.className = 'quick-jump-container';
        quickJumpContainer.style.cssText = `
            position: relative;
            margin-left: var(--space-lg);
        `;

        quickJumpContainer.innerHTML = `
            <button class="quick-jump-btn" id="quickJumpBtn" style="
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.625rem 1rem;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-md);
                color: var(--text-primary);
                font-weight: 600;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.3s;
                backdrop-filter: blur(10px);
            ">
                <i class="ri-compass-3-line" style="font-size: 1.125rem;"></i>
                <span>Jump to Lesson</span>
                <i class="ri-arrow-down-s-line" style="font-size: 1rem;"></i>
            </button>

            <div class="quick-jump-dropdown" id="quickJumpDropdown" style="
                position: absolute;
                top: calc(100% + 0.5rem);
                left: 0;
                width: 380px;
                max-height: 500px;
                background: rgba(15, 15, 25, 0.98);
                border: 1px solid rgba(147, 51, 234, 0.3);
                border-radius: var(--radius-lg);
                backdrop-filter: blur(20px);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(147, 51, 234, 0.1);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1000;
                overflow: hidden;
            ">
                <div style="padding: var(--space-md); border-bottom: 1px solid rgba(255, 255, 255, 0.1); background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1));">
                    <input type="text" id="quickJumpSearch" placeholder="Search lessons..." style="
                        width: 100%;
                        padding: 0.75rem 1rem;
                        background: rgba(255, 255, 255, 0.08);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: var(--radius-sm);
                        color: var(--text-primary);
                        font-size: 0.875rem;
                        font-family: 'Inter', sans-serif;
                    ">
                </div>
                <div id="quickJumpList" style="
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 0.5rem;
                "></div>
            </div>
        `;

        navbar.appendChild(quickJumpContainer);

        this.attachEventListeners();
        this.renderLessonList();
    }

    attachEventListeners() {
        const btn = document.getElementById('quickJumpBtn');
        const dropdown = document.getElementById('quickJumpDropdown');
        const search = document.getElementById('quickJumpSearch');

        // Toggle dropdown
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.style.visibility === 'visible';
            
            if (isOpen) {
                this.closeDropdown();
            } else {
                this.openDropdown();
            }
        });

        // Search functionality
        search.addEventListener('input', (e) => {
            this.filterLessons(e.target.value);
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!quickJumpContainer.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Prevent dropdown from closing when clicking inside
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    openDropdown() {
        const dropdown = document.getElementById('quickJumpDropdown');
        const btn = document.getElementById('quickJumpBtn');
        const search = document.getElementById('quickJumpSearch');
        
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0)';
        btn.style.borderColor = 'var(--color-purple-500)';
        btn.style.background = 'rgba(147, 51, 234, 0.1)';
        
        setTimeout(() => search.focus(), 100);
    }

    closeDropdown() {
        const dropdown = document.getElementById('quickJumpDropdown');
        const btn = document.getElementById('quickJumpBtn');
        const search = document.getElementById('quickJumpSearch');
        
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-10px)';
        btn.style.borderColor = 'var(--glass-border)';
        btn.style.background = 'var(--glass-bg)';
        search.value = '';
        
        this.renderLessonList();
    }

    renderLessonList(filteredLessons = null) {
        const list = document.getElementById('quickJumpList');
        const lessonsToShow = filteredLessons || this.lessons;
        const progress = this.getProgress();

        if (lessonsToShow.length === 0) {
            list.innerHTML = `
                <div style="padding: var(--space-xl); text-align: center; color: var(--text-secondary);">
                    <i class="ri-search-line" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                    <div>No lessons found</div>
                </div>
            `;
            return;
        }

        let currentLevel = '';
        let html = '';

        lessonsToShow.forEach(lesson => {
            // Add level header if new level
            if (lesson.level !== currentLevel) {
                currentLevel = lesson.level;
                const levelColor = {
                    'beginner': 'var(--color-success)',
                    'intermediate': 'var(--color-blue-500)',
                    'advanced': 'var(--color-purple-500)'
                }[lesson.level];

                const levelIcon = {
                    'beginner': 'ri-seedling-line',
                    'intermediate': 'ri-plant-line',
                    'advanced': 'ri-rocket-line'
                }[lesson.level];

                html += `
                    <div style="padding: 0.5rem var(--space-sm); font-size: 0.75rem; font-weight: 700; color: ${levelColor}; text-transform: uppercase; letter-spacing: 0.05em; margin-top: ${currentLevel === 'beginner' ? '0' : 'var(--space-sm)'};">
                        <i class="${levelIcon}"></i> ${lesson.level}
                    </div>
                `;
            }

            const isCompleted = progress.completed.includes(lesson.id);
            const isInProgress = progress.inProgress.includes(lesson.id);

            html += `
                <a href="${lesson.file}" style="
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    padding: 0.75rem var(--space-sm);
                    text-decoration: none;
                    border-radius: var(--radius-sm);
                    transition: all 0.2s;
                    margin-bottom: 0.25rem;
                " onmouseover="this.style.background='rgba(147, 51, 234, 0.1)'" onmouseout="this.style.background='transparent'">
                    <div style="
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: ${isCompleted ? 'var(--color-success)' : isInProgress ? 'var(--color-orange-600)' : 'rgba(147, 51, 234, 0.2)'};
                        border-radius: var(--radius-sm);
                        font-weight: 700;
                        font-size: 0.75rem;
                        color: white;
                        flex-shrink: 0;
                    ">
                        ${isCompleted ? '<i class="ri-check-line"></i>' : lesson.id}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 600; font-size: 0.875rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${lesson.title}
                        </div>
                    </div>
                    <i class="ri-arrow-right-line" style="color: var(--text-tertiary); font-size: 1rem; flex-shrink: 0;"></i>
                </a>
            `;
        });

        list.innerHTML = html;
    }

    filterLessons(query) {
        if (!query.trim()) {
            this.renderLessonList();
            return;
        }

        const filtered = this.lessons.filter(lesson => {
            const searchText = `${lesson.id} ${lesson.title} ${lesson.level}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        this.renderLessonList(filtered);
    }

    getProgress() {
        const stored = localStorage.getItem('tutorial-progress');
        return stored ? JSON.parse(stored) : { completed: [], inProgress: [] };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new QuickJump();
    });
} else {
    new QuickJump();
}

