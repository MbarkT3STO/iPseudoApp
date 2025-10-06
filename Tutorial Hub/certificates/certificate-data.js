// Certificate Definitions
const certificateTypes = {
    // Individual Level Certificates
    beginner: {
        id: 'beginner',
        title: 'Beginner Level Mastery',
        subtitle: 'Foundation Concepts',
        icon: 'ri-seedling-line',
        description: 'Successfully completed all Beginner level lessons',
        color: '#22c55e',
        requirements: {
            lessons: [1, 2, 3, 4, 5, 6],
            minScore: 60 // Minimum quiz average for lessons with quizzes
        },
        certificateText: 'has successfully completed the Beginner Level of the iPseudo Tutorial Hub, demonstrating proficiency in foundational pseudocode concepts including variables, data types, input/output, operators, and documentation best practices.'
    },
    
    intermediate: {
        id: 'intermediate',
        title: 'Intermediate Level Mastery',
        subtitle: 'Control Flow & Functions',
        icon: 'ri-plant-line',
        description: 'Successfully completed all Intermediate level lessons',
        color: '#3b82f6',
        requirements: {
            lessons: [7, 8, 9, 10, 11, 12, 13],
            minScore: 60
        },
        certificateText: 'has successfully completed the Intermediate Level of the iPseudo Tutorial Hub, demonstrating mastery of conditional statements, loops, functions, procedures, arrays, and string operations.'
    },
    
    advanced: {
        id: 'advanced',
        title: 'Advanced Level Mastery',
        subtitle: 'Algorithms & Advanced Topics',
        icon: 'ri-rocket-line',
        description: 'Successfully completed all Advanced level lessons',
        color: '#9333ea',
        requirements: {
            lessons: [14, 15, 16, 17, 18, 19, 20],
            minScore: 60
        },
        certificateText: 'has successfully completed the Advanced Level of the iPseudo Tutorial Hub, demonstrating expertise in multidimensional arrays, recursion, sorting algorithms, searching algorithms, data structures, algorithm design patterns, and code optimization.'
    },
    
    // Master Certificate
    master: {
        id: 'master',
        title: 'iPseudo Master',
        subtitle: 'Complete Mastery',
        icon: 'ri-trophy-line',
        description: 'Completed ALL 20 lessons with excellence',
        color: '#fbbf24',
        requirements: {
            lessons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            minScore: 70 // Higher standard for master
        },
        certificateText: 'has achieved the prestigious title of iPseudo Master by successfully completing all 20 lessons of the iPseudo Tutorial Hub, demonstrating comprehensive mastery of pseudocode programming from foundational concepts to advanced algorithms and best practices.'
    },
    
    // Quiz Excellence Certificates
    quizAce: {
        id: 'quizAce',
        title: 'Quiz Ace',
        subtitle: 'Perfect Quiz Performance',
        icon: 'ri-star-line',
        description: 'Achieved 100% on 5 or more quizzes',
        color: '#f59e0b',
        requirements: {
            perfectQuizzes: 5
        },
        certificateText: 'has demonstrated exceptional mastery of iPseudo concepts by achieving perfect scores on multiple quizzes, showcasing outstanding understanding and retention of pseudocode programming principles.'
    },
    
    // Speed Learner
    speedLearner: {
        id: 'speedLearner',
        title: 'Speed Learner',
        subtitle: 'Rapid Progress',
        icon: 'ri-flashlight-line',
        description: 'Completed 10+ lessons in under 7 days',
        color: '#ec4899',
        requirements: {
            lessonsCompleted: 10,
            daysLimit: 7
        },
        certificateText: 'has demonstrated remarkable dedication and learning efficiency by completing a significant portion of the iPseudo Tutorial Hub in record time, showcasing exceptional commitment to mastering pseudocode programming.'
    }
};

// Helper functions for certificate system
const CertificateHelpers = {
    // Check if lesson is completed
    isLessonCompleted(lessonId) {
        const progress = JSON.parse(localStorage.getItem('lessonProgress')) || {};
        return progress[`lesson-${lessonId}`] === 'completed';
    },
    
    // Get quiz results
    getQuizResults() {
        return JSON.parse(localStorage.getItem('quizResults')) || {};
    },
    
    // Get quiz stats
    getQuizStats() {
        return JSON.parse(localStorage.getItem('quizStats')) || {
            totalQuizzes: 0,
            averageScore: 0
        };
    },
    
    // Calculate average quiz score for specific lessons
    getAverageScoreForLessons(lessonIds) {
        const quizResults = this.getQuizResults();
        let totalScore = 0;
        let totalQuizzes = 0;
        
        lessonIds.forEach(lessonId => {
            if (quizResults[lessonId]) {
                totalScore += quizResults[lessonId].percentage;
                totalQuizzes++;
            }
        });
        
        return totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
    },
    
    // Count completed lessons from a list
    countCompletedLessons(lessonIds) {
        return lessonIds.filter(id => this.isLessonCompleted(id)).length;
    },
    
    // Count perfect quiz scores
    countPerfectQuizzes() {
        const quizResults = this.getQuizResults();
        return Object.values(quizResults).filter(result => result.percentage === 100).length;
    },
    
    // Check if certificate requirements are met
    checkRequirements(certType) {
        const cert = certificateTypes[certType];
        if (!cert) return { eligible: false, progress: 0 };
        
        const req = cert.requirements;
        
        // Level-based certificates (beginner, intermediate, advanced, master)
        if (req.lessons) {
            const completed = this.countCompletedLessons(req.lessons);
            const total = req.lessons.length;
            const avgScore = this.getAverageScoreForLessons(req.lessons);
            
            const allCompleted = completed === total;
            const scoreRequirementMet = avgScore >= req.minScore || avgScore === 0; // 0 means no quizzes taken yet
            
            return {
                eligible: allCompleted && scoreRequirementMet,
                progress: Math.round((completed / total) * 100),
                completed: completed,
                total: total,
                avgScore: avgScore,
                scoreRequirement: req.minScore
            };
        }
        
        // Quiz Ace certificate
        if (req.perfectQuizzes) {
            const perfectCount = this.countPerfectQuizzes();
            return {
                eligible: perfectCount >= req.perfectQuizzes,
                progress: Math.round((perfectCount / req.perfectQuizzes) * 100),
                completed: perfectCount,
                total: req.perfectQuizzes
            };
        }
        
        // Speed Learner certificate
        if (req.lessonsCompleted && req.daysLimit) {
            // TODO: Implement time tracking
            const completedCount = this.countCompletedLessons([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
            return {
                eligible: false, // Disabled for now
                progress: Math.round((completedCount / req.lessonsCompleted) * 100),
                completed: completedCount,
                total: req.lessonsCompleted,
                note: 'Time tracking coming soon!'
            };
        }
        
        return { eligible: false, progress: 0 };
    },
    
    // Get all earned certificates
    getEarnedCertificates() {
        const earned = [];
        for (const [key, cert] of Object.entries(certificateTypes)) {
            const status = this.checkRequirements(key);
            if (status.eligible) {
                earned.push({ ...cert, earnedDate: Date.now() });
            }
        }
        return earned;
    },
    
    // Get student name from localStorage
    getStudentName() {
        return localStorage.getItem('studentName') || '';
    },
    
    // Save student name
    saveStudentName(name) {
        localStorage.setItem('studentName', name);
    },
    
    // Generate certificate ID for download
    generateCertificateId() {
        return 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
};

