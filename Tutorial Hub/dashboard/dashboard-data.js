// Dashboard Data Aggregator
class DashboardData {
    constructor() {
        this.lessonProgress = this.getLessonProgress();
        this.quizResults = this.getQuizResults();
        this.quizStats = this.getQuizStats();
        this.certificates = this.getCertificates();
    }
    
    // Get lesson progress (synchronized with tutorial-features.js)
    getLessonProgress() {
        // Read from the same localStorage key that tutorial-features.js uses
        const tutorialProgress = localStorage.getItem('tutorial-progress');
        if (!tutorialProgress) return {};
        
        const parsed = JSON.parse(tutorialProgress);
        // Convert tutorial-progress format to dashboard format
        // Tutorial format: { completed: ['01', '02'], inProgress: ['03'] }
        // Dashboard format: { 'lesson-1': 'completed', 'lesson-2': 'completed', 'lesson-3': 'in-progress' }
        const converted = {};
        
        if (parsed.completed) {
            parsed.completed.forEach(id => {
                const lessonNum = parseInt(id);
                converted[`lesson-${lessonNum}`] = 'completed';
            });
        }
        
        if (parsed.inProgress) {
            parsed.inProgress.forEach(id => {
                const lessonNum = parseInt(id);
                converted[`lesson-${lessonNum}`] = 'in-progress';
            });
        }
        
        return converted;
    }
    
    // Get quiz results
    getQuizResults() {
        const stored = localStorage.getItem('quizResults');
        return stored ? JSON.parse(stored) : {};
    }
    
    // Get quiz stats
    getQuizStats() {
        const stored = localStorage.getItem('quizStats');
        return stored ? JSON.parse(stored) : {
            totalQuizzes: 0,
            totalPassed: 0,
            averageScore: 0,
            totalTimeSpent: 0
        };
    }
    
    // Get certificates
    getCertificates() {
        const stored = localStorage.getItem('issuedCertificates');
        return stored ? JSON.parse(stored) : {};
    }
    
    // Count completed lessons
    getCompletedLessonsCount() {
        return Object.values(this.lessonProgress).filter(status => status === 'completed').length;
    }
    
    // Count in-progress lessons
    getInProgressLessonsCount() {
        return Object.values(this.lessonProgress).filter(status => status === 'in-progress').length;
    }
    
    // Get overall progress percentage
    getOverallProgress() {
        const completed = this.getCompletedLessonsCount();
        return Math.round((completed / 20) * 100);
    }
    
    // Get next recommended lesson
    getNextLesson() {
        for (let i = 1; i <= 20; i++) {
            const status = this.lessonProgress[`lesson-${i}`];
            if (status !== 'completed') {
                return i;
            }
        }
        return null;
    }
    
    // Get recent activity (last 10 items)
    getRecentActivity() {
        const activities = [];
        
        // Get lesson timestamps (synchronized with tutorial-features.js)
        const timestamps = JSON.parse(localStorage.getItem('lesson-timestamps') || '{}');
        
        // Add completed lessons
        Object.entries(this.lessonProgress).forEach(([key, status]) => {
            if (status === 'completed') {
                const lessonNum = parseInt(key.replace('lesson-', ''));
                const lessonId = String(lessonNum).padStart(2, '0');
                activities.push({
                    type: 'lesson',
                    lessonNum: lessonNum,
                    title: `Completed Lesson ${lessonNum}`,
                    time: timestamps[lessonId] || Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000)
                });
            }
        });
        
        // Add quiz attempts
        Object.values(this.quizResults).forEach(result => {
            activities.push({
                type: 'quiz',
                lessonNum: result.lessonId,
                title: `Quiz ${result.lessonId}: ${result.percentage}%`,
                time: result.completedAt,
                score: result.percentage
            });
        });
        
        // Add certificates
        Object.values(this.certificates).forEach(cert => {
            activities.push({
                type: 'certificate',
                title: `Earned: ${cert.certificateTitle}`,
                time: cert.issuedAt
            });
        });
        
        // Sort by time and return last 10
        activities.sort((a, b) => b.time - a.time);
        return activities.slice(0, 10);
    }
    
    // Get recommendations based on progress
    getRecommendations() {
        const recommendations = [];
        const completed = this.getCompletedLessonsCount();
        const inProgress = this.getInProgressLessonsCount();
        
        // Recommend next lesson
        const nextLesson = this.getNextLesson();
        if (nextLesson) {
            recommendations.push({
                type: 'lesson',
                priority: 'high',
                title: `Continue with Lesson ${nextLesson}`,
                description: 'Pick up where you left off and keep your momentum going!',
                action: `../index.html#lessons`,
                icon: 'ri-book-open-line'
            });
        }
        
        // Recommend quiz if lessons completed but no quizzes
        if (completed > 0 && this.quizStats.totalQuizzes === 0) {
            recommendations.push({
                type: 'quiz',
                priority: 'high',
                title: 'Test Your Knowledge',
                description: 'You\'ve completed lessons but haven\'t taken any quizzes. Test yourself!',
                action: '../quizzes/index.html',
                icon: 'ri-question-answer-line'
            });
        }
        
        // Recommend retaking low-score quizzes
        const lowScoreQuizzes = Object.values(this.quizResults).filter(r => r.percentage < 80);
        if (lowScoreQuizzes.length > 0) {
            recommendations.push({
                type: 'quiz',
                priority: 'medium',
                title: 'Improve Your Quiz Scores',
                description: `You have ${lowScoreQuizzes.length} quiz(es) with score below 80%. Retake to improve!`,
                action: '../quizzes/index.html',
                icon: 'ri-refresh-line'
            });
        }
        
        // Recommend exercises
        if (completed >= 3) {
            recommendations.push({
                type: 'exercise',
                priority: 'medium',
                title: 'Practice with Exercises',
                description: 'Reinforce your learning with hands-on coding exercises.',
                action: '../Exercises/exercises-index.html',
                icon: 'ri-pencil-line'
            });
        }
        
        // Check for certificate eligibility
        if (completed >= 6 && Object.keys(this.certificates).length === 0) {
            recommendations.push({
                type: 'certificate',
                priority: 'high',
                title: 'Claim Your Certificate!',
                description: 'You\'re eligible for a certificate! Check which ones you can download.',
                action: '../certificates/index.html',
                icon: 'ri-award-line'
            });
        }
        
        return recommendations;
    }
    
    // Analyze strengths and weaknesses based on quiz scores
    analyzePerformance() {
        const strengths = [];
        const weaknesses = [];
        
        const topicScores = {
            'Variables & Data': [],
            'Operators': [],
            'Conditionals': [],
            'Loops': [],
            'Functions': [],
            'Arrays': [],
            'Recursion': [],
            'Algorithms': []
        };
        
        // Map quiz results to topics
        Object.entries(this.quizResults).forEach(([lessonId, result]) => {
            const id = parseInt(lessonId);
            if (id === 3) topicScores['Variables & Data'].push(result.percentage);
            if (id === 5) topicScores['Operators'].push(result.percentage);
            if (id === 7) topicScores['Conditionals'].push(result.percentage);
            if (id === 8) topicScores['Loops'].push(result.percentage);
            if (id === 10) topicScores['Functions'].push(result.percentage);
            if (id === 12) topicScores['Arrays'].push(result.percentage);
            if (id === 15) topicScores['Recursion'].push(result.percentage);
            if (id === 16) topicScores['Algorithms'].push(result.percentage);
        });
        
        // Calculate average per topic
        Object.entries(topicScores).forEach(([topic, scores]) => {
            if (scores.length > 0) {
                const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
                if (avg >= 80) {
                    strengths.push({ topic, score: Math.round(avg) });
                } else if (avg < 70) {
                    weaknesses.push({ topic, score: Math.round(avg) });
                }
            }
        });
        
        return { strengths, weaknesses };
    }
    
    // Get study distribution by level
    getStudyDistribution() {
        const beginnerLessons = [1, 2, 3, 4, 5, 6];
        const intermediateLessons = [7, 8, 9, 10, 11, 12, 13];
        const advancedLessons = [14, 15, 16, 17, 18, 19, 20];
        
        const beginner = beginnerLessons.filter(id => 
            this.lessonProgress[`lesson-${id}`] === 'completed'
        ).length;
        
        const intermediate = intermediateLessons.filter(id => 
            this.lessonProgress[`lesson-${id}`] === 'completed'
        ).length;
        
        const advanced = advancedLessons.filter(id => 
            this.lessonProgress[`lesson-${id}`] === 'completed'
        ).length;
        
        return { beginner, intermediate, advanced };
    }
    
    // Format time ago
    static timeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        return `${Math.floor(seconds / 604800)} weeks ago`;
    }
}

