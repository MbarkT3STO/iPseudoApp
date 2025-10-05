/**
 * Tutorial Hub Advanced Features
 * Includes: Progress Tracking, Bookmarks, Notes, Code Copy, Share, etc.
 */

class TutorialFeatures {
    constructor() {
        this.lessons = this.getAllLessons();
        this.currentLesson = this.getCurrentLessonId();
        this.init();
    }

    init() {
        this.initProgressTracking();
        this.initContinueButton();
        this.initBookmarks();
        this.initCodeCopyButtons();
        this.initShareButtons();
        this.initNotes();
        this.initKeyboardNavigation();
        this.initTableOfContents();
        this.initAnimations();
        this.checkAchievements();
        this.initPrerequisites();
    }

    // ========== LESSON DATA ==========
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

    getCurrentLessonId() {
        const path = window.location.pathname;
        const match = path.match(/(\d+)-/);
        return match ? match[1] : null;
    }

    // ========== PROGRESS TRACKING ==========
    initProgressTracking() {
        const isIndexPage = window.location.pathname.includes('index.html') || 
                           window.location.pathname.endsWith('/') || 
                           window.location.pathname.endsWith('/Tutorial Hub');
        
        // On lesson pages
        if (this.currentLesson) {
            // Mark current lesson as in progress
            this.markLessonInProgress(this.currentLesson);

            // Add completion button at the bottom of lesson
            this.addCompletionButton();
            
            // Add progress bar to lesson header
            this.addProgressBarToLesson();
        }

        // On index page
        if (isIndexPage) {
            this.updateProgressDisplay();
            this.addProgressBadgesToCards();
        }
    }

    markLessonInProgress(lessonId) {
        const progress = this.getProgress();
        if (!progress.inProgress.includes(lessonId) && !progress.completed.includes(lessonId)) {
            progress.inProgress.push(lessonId);
            this.saveProgress(progress);
        }
    }

    markLessonComplete(lessonId) {
        const progress = this.getProgress();
        progress.inProgress = progress.inProgress.filter(id => id !== lessonId);
        if (!progress.completed.includes(lessonId)) {
            progress.completed.push(lessonId);
            this.saveProgress(progress);
            this.showCompletionCelebration(lessonId);
            this.checkAchievements();
        }
    }

    getProgress() {
        const stored = localStorage.getItem('tutorial-progress');
        return stored ? JSON.parse(stored) : { completed: [], inProgress: [] };
    }

    saveProgress(progress) {
        localStorage.setItem('tutorial-progress', JSON.stringify(progress));
    }

    addCompletionButton() {
        const navigation = document.querySelector('.tutorial-navigation');
        if (!navigation) return;

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-lesson-btn';
        completeBtn.innerHTML = `
            <i class="ri-checkbox-circle-line"></i>
            <span>Mark as Complete</span>
        `;
        completeBtn.style.cssText = `
            padding: 1rem 2rem;
            background: linear-gradient(135deg, var(--color-success), var(--color-green-600));
            border: none;
            border-radius: var(--radius-md);
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            justify-content: center;
        `;

        const progress = this.getProgress();
        if (progress.completed.includes(this.currentLesson)) {
            completeBtn.innerHTML = `<i class="ri-checkbox-circle-fill"></i><span>Completed ✓</span>`;
            completeBtn.style.opacity = '0.7';
        }

        completeBtn.addEventListener('click', () => {
            this.markLessonComplete(this.currentLesson);
            completeBtn.innerHTML = `<i class="ri-checkbox-circle-fill"></i><span>Completed ✓</span>`;
            completeBtn.style.opacity = '0.7';
            
            // Update the progress bar on the lesson page
            const existingProgressBar = document.querySelector('.lesson-progress-bar');
            if (existingProgressBar) {
                existingProgressBar.remove();
                this.addProgressBarToLesson();
            }
        });

        navigation.insertBefore(completeBtn, navigation.children[1]);
    }

    updateProgressDisplay() {
        const progress = this.getProgress();
        const total = this.lessons.length;
        const completed = progress.completed.length;
        const inProgress = progress.inProgress.length;
        const percentage = Math.round((completed / total) * 100);

        // Only show if user has started at least one lesson
        const hasStarted = completed > 0 || inProgress > 0;
        if (!hasStarted) return;

        // Find the hero description
        const heroDescription = document.querySelector('.hero-description');
        if (!heroDescription) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-display';
        progressBar.style.cssText = 'max-width: 700px; margin: var(--space-xl) auto;';
        progressBar.innerHTML = `
            <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: var(--space-xl); backdrop-filter: blur(10px); box-shadow: var(--glass-shadow);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ri-trophy-line" style="font-size: 1.5rem; color: var(--color-purple-500);"></i>
                        <span style="font-weight: 700; font-size: 1.125rem; color: var(--text-primary);">Your Learning Progress</span>
                    </div>
                    <a href="statistics.html" style="padding: 0.5rem 1rem; background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(147, 51, 234, 0.2); border-radius: var(--radius-sm); color: var(--color-purple-500); text-decoration: none; font-size: 0.8125rem; font-weight: 600; display: flex; align-items: center; gap: 0.375rem; transition: all 0.2s;" title="View detailed statistics">
                        <i class="ri-bar-chart-box-line"></i>
                        <span>View Stats</span>
                    </a>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                    <span style="font-weight: 700; font-size: 2.5rem; background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${completed}</span>
                    <span style="font-size: 1.125rem; color: var(--text-tertiary);">/</span>
                    <span style="font-weight: 700; font-size: 1.5rem; color: var(--text-secondary);">${total}</span>
                </div>
                <div style="width: 100%; height: 14px; background: rgba(255, 255, 255, 0.1); border-radius: 100px; overflow: hidden; margin-bottom: var(--space-md); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);">
                    <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, var(--color-purple-500), var(--color-blue-500)); border-radius: 100px; transition: width 0.5s ease; box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);"></div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.9375rem; color: var(--text-secondary);">
                        <strong style="color: var(--color-purple-500);">${percentage}%</strong> Complete ${completed === total ? '🎉 All Done!' : ''}
                    </span>
                    <span style="font-size: 0.875rem; color: var(--text-tertiary);">
                        ${total - completed} ${total - completed === 1 ? 'lesson' : 'lessons'} remaining
                    </span>
                </div>
            </div>
        `;

        // Insert after the hero description
        heroDescription.after(progressBar);
    }

    addProgressBarToLesson() {
        const progress = this.getProgress();
        const total = this.lessons.length;
        const completed = progress.completed.length;
        const percentage = Math.round((completed / total) * 100);
        
        const currentLessonIndex = this.lessons.findIndex(l => l.id === this.currentLesson);
        const currentLessonNum = currentLessonIndex + 1;

        // Find tutorial header
        const header = document.querySelector('.tutorial-header');
        if (!header) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'lesson-progress-bar';
        progressBar.style.cssText = `
            margin-top: var(--space-lg);
            padding: var(--space-md);
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-md);
            backdrop-filter: blur(10px);
        `;
        progressBar.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.875rem; font-weight: 600; color: var(--text-primary);">
                    <i class="ri-trophy-line" style="color: var(--color-purple-500); margin-right: 0.25rem;"></i>
                    Overall Progress
                </span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 0.875rem; font-weight: 700; color: var(--color-purple-500);">${completed}/${total}</span>
                    <a href="statistics.html" style="padding: 0.375rem 0.75rem; background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(147, 51, 234, 0.2); border-radius: var(--radius-sm); color: var(--color-purple-500); text-decoration: none; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.25rem; transition: all 0.2s; white-space: nowrap;" title="View detailed statistics">
                        <i class="ri-bar-chart-box-line"></i>
                        <span>Stats</span>
                    </a>
                </div>
            </div>
            <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 100px; overflow: hidden; margin-bottom: 0.5rem;">
                <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, var(--color-purple-500), var(--color-blue-500)); border-radius: 100px; transition: width 0.5s ease;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.75rem; color: var(--text-secondary);">
                    ${percentage}% Complete ${completed === total ? '🎉' : ''}
                </span>
                <span style="font-size: 0.75rem; color: var(--text-tertiary);">
                    Lesson ${currentLessonNum} of ${total}
                </span>
            </div>
        `;

        header.appendChild(progressBar);
    }

    addProgressBadgesToCards() {
        const progress = this.getProgress();
        
        document.querySelectorAll('.lesson-card').forEach(card => {
            const href = card.getAttribute('href');
            const match = href.match(/(\d+)-/);
            if (!match) return;
            
            const lessonId = match[1];
            const lessonNumber = card.querySelector('.lesson-number');
            
            if (progress.completed.includes(lessonId)) {
                lessonNumber.innerHTML = `<i class="ri-checkbox-circle-fill"></i>`;
                lessonNumber.style.background = 'linear-gradient(135deg, var(--color-success), var(--color-green-600))';
            } else if (progress.inProgress.includes(lessonId)) {
                lessonNumber.style.background = 'linear-gradient(135deg, var(--color-orange-600), var(--color-orange-600))';
            }
        });
    }

    showCompletionCelebration(lessonId) {
        const lesson = this.lessons.find(l => l.id === lessonId);
        
        const celebration = document.createElement('div');
        celebration.className = 'completion-celebration';
        celebration.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s;">
                <div style="background: var(--glass-bg); border: 2px solid var(--color-success); border-radius: var(--radius-xl); padding: var(--space-2xl); max-width: 500px; text-align: center; backdrop-filter: blur(20px); animation: scaleIn 0.5s;">
                    <div style="font-size: 4rem; margin-bottom: var(--space-md);">🎉</div>
                    <h2 style="font-size: 2rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-sm);">Lesson Complete!</h2>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">Great job completing "${lesson.title}"</p>
                    <button onclick="this.closest('.completion-celebration').remove()" style="padding: 0.75rem 2rem; background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500)); border: none; border-radius: var(--radius-md); color: white; font-weight: 600; cursor: pointer;">Continue Learning</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => celebration.remove(), 5000);
    }

    // ========== BOOKMARKS ==========
    initBookmarks() {
        if (!this.currentLesson) return;

        const header = document.querySelector('.tutorial-header');
        if (!header) return;

        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'bookmark-btn';
        bookmarkBtn.innerHTML = `<i class="ri-bookmark-line"></i>`;
        bookmarkBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 48px;
            height: 48px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
        `;

        const bookmarks = this.getBookmarks();
        if (bookmarks.includes(this.currentLesson)) {
            bookmarkBtn.innerHTML = `<i class="ri-bookmark-fill"></i>`;
            bookmarkBtn.style.color = 'var(--color-purple-500)';
        }

        bookmarkBtn.addEventListener('click', () => {
            this.toggleBookmark(this.currentLesson);
            const isBookmarked = this.getBookmarks().includes(this.currentLesson);
            bookmarkBtn.innerHTML = isBookmarked ? `<i class="ri-bookmark-fill"></i>` : `<i class="ri-bookmark-line"></i>`;
            bookmarkBtn.style.color = isBookmarked ? 'var(--color-purple-500)' : 'var(--text-primary)';
        });

        header.style.position = 'relative';
        header.appendChild(bookmarkBtn);
    }

    getBookmarks() {
        const stored = localStorage.getItem('tutorial-bookmarks');
        return stored ? JSON.parse(stored) : [];
    }

    toggleBookmark(lessonId) {
        let bookmarks = this.getBookmarks();
        if (bookmarks.includes(lessonId)) {
            bookmarks = bookmarks.filter(id => id !== lessonId);
        } else {
            bookmarks.push(lessonId);
        }
        localStorage.setItem('tutorial-bookmarks', JSON.stringify(bookmarks));
    }

    // ========== CODE COPY BUTTONS ==========
    initCodeCopyButtons() {
        document.querySelectorAll('pre code').forEach(codeBlock => {
            const pre = codeBlock.parentElement;
            pre.style.position = 'relative';

            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = `<i class="ri-file-copy-line"></i>`;
            copyBtn.style.cssText = `
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                padding: 0.5rem;
                background: rgba(147, 51, 234, 0.2);
                border: 1px solid rgba(147, 51, 234, 0.3);
                border-radius: var(--radius-sm);
                color: var(--color-purple-500);
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
            `;

            copyBtn.addEventListener('click', () => {
                const code = codeBlock.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.innerHTML = `<i class="ri-check-line"></i>`;
                    copyBtn.style.background = 'rgba(34, 197, 94, 0.2)';
                    copyBtn.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                    copyBtn.style.color = 'var(--color-success)';

                    setTimeout(() => {
                        copyBtn.innerHTML = `<i class="ri-file-copy-line"></i>`;
                        copyBtn.style.background = 'rgba(147, 51, 234, 0.2)';
                        copyBtn.style.borderColor = 'rgba(147, 51, 234, 0.3)';
                        copyBtn.style.color = 'var(--color-purple-500)';
                    }, 2000);
                });
            });

            pre.appendChild(copyBtn);
        });
    }

    // ========== SHARE BUTTONS ==========
    initShareButtons() {
        const header = document.querySelector('.tutorial-header');
        if (!header) return;

        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.innerHTML = `<i class="ri-share-line"></i>`;
        shareBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 5rem;
            width: 48px;
            height: 48px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
        `;

        shareBtn.addEventListener('click', () => {
            const url = window.location.href;
            const title = document.querySelector('.tutorial-title').textContent;

            if (navigator.share) {
                navigator.share({ title, url });
            } else {
                navigator.clipboard.writeText(url);
                shareBtn.innerHTML = `<i class="ri-check-line"></i>`;
                shareBtn.style.color = 'var(--color-success)';
                setTimeout(() => {
                    shareBtn.innerHTML = `<i class="ri-share-line"></i>`;
                    shareBtn.style.color = 'var(--text-primary)';
                }, 2000);
            }
        });

        header.appendChild(shareBtn);
    }

    // ========== NOTES ==========
    initNotes() {
        if (!this.currentLesson) return;

        const container = document.querySelector('.tutorial-container');
        if (!container) return;

        const notesSection = document.createElement('div');
        notesSection.className = 'lesson-notes';
        notesSection.innerHTML = `
            <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: var(--space-xl); backdrop-filter: blur(10px); margin-top: var(--space-xl);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ri-sticky-note-line" style="font-size: 1.5rem; color: var(--color-purple-500);"></i>
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary);">Personal Notes</h3>
                    </div>
                    <a href="my-notes.html" style="padding: 0.5rem 1rem; background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(147, 51, 234, 0.2); border-radius: var(--radius-sm); color: var(--color-purple-500); text-decoration: none; font-size: 0.875rem; font-weight: 600; display: flex; align-items: center; gap: 0.375rem; transition: all 0.2s;" title="View all notes">
                        <i class="ri-file-list-line"></i>
                        <span>View All Notes</span>
                    </a>
                </div>
                <textarea id="lessonNotes" placeholder="Take notes for this lesson..." style="width: 100%; min-height: 150px; padding: 1rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-md); color: var(--text-primary); font-family: 'Inter', sans-serif; resize: vertical;"></textarea>
                <div style="margin-top: 0.75rem; font-size: 0.875rem; color: var(--text-tertiary);">
                    <i class="ri-information-line"></i> Notes are saved automatically
                </div>
            </div>
        `;

        const body = document.querySelector('.tutorial-body');
        if (body) {
            body.after(notesSection);

            const textarea = notesSection.querySelector('#lessonNotes');
            const notes = this.getNotes(this.currentLesson);
            textarea.value = notes;

            textarea.addEventListener('input', () => {
                this.saveNote(this.currentLesson, textarea.value);
            });
        }
    }

    getNotes(lessonId) {
        const notes = JSON.parse(localStorage.getItem('tutorial-notes') || '{}');
        return notes[lessonId] || '';
    }

    saveNote(lessonId, note) {
        const notes = JSON.parse(localStorage.getItem('tutorial-notes') || '{}');
        notes[lessonId] = note;
        localStorage.setItem('tutorial-notes', JSON.stringify(notes));
    }

    // ========== KEYBOARD NAVIGATION ==========
    initKeyboardNavigation() {
        if (!this.currentLesson) return;

        const currentIndex = this.lessons.findIndex(l => l.id === this.currentLesson);
        
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                window.location.href = this.lessons[currentIndex - 1].file;
            } else if (e.key === 'ArrowRight' && currentIndex < this.lessons.length - 1) {
                window.location.href = this.lessons[currentIndex + 1].file;
            }
        });

        // Add visual indicators
        this.addFloatingNavButtons(currentIndex);
    }

    addFloatingNavButtons(currentIndex) {
        const container = document.createElement('div');
        container.className = 'floating-nav';
        container.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            display: flex;
            gap: 0.5rem;
            z-index: 998;
        `;

        if (currentIndex > 0) {
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = `<i class="ri-arrow-left-line"></i>`;
            prevBtn.title = 'Previous Lesson (←)';
            prevBtn.style.cssText = `
                width: 48px;
                height: 48px;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                color: var(--text-primary);
                cursor: pointer;
                transition: all 0.3s;
                backdrop-filter: blur(10px);
            `;
            prevBtn.addEventListener('click', () => {
                window.location.href = this.lessons[currentIndex - 1].file;
            });
            container.appendChild(prevBtn);
        }

        if (currentIndex < this.lessons.length - 1) {
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = `<i class="ri-arrow-right-line"></i>`;
            nextBtn.title = 'Next Lesson (→)';
            nextBtn.style.cssText = `
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500));
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                color: white;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
            `;
            nextBtn.addEventListener('click', () => {
                window.location.href = this.lessons[currentIndex + 1].file;
            });
            container.appendChild(nextBtn);
        }

        document.body.appendChild(container);
    }

    // ========== TABLE OF CONTENTS ==========
    initTableOfContents() {
        const body = document.querySelector('.tutorial-body');
        if (!body) return;

        const headings = body.querySelectorAll('h2, h3');
        if (headings.length < 3) return;

        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.style.cssText = `
            position: fixed;
            right: 2rem;
            top: 50%;
            transform: translateY(-50%);
            width: 350px;
            max-width: calc(100vw - 4rem);
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            backdrop-filter: blur(20px);
            z-index: 100;
            max-height: 70vh;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: var(--glass-shadow);
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        `;

        // Create collapsible header
        const tocHeader = document.createElement('div');
        tocHeader.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--glass-border);
            cursor: pointer;
            user-select: none;
            min-height: 60px;
            box-sizing: border-box;
        `;
        tocHeader.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.625rem; flex: 1;">
                <i class="ri-list-check-2" style="font-size: 1.25rem; color: var(--color-purple-500); flex-shrink: 0;"></i>
                <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9375rem; line-height: 1.2;">On This Page</span>
            </div>
            <button class="toc-toggle" style="background: none; border: none; color: var(--text-primary); cursor: pointer; font-size: 1.25rem; padding: 0.25rem; display: flex; align-items: center; justify-content: center; transition: transform 0.3s; flex-shrink: 0;">
                <i class="ri-arrow-up-s-line"></i>
            </button>
        `;

        // Create content container
        const tocContent = document.createElement('div');
        tocContent.className = 'toc-content';
        tocContent.style.cssText = `
            padding: var(--space-md) var(--space-lg);
            max-height: calc(70vh - 60px);
            overflow-y: auto;
            overflow-x: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        let tocHTML = '';
        headings.forEach((heading, index) => {
            heading.id = heading.id || `section-${index}`;
            const isH2 = heading.tagName === 'H2';
            
            // Clean up heading text - remove emojis and extra spaces
            let headingText = heading.textContent.trim();
            
            tocHTML += `
                <a href="#${heading.id}" class="toc-link" style="
                    display: block; 
                    padding: 0.625rem 0.5rem 0.625rem ${isH2 ? '0.75rem' : '1.5rem'}; 
                    color: var(--text-secondary); 
                    text-decoration: none; 
                    font-size: ${isH2 ? '0.9375rem' : '0.875rem'}; 
                    transition: all 0.2s; 
                    border-left: 3px solid transparent; 
                    margin-left: 0;
                    margin-bottom: 0.25rem;
                    font-weight: ${isH2 ? '600' : '400'};
                    line-height: 1.4;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    hyphens: auto;
                    border-radius: 0.5rem;
                ">
                    ${headingText}
                </a>
            `;
        });

        tocContent.innerHTML = tocHTML;

        toc.appendChild(tocHeader);
        toc.appendChild(tocContent);

        // Add hover effects and click handlers to links
        const updateLinkStyles = () => {
            toc.querySelectorAll('.toc-link').forEach(link => {
                const href = link.getAttribute('href');
                const sectionId = href.split('#')[1];
                const section = document.getElementById(sectionId);
                const isH2 = section?.tagName === 'H2';
                
                link.addEventListener('mouseenter', function() {
                    this.style.color = 'var(--color-purple-500)';
                    this.style.background = 'rgba(147, 51, 234, 0.1)';
                    this.style.borderLeftColor = 'var(--color-purple-500)';
                });
                link.addEventListener('mouseleave', function() {
                    // Check if this is the active section
                    const isActive = this.style.fontWeight === '700';
                    if (!isActive) {
                        this.style.color = 'var(--text-secondary)';
                        this.style.background = 'transparent';
                    }
                    this.style.borderLeftColor = isActive ? 'var(--color-purple-500)' : 'transparent';
                });
                
                // Update active state when clicked
                link.addEventListener('click', function() {
                    setTimeout(() => {
                        highlightActiveSection();
                    }, 100);
                });
            });
        };

        // Collapse/Expand functionality - Start collapsed by default
        let isCollapsed = true;
        const toggleBtn = tocHeader.querySelector('.toc-toggle i');
        
        // Set initial collapsed state
        tocContent.style.maxHeight = '0';
        tocContent.style.padding = '0 var(--space-lg)';
        tocContent.style.opacity = '0';
        tocContent.style.overflow = 'hidden';
        toggleBtn.style.transform = 'rotate(180deg)';
        toc.style.maxHeight = '60px';
        tocHeader.style.borderBottom = 'none';
        tocHeader.style.borderRadius = 'var(--radius-lg)';
        toc.classList.add('collapsed');
        
        tocHeader.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            
            if (isCollapsed) {
                tocContent.style.maxHeight = '0';
                tocContent.style.padding = '0 var(--space-lg)';
                tocContent.style.opacity = '0';
                tocContent.style.overflow = 'hidden';
                toggleBtn.style.transform = 'rotate(180deg)';
                toc.style.maxHeight = '60px';
                tocHeader.style.borderBottom = 'none';
                tocHeader.style.borderRadius = 'var(--radius-lg)';
                toc.classList.add('collapsed');
            } else {
                tocContent.style.maxHeight = 'calc(70vh - 60px)';
                tocContent.style.padding = 'var(--space-md) var(--space-lg)';
                tocContent.style.opacity = '1';
                tocContent.style.overflow = 'auto';
                toggleBtn.style.transform = 'rotate(0deg)';
                toc.style.maxHeight = '70vh';
                tocHeader.style.borderBottom = '1px solid var(--glass-border)';
                tocHeader.style.borderRadius = 'var(--radius-lg) var(--radius-lg) 0 0';
                toc.classList.remove('collapsed');
            }
        });

        // Highlight active section on scroll - Improved version
        const highlightActiveSection = () => {
            // Get current scroll position with offset for navbar
            const scrollPos = window.scrollY + 200;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            let activeSection = null;
            let closestDistance = Infinity;
            
            // Find the section closest to the top of the viewport
            headings.forEach((heading) => {
                const rect = heading.getBoundingClientRect();
                const headingTop = window.scrollY + rect.top;
                const distance = Math.abs(scrollPos - headingTop);
                
                // If heading is in viewport or above viewport
                if (headingTop <= scrollPos + 100) {
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        activeSection = heading;
                    }
                }
            });
            
            // Special case: if at the very top, highlight first section
            if (window.scrollY < 100) {
                activeSection = headings[0];
            }
            
            // Special case: if at the very bottom, highlight last section
            if (window.scrollY + windowHeight >= documentHeight - 100) {
                activeSection = headings[headings.length - 1];
            }
            
            // Update all links
            toc.querySelectorAll('.toc-link').forEach(link => {
                const href = link.getAttribute('href');
                const sectionId = href.split('#')[1];
                const section = document.getElementById(sectionId);
                const isH2 = section?.tagName === 'H2';
                const isActive = section === activeSection;
                
                if (isActive) {
                    link.style.color = 'var(--color-purple-500)';
                    link.style.fontWeight = '700';
                    link.style.borderLeftColor = 'var(--color-purple-500)';
                    link.style.background = 'rgba(147, 51, 234, 0.08)';
                } else {
                    link.style.color = 'var(--text-secondary)';
                    link.style.fontWeight = isH2 ? '600' : '400';
                    link.style.borderLeftColor = 'transparent';
                    link.style.background = 'transparent';
                }
            });
        };

        // Only show on larger screens
        if (window.innerWidth > 1400) {
            document.body.appendChild(toc);
            updateLinkStyles();
            
            // Create TOC toggle button
            const tocToggleBtn = document.createElement('button');
            tocToggleBtn.className = 'toc-toggle-btn';
            tocToggleBtn.innerHTML = '<i class="ri-list-check-2"></i>';
            tocToggleBtn.title = 'Table of Contents';
            tocToggleBtn.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                color: var(--text-primary);
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                z-index: 999;
            `;
            
            // Position it alongside reading controls or scroll to top button
            const readingControls = document.querySelector('.reading-controls');
            const scrollTopBtn = document.querySelector('.scroll-to-top');
            
            if (readingControls) {
                // If reading controls exist, position above them
                tocToggleBtn.style.bottom = 'calc(6rem + 70px)'; // Above reading controls
            } else if (scrollTopBtn) {
                // Otherwise position above scroll to top
                tocToggleBtn.style.bottom = 'calc(2rem + 70px)';
            }
            
            document.body.appendChild(tocToggleBtn);
            
            // Toggle TOC visibility
            let tocVisible = false;
            tocToggleBtn.addEventListener('click', () => {
                tocVisible = !tocVisible;
                
                if (tocVisible) {
                    // Show TOC
                    toc.style.opacity = '1';
                    toc.style.visibility = 'visible';
                    toc.style.pointerEvents = 'auto';
                    tocToggleBtn.style.background = 'linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500))';
                    tocToggleBtn.style.color = 'white';
                    tocToggleBtn.style.transform = 'scale(1.1)';
                    
                    // Auto-expand the content if it's collapsed
                    if (isCollapsed) {
                        isCollapsed = false;
                        tocContent.style.maxHeight = 'calc(70vh - 60px)';
                        tocContent.style.padding = 'var(--space-md) var(--space-lg)';
                        tocContent.style.opacity = '1';
                        tocContent.style.overflow = 'auto';
                        toggleBtn.style.transform = 'rotate(0deg)';
                        toc.style.maxHeight = '70vh';
                        tocHeader.style.borderBottom = '1px solid var(--glass-border)';
                        tocHeader.style.borderRadius = 'var(--radius-lg) var(--radius-lg) 0 0';
                        toc.classList.remove('collapsed');
                    }
                } else {
                    toc.style.opacity = '0';
                    toc.style.visibility = 'hidden';
                    toc.style.pointerEvents = 'none';
                    tocToggleBtn.style.background = 'var(--glass-bg)';
                    tocToggleBtn.style.color = 'var(--text-primary)';
                    tocToggleBtn.style.transform = 'scale(1)';
                }
            });
            
            // Close TOC when clicking outside
            document.addEventListener('click', (e) => {
                if (tocVisible && !toc.contains(e.target) && !tocToggleBtn.contains(e.target)) {
                    tocVisible = false;
                    toc.style.opacity = '0';
                    toc.style.visibility = 'hidden';
                    toc.style.pointerEvents = 'none';
                    tocToggleBtn.style.background = 'var(--glass-bg)';
                    tocToggleBtn.style.color = 'var(--text-primary)';
                    tocToggleBtn.style.transform = 'scale(1)';
                }
            });
            
            // Add hover effect to button
            tocToggleBtn.addEventListener('mouseenter', () => {
                if (!tocVisible) {
                    tocToggleBtn.style.transform = 'scale(1.1)';
                    tocToggleBtn.style.boxShadow = '0 6px 30px rgba(147, 51, 234, 0.4)';
                }
            });
            
            tocToggleBtn.addEventListener('mouseleave', () => {
                if (!tocVisible) {
                    tocToggleBtn.style.transform = 'scale(1)';
                    tocToggleBtn.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                }
            });
            
            // Throttle scroll events for better performance
            let scrollTimeout;
            const throttledHighlight = () => {
                if (scrollTimeout) return;
                scrollTimeout = setTimeout(() => {
                    highlightActiveSection();
                    scrollTimeout = null;
                }, 50); // Update every 50ms max
            };
            
            // Add scroll listener for active section highlighting
            window.addEventListener('scroll', throttledHighlight, { passive: true });
            
            // Initial check and update after a short delay to ensure DOM is ready
            setTimeout(() => {
                highlightActiveSection();
            }, 100);
        }
    }

    // ========== ANIMATIONS ==========
    initAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .tutorial-body > * {
                animation: slideUp 0.6s ease-out;
                animation-fill-mode: both;
            }
            
            .tutorial-body > *:nth-child(1) { animation-delay: 0.1s; }
            .tutorial-body > *:nth-child(2) { animation-delay: 0.2s; }
            .tutorial-body > *:nth-child(3) { animation-delay: 0.3s; }
            .tutorial-body > *:nth-child(4) { animation-delay: 0.4s; }
            .tutorial-body > *:nth-child(5) { animation-delay: 0.5s; }
            
            .lesson-card {
                animation: slideUp 0.5s ease-out;
                animation-fill-mode: both;
            }
            
            .lesson-card:nth-child(1) { animation-delay: 0.1s; }
            .lesson-card:nth-child(2) { animation-delay: 0.2s; }
            .lesson-card:nth-child(3) { animation-delay: 0.3s; }
            .lesson-card:nth-child(4) { animation-delay: 0.4s; }
            .lesson-card:nth-child(5) { animation-delay: 0.5s; }
            .lesson-card:nth-child(6) { animation-delay: 0.6s; }
        `;
        document.head.appendChild(style);
    }

    // ========== CONTINUE WHERE YOU LEFT OFF ==========
    initContinueButton() {
        const isIndexPage = window.location.pathname.includes('index.html') || 
                           window.location.pathname.endsWith('/') || 
                           window.location.pathname.endsWith('/Tutorial Hub');
        
        if (!isIndexPage) return;

        const progress = this.getProgress();
        const hasStarted = progress.completed.length > 0 || progress.inProgress.length > 0;
        
        if (!hasStarted) return;

        // Find next lesson to complete
        let nextLesson = null;
        
        // First, check for in-progress lessons
        if (progress.inProgress.length > 0) {
            const firstInProgress = progress.inProgress[0];
            nextLesson = this.lessons.find(l => l.id === firstInProgress);
        } 
        // Otherwise, find first incomplete lesson
        else {
            for (let lesson of this.lessons) {
                if (!progress.completed.includes(lesson.id)) {
                    nextLesson = lesson;
                    break;
                }
            }
        }

        if (!nextLesson) return;

        const heroDescription = document.querySelector('.hero-description');
        if (!heroDescription) return;

        const continueBtn = document.createElement('a');
        continueBtn.href = nextLesson.file;
        continueBtn.className = 'continue-btn';
        continueBtn.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            padding: 1.25rem 2rem;
            background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500));
            border: none;
            border-radius: var(--radius-lg);
            color: white;
            font-weight: 700;
            font-size: 1.0625rem;
            text-decoration: none;
            transition: all 0.3s;
            box-shadow: 0 8px 24px rgba(147, 51, 234, 0.4);
            animation: pulse 2s infinite;
            max-width: 700px;
            margin: var(--space-xl) auto 0;
            width: 100%;
        `;
        continueBtn.innerHTML = `
            <i class="ri-play-circle-fill" style="font-size: 1.5rem;"></i>
            <div style="text-align: left;">
                <div style="font-size: 0.75rem; opacity: 0.9; font-weight: 500; margin-bottom: 0.125rem;">Continue Learning</div>
                <div style="font-size: 0.9375rem;">Lesson ${nextLesson.id}: ${nextLesson.title}</div>
            </div>
        `;

        continueBtn.addEventListener('mouseenter', () => {
            continueBtn.style.transform = 'translateY(-4px) scale(1.05)';
            continueBtn.style.boxShadow = '0 12px 32px rgba(147, 51, 234, 0.6)';
        });

        continueBtn.addEventListener('mouseleave', () => {
            continueBtn.style.transform = 'translateY(0) scale(1)';
            continueBtn.style.boxShadow = '0 8px 24px rgba(147, 51, 234, 0.4)';
        });

        // Insert after the hero description (same as progress bar)
        heroDescription.after(continueBtn);

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { box-shadow: 0 8px 24px rgba(147, 51, 234, 0.4); }
                50% { box-shadow: 0 8px 32px rgba(147, 51, 234, 0.6); }
            }
        `;
        document.head.appendChild(style);
    }

    // ========== LESSON PREREQUISITES ==========
    initPrerequisites() {
        if (!this.currentLesson) return;

        const prerequisites = {
            '07': ['01', '02', '03', '04', '05', '06'],
            '08': ['07'],
            '09': ['08'],
            '10': ['07', '08'],
            '11': ['10'],
            '12': ['03', '08'],
            '13': ['03', '12'],
            '14': ['12'],
            '15': ['10'],
            '16': ['08', '12'],
            '17': ['08', '12'],
            '18': ['12'],
            '19': ['15', '16', '17'],
            '20': ['10', '12', '15', '16', '17', '18']
        };

        const requiredLessons = prerequisites[this.currentLesson];
        if (!requiredLessons || requiredLessons.length === 0) return;

        const progress = this.getProgress();
        const uncompletedPrereqs = requiredLessons.filter(id => !progress.completed.includes(id));

        const header = document.querySelector('.tutorial-header');
        if (!header) return;

        const prereqBox = document.createElement('div');
        prereqBox.style.cssText = `
            margin-top: var(--space-lg);
            padding: var(--space-md);
            background: ${uncompletedPrereqs.length === 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 88, 12, 0.1)'};
            border: 1px solid ${uncompletedPrereqs.length === 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 88, 12, 0.3)'};
            border-radius: var(--radius-md);
            border-left: 4px solid ${uncompletedPrereqs.length === 0 ? 'var(--color-success)' : 'var(--color-orange-600)'};
        `;

        let prereqHTML = `
            <div style="display: flex; align-items: start; gap: 0.75rem;">
                <i class="${uncompletedPrereqs.length === 0 ? 'ri-checkbox-circle-fill' : 'ri-information-line'}" style="font-size: 1.25rem; color: ${uncompletedPrereqs.length === 0 ? 'var(--color-success)' : 'var(--color-orange-600)'}; flex-shrink: 0; margin-top: 0.125rem;"></i>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">
                        ${uncompletedPrereqs.length === 0 ? '✅ Prerequisites Completed!' : '📋 Recommended Prerequisites'}
                    </div>
        `;

        if (uncompletedPrereqs.length === 0) {
            prereqHTML += `<div style="font-size: 0.875rem; color: var(--text-secondary);">You've completed all recommended lessons. Ready to go!</div>`;
        } else {
            prereqHTML += `<div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">We recommend completing these lessons first:</div>`;
            prereqHTML += `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">`;
            
            requiredLessons.forEach(id => {
                const lesson = this.lessons.find(l => l.id === id);
                const isCompleted = progress.completed.includes(id);
                prereqHTML += `
                    <a href="${lesson.file}" style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.375rem 0.75rem; background: ${isCompleted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 88, 12, 0.15)'}; border: 1px solid ${isCompleted ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 88, 12, 0.3)'}; border-radius: 50px; font-size: 0.8125rem; font-weight: 600; color: ${isCompleted ? 'var(--color-success)' : 'var(--color-orange-600)'}; text-decoration: none; transition: all 0.2s;">
                        ${isCompleted ? '<i class="ri-check-line"></i>' : `<span>Lesson ${id}</span>`}
                        ${isCompleted ? `<span>Lesson ${id}</span>` : ''}
                    </a>
                `;
            });
            
            prereqHTML += `</div>`;
        }

        prereqHTML += `</div></div>`;
        prereqBox.innerHTML = prereqHTML;

        header.appendChild(prereqBox);
    }

    // ========== ACHIEVEMENTS ==========
    checkAchievements() {
        const progress = this.getProgress();
        const completed = progress.completed.length;
        const achievements = this.getAchievements();

        const levels = {
            beginner: this.lessons.filter(l => l.level === 'beginner').length,
            intermediate: this.lessons.filter(l => l.level === 'intermediate').length,
            advanced: this.lessons.filter(l => l.level === 'advanced').length
        };

        const completedByLevel = {
            beginner: progress.completed.filter(id => {
                const lesson = this.lessons.find(l => l.id === id);
                return lesson && lesson.level === 'beginner';
            }).length,
            intermediate: progress.completed.filter(id => {
                const lesson = this.lessons.find(l => l.id === id);
                return lesson && lesson.level === 'intermediate';
            }).length,
            advanced: progress.completed.filter(id => {
                const lesson = this.lessons.find(l => l.id === id);
                return lesson && lesson.level === 'advanced';
            }).length
        };

        // Check for new achievements
        if (completedByLevel.beginner === levels.beginner && !achievements.includes('beginner-master')) {
            this.unlockAchievement('beginner-master', 'Beginner Master', '🌱', 'Completed all beginner lessons!');
        }
        if (completedByLevel.intermediate === levels.intermediate && !achievements.includes('intermediate-expert')) {
            this.unlockAchievement('intermediate-expert', 'Intermediate Expert', '🌿', 'Completed all intermediate lessons!');
        }
        if (completedByLevel.advanced === levels.advanced && !achievements.includes('advanced-guru')) {
            this.unlockAchievement('advanced-guru', 'Advanced Guru', '🚀', 'Completed all advanced lessons!');
        }
        if (completed === this.lessons.length && !achievements.includes('complete-master')) {
            this.unlockAchievement('complete-master', 'iPseudo Master', '👑', 'Completed ALL lessons! You are a master!');
        }
    }

    getAchievements() {
        const stored = localStorage.getItem('tutorial-achievements');
        return stored ? JSON.parse(stored) : [];
    }

    unlockAchievement(id, title, emoji, description) {
        const achievements = this.getAchievements();
        achievements.push(id);
        localStorage.setItem('tutorial-achievements', JSON.stringify(achievements));

        const badge = document.createElement('div');
        badge.className = 'achievement-unlock';
        badge.innerHTML = `
            <div style="position: fixed; bottom: 2rem; left: 2rem; z-index: 10001; background: var(--glass-bg); border: 2px solid var(--color-success); border-radius: var(--radius-lg); padding: var(--space-lg); backdrop-filter: blur(20px); animation: slideUp 0.5s; box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3); max-width: 300px;">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${emoji}</div>
                <div style="font-weight: 700; font-size: 1.125rem; color: var(--text-primary); margin-bottom: 0.25rem;">Achievement Unlocked!</div>
                <div style="font-weight: 600; color: var(--color-success); margin-bottom: 0.25rem;">${title}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">${description}</div>
            </div>
        `;

        document.body.appendChild(badge);
        setTimeout(() => badge.remove(), 5000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TutorialFeatures();
    });
} else {
    new TutorialFeatures();
}

