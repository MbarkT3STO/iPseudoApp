// Quiz Application Logic
let quizManager;
let lessonId;

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
    quizManager.start();
    
    // Initialize progress bar to 0
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressText').textContent = `0/${quizManager.quiz.questions.length}`;
    
    // Display quiz header
    displayQuizHeader();
    
    // Display first question (this will update progress)
    displayQuestion();
    
    // Update navigation buttons
    updateNavigationButtons();
});

function displayQuizHeader() {
    const quiz = quizManager.quiz;
    const metadata = quizMetadata[lessonId];
    
    const headerHTML = `
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; background: linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(59, 130, 246, 0.15)); border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 50px; font-size: 0.875rem; font-weight: 600; color: var(--color-purple-500); margin-bottom: 1rem;">
            <i class="ri-question-line"></i>
            <span>Lesson ${lessonId} Quiz</span>
        </div>
        
        <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-primary);">
            ${quiz.title}
        </h1>
        
        <p style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
            ${quiz.description}
        </p>
        
        <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary);">
                <i class="ri-question-line" style="color: var(--color-purple-500);"></i>
                <span>${metadata.questions} Questions</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary);">
                <i class="ri-time-line" style="color: var(--color-blue-500);"></i>
                <span>${metadata.duration}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary);">
                <i class="ri-bar-chart-line" style="color: #f59e0b;"></i>
                <span style="text-transform: capitalize;">${quiz.level}</span>
            </div>
        </div>
    `;
    
    document.getElementById('quizHeader').innerHTML = headerHTML;
}

function displayQuestion() {
    const question = quizManager.getCurrentQuestion();
    const questionIndex = quizManager.currentQuestion;
    const savedAnswer = quizManager.getAnswer(questionIndex);
    
    let questionHTML = `
        <div class="question-card">
            <div class="question-number">
                <i class="ri-question-line"></i>
                Question ${questionIndex + 1} of ${quizManager.quiz.questions.length}
            </div>
            
            <h2 class="question-text">${question.question}</h2>
    `;
    
    // Add code block if present
    if (question.code) {
        questionHTML += `
            <div class="question-code">
                <pre><code>${escapeHtml(question.code)}</code></pre>
            </div>
        `;
    }
    
    // Add answer options
    questionHTML += '<div class="answer-options">';
    
    question.options.forEach((option, index) => {
        const isSelected = savedAnswer === index;
        const selectedClass = isSelected ? 'selected' : '';
        
        questionHTML += `
            <div class="answer-option ${selectedClass}" onclick="selectAnswer(${index})">
                <div class="answer-radio">
                    <i class="ri-check-line"></i>
                </div>
                <span class="answer-text">${escapeHtml(option)}</span>
            </div>
        `;
    });
    
    questionHTML += '</div></div>';
    
    document.getElementById('questionContainer').innerHTML = questionHTML;
    
    // Update progress bar
    updateProgress();
}

function selectAnswer(answerIndex) {
    quizManager.setAnswer(answerIndex);
    
    // Update UI
    const options = document.querySelectorAll('.answer-option');
    options.forEach((option, index) => {
        if (index === answerIndex) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update progress
    updateProgress();
}

function nextQuestion() {
    const hasNext = quizManager.next();
    
    if (hasNext) {
        displayQuestion();
        updateNavigationButtons();
        scrollToTop();
    } else {
        // Last question - show submit button
        if (quizManager.allAnswered()) {
            submitQuiz();
        } else {
            alert('Please answer all questions before submitting.');
        }
    }
}

function previousQuestion() {
    const hasPrevious = quizManager.previous();
    
    if (hasPrevious) {
        displayQuestion();
        updateNavigationButtons();
        scrollToTop();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Previous button
    if (quizManager.currentQuestion === 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
    
    // Next button
    const isLastQuestion = quizManager.currentQuestion === quizManager.quiz.questions.length - 1;
    const currentAnswer = quizManager.getAnswer(quizManager.currentQuestion);
    
    if (isLastQuestion) {
        nextBtn.innerHTML = '<i class="ri-send-plane-fill"></i> Submit Quiz';
        nextBtn.disabled = !quizManager.allAnswered();
    } else {
        nextBtn.innerHTML = 'Next <i class="ri-arrow-right-line"></i>';
        nextBtn.disabled = currentAnswer === null;
    }
}

function updateProgress() {
    if (!quizManager) return;
    
    const answered = quizManager.answers.filter(answer => answer !== null).length;
    const total = quizManager.quiz.questions.length;
    const progressPercentage = total > 0 ? (answered / total) * 100 : 0;
    
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) {
        progressBar.style.setProperty('width', progressPercentage + '%', 'important');
    }
    
    if (progressText) {
        progressText.textContent = `${answered}/${total}`;
    }
}

function submitQuiz() {
    const results = quizManager.submit();
    
    // Show results page
    window.location.href = `results.html?lesson=${lessonId}`;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

