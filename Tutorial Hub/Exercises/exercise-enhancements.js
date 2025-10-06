/**
 * Exercise Enhancement Features
 * Adds advanced functionality to all exercise pages
 */

class ExerciseEnhancements {
    constructor() {
        this.totalExercises = 10;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('variables')) return 'variables';
        if (path.includes('operators')) return 'operators';
        if (path.includes('conditionals')) return 'conditionals';
        if (path.includes('loops')) return 'loops';
        if (path.includes('functions')) return 'functions';
        if (path.includes('arrays')) return 'arrays';
        return 'unknown';
    }

    init() {
        this.addProgressBar();
        this.addCopyCodeButtons();
        this.addNextPrevNavigation();
        this.addLiveEditorButtons();
        this.addSearchFilter();
        this.addPersonalNotes();
        this.initHintsSystem();
    }

    // Feature 5: Exercise Completion Progress Bar
    addProgressBar() {
        const heroSection = document.querySelector('.exercise-hero');
        if (!heroSection) return;

        const completedExercises = this.getCompletedCount();
        const percentage = (completedExercises / this.totalExercises) * 100;

        const progressHTML = `
            <div class="exercise-progress-bar" style="margin-top: var(--space-xl); padding-top: var(--space-lg); border-top: 1px solid var(--glass-border);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
                    <span style="font-weight: 600; color: var(--text-secondary); font-size: 0.875rem;">YOUR PROGRESS</span>
                    <span style="font-weight: 700; color: var(--text-primary);">${completedExercises}/${this.totalExercises} Completed</span>
                </div>
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: 50px; height: 10px; overflow: hidden;">
                    <div style="height: 100%; width: ${percentage}%; background: linear-gradient(135deg, var(--color-success), var(--color-green-600)); border-radius: 50px; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;

        heroSection.insertAdjacentHTML('beforeend', progressHTML);
    }

    getCompletedCount() {
        const completed = JSON.parse(localStorage.getItem('completedExercises') || '{}');
        let count = 0;
        Object.keys(completed).forEach(key => {
            if (key.startsWith(`${this.currentPage}-`)) count++;
        });
        return count;
    }

    // Feature 2: Copy Code Button
    addCopyCodeButtons() {
        document.querySelectorAll('pre code').forEach((codeBlock, index) => {
            const pre = codeBlock.parentElement;
            pre.style.position = 'relative';

            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '<i class="ri-file-copy-line"></i> Copy';
            copyBtn.className = 'copy-code-btn';
            copyBtn.style.cssText = `
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-size: 0.8125rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 0.375rem;
            `;

            copyBtn.addEventListener('click', () => {
                const code = codeBlock.innerText;
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.innerHTML = '<i class="ri-check-line"></i> Copied!';
                    copyBtn.style.background = 'rgba(16, 185, 129, 0.3)';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="ri-file-copy-line"></i> Copy';
                        copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                    }, 2000);
                });
            });

            copyBtn.addEventListener('mouseenter', () => {
                copyBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            });

            copyBtn.addEventListener('mouseleave', () => {
                if (!copyBtn.innerHTML.includes('Copied')) {
                    copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                }
            });

            pre.appendChild(copyBtn);
        });
    }

    // Feature 3: Next/Previous Navigation
    addNextPrevNavigation() {
        const container = document.querySelector('.exercise-container');
        if (!container) return;

        const navHTML = `
            <div class="exercise-navigation" style="position: fixed; right: 2rem; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 0.5rem; z-index: 99;">
                <button id="prevExercise" class="nav-exercise-btn" style="width: 45px; height: 45px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50%; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; transition: all 0.3s; backdrop-filter: blur(20px);" title="Previous Exercise">
                    <i class="ri-arrow-up-line"></i>
                </button>
                <div style="text-align: center; font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600;" id="exerciseCounter">1/10</div>
                <button id="nextExercise" class="nav-exercise-btn" style="width: 45px; height: 45px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50%; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; transition: all 0.3s; backdrop-filter: blur(20px);" title="Next Exercise">
                    <i class="ri-arrow-down-line"></i>
                </button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', navHTML);

        const prevBtn = document.getElementById('prevExercise');
        const nextBtn = document.getElementById('nextExercise');
        const counter = document.getElementById('exerciseCounter');

        let currentExercise = 1;

        const updateCounter = () => {
            counter.textContent = `${currentExercise}/10`;
            prevBtn.disabled = currentExercise === 1;
            nextBtn.disabled = currentExercise === 10;
            prevBtn.style.opacity = currentExercise === 1 ? '0.4' : '1';
            nextBtn.style.opacity = currentExercise === 10 ? '0.4' : '1';
        };

        prevBtn.addEventListener('click', () => {
            if (currentExercise > 1) {
                currentExercise--;
                document.getElementById(`exercise-${currentExercise}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateCounter();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentExercise < 10) {
                currentExercise++;
                document.getElementById(`exercise-${currentExercise}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateCounter();
            }
        });

        // Detect which exercise is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const num = parseInt(id.replace('exercise-', ''));
                    if (num) {
                        currentExercise = num;
                        updateCounter();
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.exercise-card').forEach(card => {
            observer.observe(card);
        });

        updateCounter();
    }

    // Feature 6: Try in Live Editor Button
    addLiveEditorButtons() {
        document.querySelectorAll('.solution-content').forEach((solution, index) => {
            const codeBlock = solution.querySelector('pre code');
            if (!codeBlock) return;

            const liveEditorBtn = document.createElement('div');
            liveEditorBtn.style.cssText = 'text-align: center; margin-top: var(--space-md);';
            liveEditorBtn.innerHTML = `
                <a href="https://ipseudoeditor.netlify.app/" target="_blank" class="live-editor-btn" style="display: inline-flex; align-items: center; gap: 0.625rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500)); color: white; text-decoration: none; border-radius: var(--radius-md); font-weight: 600; font-size: 0.9375rem; transition: all 0.3s; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
                    <i class="ri-play-circle-line"></i>
                    Try in Live Editor
                </a>
            `;

            const markBtn = solution.querySelector('.show-solution-btn')?.parentElement;
            if (markBtn) {
                markBtn.insertAdjacentElement('beforebegin', liveEditorBtn);
            }
        });

        // Add hover effect via CSS
        const style = document.createElement('style');
        style.textContent = `
            .live-editor-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Feature 7: Exercise Search/Filter
    addSearchFilter() {
        const heroSection = document.querySelector('.exercise-hero');
        if (!heroSection) return;

        const searchHTML = `
            <div class="exercise-search" style="margin-top: var(--space-lg); max-width: 500px; margin-left: auto; margin-right: auto;">
                <div style="position: relative;">
                    <input type="text" id="exerciseSearch" placeholder="Search exercises..." style="width: 100%; padding: 0.875rem 1rem 0.875rem 3rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-size: 1rem; transition: all 0.3s; backdrop-filter: blur(20px);">
                    <i class="ri-search-line" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); font-size: 1.25rem;"></i>
                </div>
                <div class="filter-buttons" style="display: flex; gap: 0.5rem; margin-top: var(--space-md); justify-content: center; flex-wrap: wrap;">
                    <button class="filter-btn active" data-filter="all" style="padding: 0.5rem 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50px; color: var(--text-primary); font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: all 0.3s;">All</button>
                    <button class="filter-btn" data-filter="easy" style="padding: 0.5rem 1rem; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 50px; color: var(--color-success); font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: all 0.3s;">Easy</button>
                    <button class="filter-btn" data-filter="medium" style="padding: 0.5rem 1rem; background: rgba(234, 88, 12, 0.1); border: 1px solid rgba(234, 88, 12, 0.3); border-radius: 50px; color: var(--color-orange-600); font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: all 0.3s;">Medium</button>
                    <button class="filter-btn" data-filter="hard" style="padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 50px; color: #ef4444; font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: all 0.3s;">Hard</button>
                </div>
            </div>
        `;

        heroSection.insertAdjacentHTML('beforeend', searchHTML);

        // Search functionality
        const searchInput = document.getElementById('exerciseSearch');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.exercise-card').forEach(card => {
                const title = card.querySelector('.exercise-title')?.textContent.toLowerCase() || '';
                const match = title.includes(query);
                card.style.display = match ? 'block' : 'none';
            });
        });

        // Filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                document.querySelectorAll('.exercise-card').forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        const hasFilter = card.querySelector(`.difficulty-${filter}`);
                        card.style.display = hasFilter ? 'block' : 'none';
                    }
                });
            });
        });

        // Hover effects for filter buttons
        const style = document.createElement('style');
        style.textContent = `
            .filter-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            .filter-btn.active {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transform: translateY(-1px);
            }
            #exerciseSearch:focus {
                outline: none;
                border-color: var(--color-purple-500);
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    // Feature 9: Personal Notes Section
    addPersonalNotes() {
        document.querySelectorAll('.exercise-card').forEach((card, index) => {
            const exerciseNum = index + 1;
            const exerciseBody = card.querySelector('.exercise-body');
            if (!exerciseBody) return;

            const notesKey = `${this.currentPage}-exercise-${exerciseNum}-notes`;
            const savedNotes = localStorage.getItem(notesKey) || '';

            const notesHTML = `
                <div class="personal-notes-section" style="margin-top: var(--space-xl); padding: var(--space-md); background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05)); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: var(--radius-md);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: var(--space-sm); color: var(--color-purple-500); font-weight: 600;">
                        <i class="ri-sticky-note-line"></i>
                        <span>Personal Notes</span>
                    </div>
                    <textarea id="notes-${exerciseNum}" placeholder="Add your personal notes here..." style="width: 100%; min-height: 80px; padding: var(--space-md); background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: 'Inter', sans-serif; font-size: 0.9375rem; line-height: 1.6; resize: vertical; transition: all 0.3s;">${savedNotes}</textarea>
                    <div style="margin-top: var(--space-sm); display: flex; gap: var(--space-sm);">
                        <button onclick="saveNotes(${exerciseNum})" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500)); color: white; border: none; border-radius: var(--radius-sm); font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: all 0.3s;"><i class="ri-save-line"></i> Save</button>
                        <button onclick="clearNotes(${exerciseNum})" style="padding: 0.5rem 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-secondary); border-radius: var(--radius-sm); font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: all 0.3s;"><i class="ri-delete-bin-line"></i> Clear</button>
                    </div>
                </div>
            `;

            exerciseBody.insertAdjacentHTML('beforeend', notesHTML);

            // Focus effect
            const textarea = document.getElementById(`notes-${exerciseNum}`);
            textarea.addEventListener('focus', () => {
                textarea.style.borderColor = 'var(--color-purple-500)';
                textarea.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
            });
            textarea.addEventListener('blur', () => {
                textarea.style.borderColor = 'var(--glass-border)';
                textarea.style.boxShadow = 'none';
            });
        });
    }

    // Feature 4: Progressive Hints System
    initHintsSystem() {
        // This adds hint buttons before showing the full solution
        document.querySelectorAll('.solution-section').forEach((section, index) => {
            const exerciseNum = index + 1;
            const hiddenDiv = section.querySelector(`#solution-${exerciseNum}-hidden`);
            if (!hiddenDiv) return;

            // Add hints before solution button
            const hintsHTML = `
                <div class="hints-container" style="margin-bottom: var(--space-md);">
                    <button class="hint-btn" onclick="showHint(${exerciseNum}, 1)" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15)); border: 1px solid rgba(59, 130, 246, 0.3); color: var(--color-blue-500); border-radius: var(--radius-md); font-weight: 600; cursor: pointer; margin: 0.25rem; transition: all 0.3s; display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i class="ri-lightbulb-line"></i> Show Hint 1
                    </button>
                    <button class="hint-btn" onclick="showHint(${exerciseNum}, 2)" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15)); border: 1px solid rgba(59, 130, 246, 0.3); color: var(--color-blue-500); border-radius: var(--radius-md); font-weight: 600; cursor: pointer; margin: 0.25rem; transition: all 0.3s; display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i class="ri-lightbulb-flash-line"></i> Show Hint 2
                    </button>
                    <div id="hint-${exerciseNum}-1" class="hint-display" style="display: none; margin-top: var(--space-md); padding: var(--space-md); background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: var(--radius-md); color: var(--text-secondary);"></div>
                    <div id="hint-${exerciseNum}-2" class="hint-display" style="display: none; margin-top: var(--space-md); padding: var(--space-md); background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: var(--radius-md); color: var(--text-secondary);"></div>
                </div>
            `;

            hiddenDiv.insertAdjacentHTML('beforebegin', hintsHTML);
        });

        // Store generic hints (could be customized per exercise)
        window.exerciseHints = {
            1: ['Think about what loop type to use', 'Remember to use a loop variable'],
            2: ['You need an accumulator variable', 'Initialize it before the loop'],
            // More hints would be added per exercise
        };
    }
}

// Global functions for notes
function saveNotes(num) {
    const textarea = document.getElementById(`notes-${num}`);
    const page = window.location.pathname.split('/').pop().replace('.html', '').replace('exercises-', '');
    const notesKey = `${page}-exercise-${num}-notes`;
    localStorage.setItem(notesKey, textarea.value);
    
    // Show success feedback
    const btn = event.target;
    btn.innerHTML = '<i class="ri-check-line"></i> Saved!';
    setTimeout(() => {
        btn.innerHTML = '<i class="ri-save-line"></i> Save';
    }, 2000);
}

function clearNotes(num) {
    if (confirm('Clear your notes for this exercise?')) {
        const textarea = document.getElementById(`notes-${num}`);
        textarea.value = '';
        const page = window.location.pathname.split('/').pop().replace('.html', '').replace('exercises-', '');
        const notesKey = `${page}-exercise-${num}-notes`;
        localStorage.removeItem(notesKey);
    }
}

// Global function for hints
function showHint(exerciseNum, hintNum) {
    const hintDiv = document.getElementById(`hint-${exerciseNum}-${hintNum}`);
    if (hintDiv.style.display === 'none') {
        // Generic but helpful hints for all exercises
        const genericHints = {
            1: [
                '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> Start by thinking about what variables you need to store the input and output.',
                '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Break the problem into steps: get input, perform calculation, display result.'
            ],
            2: [
                '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> You\'ll need an accumulator variable initialized before the loop.',
                '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Update the accumulator inside the loop on each iteration.'
            ],
            3: [
                '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> Consider what condition needs to be checked for each case.',
                '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Use If-Elseif-Else structure for multiple conditions.'
            ],
            4: [
                '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> Think about what operations you need and in what order.',
                '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Store intermediate results in separate variables for clarity.'
            ],
            5: [
                '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> What formula or calculation is needed for this problem?',
                '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Make sure to handle the order of operations correctly.'
            ],
            6: [
                '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> You may need multiple variables to track different values.',
                '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Consider using loops or conditions based on the problem type.'
            ],
            7: [
                '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> Look for patterns in the problem - is it repetitive or conditional?',
                '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Nested structures (loops or conditions) might be needed.'
            ],
            8: [
                '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> This is a more complex problem - break it into smaller sub-problems.',
                '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Consider using helper variables to make the logic clearer.'
            ],
            9: [
                '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> Advanced problem - think about edge cases and special conditions.',
                '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Use boolean flags or multiple conditions to handle different scenarios.'
            ],
            10: [
                '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> This is the most challenging exercise - combine multiple concepts.',
                '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Test your logic with the example to verify each step works correctly.'
            ]
        };
        
        const hints = genericHints[exerciseNum] || [
            '<strong><i class="ri-lightbulb-line"></i> Hint 1:</strong> Read the problem carefully and identify the inputs and outputs needed.',
            '<strong><i class="ri-lightbulb-flash-line"></i> Hint 2:</strong> Plan your algorithm step-by-step before writing the code.'
        ];
        
        hintDiv.innerHTML = hints[hintNum - 1];
        hintDiv.style.display = 'block';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new ExerciseEnhancements();
});

