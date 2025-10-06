// Quiz Index Page Logic
document.addEventListener('DOMContentLoaded', function() {
    const stats = QuizManager.getQuizStats();
    const quizResults = new QuizManager(1).getStoredResults();
    
    // Display overall stats
    displayOverallStats(stats);
    
    // Display all quizzes
    displayQuizzes();
    
    // Setup filter buttons
    setupFilters();
});

function displayOverallStats(stats) {
    const statsContainer = document.getElementById('overallStats');
    
    const statsHTML = `
        <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; backdrop-filter: blur(10px);">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                <i class="ri-trophy-line" style="font-size: 2rem; color: var(--color-purple-500);"></i>
                <div>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--text-primary);">${stats.totalQuizzes}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 600;">Quizzes Taken</div>
                </div>
            </div>
        </div>
        
        <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; backdrop-filter: blur(10px);">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                <i class="ri-percent-line" style="font-size: 2rem; color: var(--color-blue-500);"></i>
                <div>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--text-primary);">${stats.averageScore}%</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 600;">Average Score</div>
                </div>
            </div>
        </div>
        
        <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; backdrop-filter: blur(10px);">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                <i class="ri-check-double-line" style="font-size: 2rem; color: #10b981;"></i>
                <div>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--text-primary);">${stats.totalPassed}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 600;">Passed</div>
                </div>
            </div>
        </div>
        
        <div style="padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; backdrop-filter: blur(10px);">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                <i class="ri-time-line" style="font-size: 2rem; color: #f59e0b;"></i>
                <div>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--text-primary);">${QuizManager.formatTime(stats.totalTimeSpent)}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 600;">Time Spent</div>
                </div>
            </div>
        </div>
    `;
    
    statsContainer.innerHTML = statsHTML;
}

function displayQuizzes() {
    const beginnerContainer = document.getElementById('beginnerQuizzes');
    const intermediateContainer = document.getElementById('intermediateQuizzes');
    const advancedContainer = document.getElementById('advancedQuizzes');
    
    const quizResults = new QuizManager(1).getStoredResults();
    
    // Display quizzes by level
    for (const [lessonId, quiz] of Object.entries(quizData)) {
        const metadata = quizMetadata[lessonId];
        const result = quizResults[lessonId];
        const card = createQuizCard(lessonId, quiz, metadata, result);
        
        if (quiz.level === 'beginner') {
            beginnerContainer.innerHTML += card;
        } else if (quiz.level === 'intermediate') {
            intermediateContainer.innerHTML += card;
        } else if (quiz.level === 'advanced') {
            advancedContainer.innerHTML += card;
        }
    }
}

function createQuizCard(lessonId, quiz, metadata, result) {
    const isCompleted = result !== undefined;
    const statusClass = isCompleted ? 'completed' : 'not-attempted';
    const statusIcon = isCompleted ? 'ri-check-line' : 'ri-time-line';
    const statusText = isCompleted ? 'Completed' : 'Not Attempted';
    
    const actionButton = isCompleted 
        ? `<button class="quiz-action retake" onclick="startQuiz(${lessonId})">
               <i class="ri-refresh-line"></i> Retake Quiz
           </button>`
        : `<button class="quiz-action" onclick="startQuiz(${lessonId})">
               <i class="ri-play-line"></i> Start Quiz
           </button>`;
    
    const scoreDisplay = isCompleted 
        ? `<div class="quiz-score">
               <span class="quiz-score-label">Your Score</span>
               <span class="quiz-score-value ${result.percentage === 100 ? 'perfect' : ''}">${result.percentage}%</span>
           </div>`
        : '';
    
    return `
        <div class="quiz-card ${statusClass}" data-level="${quiz.level}" data-status="${statusClass}">
            <div class="quiz-header">
                <div class="quiz-number">${lessonId}</div>
                <div class="quiz-status ${statusClass}">
                    <i class="${statusIcon}"></i>
                    <span>${statusText}</span>
                </div>
            </div>
            
            <h3 class="quiz-title">${quiz.title}</h3>
            <p class="quiz-description">${quiz.description}</p>
            
            <div class="quiz-meta">
                <div class="quiz-meta-item">
                    <i class="ri-question-line"></i>
                    <span>${metadata.questions} Questions</span>
                </div>
                <div class="quiz-meta-item">
                    <i class="ri-time-line"></i>
                    <span>${metadata.duration}</span>
                </div>
                <div class="quiz-meta-item">
                    <i class="ri-bar-chart-line"></i>
                    <span>${capitalizeFirst(quiz.level)}</span>
                </div>
            </div>
            
            ${scoreDisplay}
            ${actionButton}
        </div>
    `;
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterQuizzes(filter);
        });
    });
}

function filterQuizzes(filter) {
    const quizCards = document.querySelectorAll('.quiz-card');
    const sections = document.querySelectorAll('.quiz-section');
    
    if (filter === 'all') {
        quizCards.forEach(card => card.style.display = 'block');
        sections.forEach(section => section.style.display = 'block');
    } else if (filter === 'completed') {
        sections.forEach(section => section.style.display = 'block');
        quizCards.forEach(card => {
            if (card.dataset.status === 'completed') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        hideEmptySections();
    } else if (filter === 'not-attempted') {
        sections.forEach(section => section.style.display = 'block');
        quizCards.forEach(card => {
            if (card.dataset.status === 'not-attempted') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        hideEmptySections();
    } else {
        // Filter by level
        sections.forEach(section => {
            if (section.dataset.level === filter) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
        quizCards.forEach(card => card.style.display = 'block');
    }
}

function hideEmptySections() {
    const sections = document.querySelectorAll('.quiz-section');
    sections.forEach(section => {
        const visibleCards = section.querySelectorAll('.quiz-card[style*="display: block"]');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        }
    });
}

function startQuiz(lessonId) {
    window.location.href = `quiz.html?lesson=${lessonId}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

