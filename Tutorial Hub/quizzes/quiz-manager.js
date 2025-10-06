// Quiz Manager - Handles quiz logic, scoring, and progress
class QuizManager {
    constructor(lessonId) {
        this.lessonId = lessonId;
        this.quiz = quizData[lessonId];
        this.currentQuestion = 0;
        this.answers = new Array(this.quiz.questions.length).fill(null);
        this.score = 0;
        this.startTime = null;
        this.endTime = null;
    }

    // Start the quiz
    start() {
        this.startTime = Date.now();
        this.currentQuestion = 0;
        this.answers = new Array(this.quiz.questions.length).fill(null);
        this.score = 0;
    }

    // Get current question
    getCurrentQuestion() {
        return this.quiz.questions[this.currentQuestion];
    }

    // Check if answer is correct
    isCorrect(questionIndex, answerIndex) {
        return this.quiz.questions[questionIndex].correct === answerIndex;
    }

    // Set answer for current question
    setAnswer(answerIndex) {
        this.answers[this.currentQuestion] = answerIndex;
    }

    // Get answer for a question
    getAnswer(questionIndex) {
        return this.answers[questionIndex];
    }

    // Move to next question
    next() {
        if (this.currentQuestion < this.quiz.questions.length - 1) {
            this.currentQuestion++;
            return true;
        }
        return false;
    }

    // Move to previous question
    previous() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            return true;
        }
        return false;
    }

    // Go to specific question
    goToQuestion(index) {
        if (index >= 0 && index < this.quiz.questions.length) {
            this.currentQuestion = index;
            return true;
        }
        return false;
    }

    // Calculate score
    calculateScore() {
        this.score = 0;
        this.quiz.questions.forEach((question, index) => {
            if (this.answers[index] === question.correct) {
                this.score++;
            }
        });
        return this.score;
    }

    // Get percentage score
    getPercentage() {
        return Math.round((this.score / this.quiz.questions.length) * 100);
    }

    // Submit quiz and save results
    submit() {
        this.endTime = Date.now();
        this.calculateScore();
        
        const results = {
            lessonId: this.lessonId,
            score: this.score,
            total: this.quiz.questions.length,
            percentage: this.getPercentage(),
            answers: this.answers,
            timeSpent: Math.round((this.endTime - this.startTime) / 1000), // in seconds
            completedAt: this.endTime,
            passed: this.getPercentage() >= 60
        };

        this.saveResults(results);
        return results;
    }

    // Save results to localStorage
    saveResults(results) {
        const quizResults = this.getStoredResults();
        quizResults[this.lessonId] = results;
        localStorage.setItem('quizResults', JSON.stringify(quizResults));

        // Update quiz stats
        this.updateQuizStats(results);
    }

    // Get stored results for all quizzes
    getStoredResults() {
        const stored = localStorage.getItem('quizResults');
        return stored ? JSON.parse(stored) : {};
    }

    // Get results for this quiz
    getResults() {
        const results = this.getStoredResults();
        return results[this.lessonId] || null;
    }

    // Update quiz statistics
    updateQuizStats(results) {
        let stats = JSON.parse(localStorage.getItem('quizStats')) || {
            totalQuizzes: 0,
            totalPassed: 0,
            totalScore: 0,
            totalQuestions: 0,
            totalTimeSpent: 0,
            completedQuizzes: [],
            averageScore: 0
        };

        const quizIndex = stats.completedQuizzes.indexOf(this.lessonId);
        const isFirstAttempt = quizIndex === -1;

        if (isFirstAttempt) {
            stats.totalQuizzes++;
            stats.completedQuizzes.push(this.lessonId);
        }

        if (results.passed && isFirstAttempt) {
            stats.totalPassed++;
        }

        stats.totalScore = 0;
        stats.totalQuestions = 0;
        stats.totalTimeSpent = 0;

        // Recalculate from all quiz results
        const allResults = this.getStoredResults();
        Object.values(allResults).forEach(result => {
            stats.totalScore += result.score;
            stats.totalQuestions += result.total;
            stats.totalTimeSpent += result.timeSpent;
        });

        stats.averageScore = stats.totalQuestions > 0 
            ? Math.round((stats.totalScore / stats.totalQuestions) * 100)
            : 0;

        localStorage.setItem('quizStats', JSON.stringify(stats));
    }

    // Get quiz statistics
    static getQuizStats() {
        const stored = localStorage.getItem('quizStats');
        return stored ? JSON.parse(stored) : {
            totalQuizzes: 0,
            totalPassed: 0,
            totalScore: 0,
            totalQuestions: 0,
            totalTimeSpent: 0,
            completedQuizzes: [],
            averageScore: 0
        };
    }

    // Check if quiz is completed
    isCompleted() {
        const results = this.getStoredResults();
        return results.hasOwnProperty(this.lessonId);
    }

    // Reset quiz
    reset() {
        const quizResults = this.getStoredResults();
        delete quizResults[this.lessonId];
        localStorage.setItem('quizResults', JSON.stringify(quizResults));
        
        // Update stats
        const stats = QuizManager.getQuizStats();
        const index = stats.completedQuizzes.indexOf(this.lessonId);
        if (index > -1) {
            stats.completedQuizzes.splice(index, 1);
            stats.totalQuizzes = Math.max(0, stats.totalQuizzes - 1);
            localStorage.setItem('quizStats', JSON.stringify(stats));
        }
    }

    // Check if all questions are answered
    allAnswered() {
        return this.answers.every(answer => answer !== null);
    }

    // Get progress percentage
    getProgress() {
        const answered = this.answers.filter(a => a !== null).length;
        return Math.round((answered / this.quiz.questions.length) * 100);
    }

    // Format time spent
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    }

    // Get performance message
    static getPerformanceMessage(percentage) {
        if (percentage === 100) return "Perfect Score! 🎉";
        if (percentage >= 90) return "Excellent! 🌟";
        if (percentage >= 80) return "Great Job! 👏";
        if (percentage >= 70) return "Good Work! 👍";
        if (percentage >= 60) return "Passed! ✓";
        return "Keep Practicing! 💪";
    }

    // Get grade
    static getGrade(percentage) {
        if (percentage >= 90) return "A";
        if (percentage >= 80) return "B";
        if (percentage >= 70) return "C";
        if (percentage >= 60) return "D";
        return "F";
    }
}

// Export for use in quiz pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizManager;
}

