// Quiz Results Application
let lessonId;
let quizManager;
let results;

document.addEventListener('DOMContentLoaded', function() {
    // Get lesson ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    lessonId = parseInt(urlParams.get('lesson'));
    
    if (!lessonId || !quizData[lessonId]) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize quiz manager
    quizManager = new QuizManager(lessonId);
    results = quizManager.getResults();
    
    if (!results) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display results
    displayResults();
    
    // Display review
    displayReview();
    
    // Celebration for good scores
    if (results.percentage >= 80) {
        celebrate();
    }
});

function displayResults() {
    const quiz = quizManager.quiz;
    const message = QuizManager.getPerformanceMessage(results.percentage);
    const grade = QuizManager.getGrade(results.percentage);
    const isPerfect = results.percentage === 100;
    const passed = results.passed;
    
    const resultsHTML = `
        <div style="margin-bottom: 2rem;">
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; background: linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(59, 130, 246, 0.15)); border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 50px; font-size: 0.875rem; font-weight: 600; color: var(--color-purple-500); margin-bottom: 1rem;">
                <i class="ri-trophy-line"></i>
                <span>${quiz.title}</span>
            </div>
        </div>
        
        <div class="results-score-circle ${isPerfect ? 'perfect' : ''}">
            <span class="results-percentage ${isPerfect ? 'perfect' : ''}">${results.percentage}%</span>
        </div>
        
        <h1 class="results-message">${message}</h1>
        
        <p style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 2rem;">
            ${passed ? 'Congratulations! You passed the quiz!' : 'Keep practicing! You can retake the quiz to improve your score.'}
        </p>
        
        <div class="results-stats">
            <div class="results-stat">
                <div class="results-stat-value">${results.score}/${results.total}</div>
                <div class="results-stat-label">Correct Answers</div>
            </div>
            <div class="results-stat">
                <div class="results-stat-value">${grade}</div>
                <div class="results-stat-label">Grade</div>
            </div>
            <div class="results-stat">
                <div class="results-stat-value">${QuizManager.formatTime(results.timeSpent)}</div>
                <div class="results-stat-label">Time Spent</div>
            </div>
        </div>
        
        <div class="results-actions">
            <a href="${quiz.lessonUrl}" class="quiz-nav-btn" style="text-decoration: none;">
                <i class="ri-book-open-line"></i>
                Review Lesson
            </a>
            <button class="quiz-nav-btn" onclick="retakeQuiz()">
                <i class="ri-refresh-line"></i>
                Retake Quiz
            </button>
            <a href="index.html" class="quiz-nav-btn primary" style="text-decoration: none;">
                <i class="ri-arrow-right-line"></i>
                More Quizzes
            </a>
        </div>
    `;
    
    document.getElementById('resultsContent').innerHTML = resultsHTML;
}

function displayReview() {
    const quiz = quizManager.quiz;
    let reviewHTML = '';
    
    quiz.questions.forEach((question, index) => {
        const userAnswer = results.answers[index];
        const isCorrect = userAnswer === question.correct;
        const correctAnswer = question.options[question.correct];
        const userAnswerText = userAnswer !== null ? question.options[userAnswer] : 'Not answered';
        
        reviewHTML += `
            <div class="question-card" style="margin-bottom: 2rem;">
                <div class="question-number">
                    <i class="${isCorrect ? 'ri-check-line' : 'ri-close-line'}"></i>
                    Question ${index + 1}
                </div>
                
                <h3 class="question-text">${question.question}</h3>
                
                ${question.code ? `
                    <div class="question-code">
                        <pre><code>${escapeHtml(question.code)}</code></pre>
                    </div>
                ` : ''}
                
                <div class="answer-options">
                    ${question.options.map((option, optionIndex) => {
                        let optionClass = '';
                        if (optionIndex === question.correct) {
                            optionClass = 'correct';
                        } else if (optionIndex === userAnswer && !isCorrect) {
                            optionClass = 'incorrect';
                        }
                        
                        return `
                            <div class="answer-option disabled ${optionClass}">
                                <div class="answer-radio">
                                    <i class="${optionIndex === question.correct ? 'ri-check-line' : optionIndex === userAnswer ? 'ri-close-line' : ''}"></i>
                                </div>
                                <span class="answer-text">${escapeHtml(option)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="feedback-box ${isCorrect ? 'correct' : 'incorrect'}" style="display: block; margin-top: 1.5rem;">
                    <div class="feedback-header">
                        <i class="feedback-icon ${isCorrect ? 'ri-check-circle-fill' : 'ri-close-circle-fill'}"></i>
                        <h4 class="feedback-title">${isCorrect ? 'Correct!' : 'Incorrect'}</h4>
                    </div>
                    <p class="feedback-text">
                        ${question.explanation}
                        ${!isCorrect ? `<br><br><strong>Your answer:</strong> ${userAnswerText}<br><strong>Correct answer:</strong> ${correctAnswer}` : ''}
                    </p>
                </div>
            </div>
        `;
    });
    
    document.getElementById('reviewContent').innerHTML = reviewHTML;
}

function retakeQuiz() {
    if (confirm('Are you sure you want to retake this quiz? Your current score will be replaced.')) {
        quizManager.reset();
        window.location.href = `quiz.html?lesson=${lessonId}`;
    }
}

function celebrate() {
    // Confetti animation for good scores
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

