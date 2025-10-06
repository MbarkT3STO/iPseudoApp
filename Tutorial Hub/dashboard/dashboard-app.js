// Dashboard Application
let dashboardData;

document.addEventListener('DOMContentLoaded', function() {
    dashboardData = new DashboardData();
    
    // Display personalized greeting
    displayGreeting();
    
    // Display all dashboard sections
    displayQuickStats();
    displayRecentActivity();
    displayRecommendations();
    displayAchievements();
    displayStrengthsWeaknesses();
    
    // Wait for Chart.js to be ready, then render charts
    const checkChartJs = setInterval(() => {
        if (typeof Chart !== 'undefined') {
            clearInterval(checkChartJs);
            
            // Small delay to ensure DOM is fully ready
            setTimeout(() => {
                displayProgressChart();
                displayStudyChart();
            }, 200);
        }
    }, 50);
    
    // Timeout after 5 seconds
    setTimeout(() => {
        if (typeof Chart === 'undefined') {
            clearInterval(checkChartJs);
            console.error('Chart.js failed to load within 5 seconds');
        }
    }, 5000);
});

// Display personalized greeting
function displayGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Welcome Back';
    
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    
    const studentName = localStorage.getItem('studentName');
    if (studentName) {
        greeting += `, ${studentName.split(' ')[0]}`;
    }
    
    document.getElementById('greetingText').textContent = greeting + '!';
    
    // Update subtitle based on progress
    const completed = dashboardData.getCompletedLessonsCount();
    let subtitle = 'Track your progress, review your achievements, and plan your next steps.';
    
    if (completed === 0) {
        subtitle = 'Start your learning journey today! Complete your first lesson to begin.';
    } else if (completed === 20) {
        subtitle = '🎉 Congratulations! You\'ve completed all lessons. Keep practicing and earning certificates!';
    } else {
        subtitle = `You've completed ${completed} of 20 lessons. Keep up the great work!`;
    }
    
    document.getElementById('dashboardSubtitle').textContent = subtitle;
}

// Display quick stats
function displayQuickStats() {
    const container = document.getElementById('quickStats');
    const completed = dashboardData.getCompletedLessonsCount();
    const progress = dashboardData.getOverallProgress();
    const certificates = Object.keys(dashboardData.certificates).length;
    const avgScore = dashboardData.quizStats.averageScore;
    
    container.innerHTML = `
        <div class="stat-card purple">
            <div class="stat-card-header">
                <div class="stat-icon">
                    <i class="ri-book-open-line"></i>
                </div>
            </div>
            <div class="stat-value">${completed}/20</div>
            <div class="stat-label">Lessons Completed</div>
            <div class="stat-trend up">
                <i class="ri-arrow-up-line"></i>
                ${progress}% Overall
            </div>
        </div>
        
        <div class="stat-card orange">
            <div class="stat-card-header">
                <div class="stat-icon">
                    <i class="ri-question-answer-line"></i>
                </div>
            </div>
            <div class="stat-value">${dashboardData.quizStats.totalQuizzes}</div>
            <div class="stat-label">Quizzes Taken</div>
            <div class="stat-trend ${avgScore >= 80 ? 'up' : 'down'}">
                <i class="ri-percent-line"></i>
                ${avgScore}% Average
            </div>
        </div>
        
        <div class="stat-card gold">
            <div class="stat-card-header">
                <div class="stat-icon">
                    <i class="ri-award-line"></i>
                </div>
            </div>
            <div class="stat-value">${certificates}</div>
            <div class="stat-label">Certificates Earned</div>
            <div class="stat-trend up">
                <i class="ri-trophy-line"></i>
                Achievements
            </div>
        </div>
        
        <div class="stat-card green">
            <div class="stat-card-header">
                <div class="stat-icon">
                    <i class="ri-time-line"></i>
                </div>
            </div>
            <div class="stat-value">${formatStudyTime(dashboardData.quizStats.totalTimeSpent)}</div>
            <div class="stat-label">Total Study Time</div>
            <div class="stat-trend up">
                <i class="ri-timer-line"></i>
                Keep Going!
            </div>
        </div>
    `;
}

// Display progress chart
function displayProgressChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) {
        console.error('Progress chart canvas not found');
        return;
    }
    
    try {
        const ctx = canvas.getContext('2d');
        const distribution = dashboardData.getStudyDistribution();
        
        // Check if there's any data
        const hasData = distribution.beginner + distribution.intermediate + distribution.advanced > 0;
        
        // Destroy existing chart if any
        if (window.progressChartInstance) {
            window.progressChartInstance.destroy();
        }
        
        // Use placeholder data if no progress yet
        const chartData = hasData 
            ? [distribution.beginner, distribution.intermediate, distribution.advanced]
            : [1, 1, 1]; // Show equal segments when no data
        
        const chartColors = hasData
            ? ['#22c55e', '#3b82f6', '#9333ea']
            : ['rgba(148, 163, 184, 0.3)', 'rgba(148, 163, 184, 0.3)', 'rgba(148, 163, 184, 0.3)'];
        
        window.progressChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Beginner (6 lessons)', 'Intermediate (7 lessons)', 'Advanced (7 lessons)'],
                datasets: [{
                    label: 'Lessons Completed',
                    data: chartData,
                    backgroundColor: chartColors,
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            padding: 15,
                            font: { 
                                size: 13, 
                                weight: '600',
                                family: 'Inter'
                            },
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 8,
                            boxHeight: 8
                        }
                    },
                    tooltip: {
                        enabled: hasData,
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#cbd5e1',
                        borderColor: '#9333ea',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                if (!hasData) return '';
                                const total = distribution.beginner + distribution.intermediate + distribution.advanced;
                                const value = context.parsed;
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return ` ${context.label.split(' ')[0]}: ${value} lessons (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        // Add "no data" overlay if needed
        if (!hasData) {
            const container = canvas.parentElement;
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                pointer-events: none;
            `;
            overlay.innerHTML = `
                <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 600;">
                    No lessons completed yet
                </div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    Start learning to see your progress!
                </div>
            `;
            container.appendChild(overlay);
        }
    } catch (error) {
        console.error('Error creating progress chart:', error);
    }
}

// Display recent activity
function displayRecentActivity() {
    const container = document.getElementById('recentActivity');
    const activities = dashboardData.getRecentActivity();
    
    if (activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="ri-history-line"></i>
                <p>No recent activity yet. Start learning to see your progress here!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    activities.forEach(activity => {
        const iconClass = activity.type === 'lesson' ? 'lesson' : 
                         activity.type === 'quiz' ? 'quiz' : 'certificate';
        const icon = activity.type === 'lesson' ? 'ri-book-line' :
                    activity.type === 'quiz' ? 'ri-question-line' : 'ri-award-line';
        
        html += `
            <div class="activity-item">
                <div class="activity-icon ${iconClass}">
                    <i class="${icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${DashboardData.timeAgo(activity.time)}</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Display recommendations
function displayRecommendations() {
    const container = document.getElementById('recommendations');
    const recommendations = dashboardData.getRecommendations();
    
    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="ri-check-double-line"></i>
                <p>Great job! You're all caught up!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    recommendations.forEach(rec => {
        html += `
            <a href="${rec.action}" class="recommendation-card" style="text-decoration: none;">
                <div class="recommendation-title">
                    <i class="${rec.icon}"></i>
                    ${rec.title}
                </div>
                <div class="recommendation-description">
                    ${rec.description}
                </div>
                <span class="recommendation-badge">${rec.priority.toUpperCase()} PRIORITY</span>
            </a>
        `;
    });
    
    container.innerHTML = html;
}

// Display achievements
function displayAchievements() {
    const container = document.getElementById('achievementsShowcase');
    const certificates = Object.values(dashboardData.certificates);
    
    if (certificates.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="ri-medal-line"></i>
                <p>Complete lessons to earn your first certificate!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    certificates.slice(0, 3).forEach(cert => {
        const icons = {
            beginner: '🌱',
            intermediate: '🌿',
            advanced: '🚀',
            master: '👑',
            quizAce: '⭐',
            speedLearner: '⚡'
        };
        
        html += `
            <div class="achievement-badge">
                <div class="achievement-icon">${icons[cert.certificateType] || '🏆'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${cert.certificateTitle}</div>
                    <div class="achievement-description">${new Date(cert.issuedAt).toLocaleDateString()}</div>
                </div>
            </div>
        `;
    });
    
    if (certificates.length > 3) {
        html += `
            <a href="../certificates/index.html" style="display: block; text-align: center; color: var(--color-purple-500); font-weight: 600; margin-top: 0.5rem; text-decoration: none;">
                +${certificates.length - 3} more certificates →
            </a>
        `;
    }
    
    container.innerHTML = html;
}

// Display study distribution chart
function displayStudyChart() {
    const canvas = document.getElementById('studyChart');
    if (!canvas) {
        console.error('Study chart canvas not found');
        return;
    }
    
    try {
        const ctx = canvas.getContext('2d');
        const distribution = dashboardData.getStudyDistribution();
        
        // Check if there's any data
        const hasData = distribution.beginner + distribution.intermediate + distribution.advanced > 0;
        
        // Destroy existing chart if any
        if (window.studyChartInstance) {
            window.studyChartInstance.destroy();
        }
        
        // Use minimal placeholder data if no progress yet
        const chartData = hasData 
            ? [distribution.beginner, distribution.intermediate, distribution.advanced]
            : [0.5, 0.5, 0.5]; // Show minimal bars when no data
        
        const chartColors = hasData
            ? ['#22c55e', '#3b82f6', '#9333ea']
            : ['rgba(148, 163, 184, 0.3)', 'rgba(148, 163, 184, 0.3)', 'rgba(148, 163, 184, 0.3)'];
        
        window.studyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Beginner (0/6)', 'Intermediate (0/7)', 'Advanced (0/7)'],
                datasets: [{
                    label: 'Completed',
                    data: chartData,
                    backgroundColor: chartColors,
                    borderColor: chartColors,
                    borderWidth: 2,
                    borderRadius: 8,
                    barPercentage: 0.7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: false 
                    },
                    tooltip: {
                        enabled: hasData,
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#cbd5e1',
                        borderColor: '#9333ea',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                const max = context.label.includes('Beginner') ? 6 : 7;
                                return `${context.parsed.y} of ${max} lessons`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 8,
                        ticks: {
                            stepSize: 2,
                            color: '#94a3b8',
                            font: {
                                size: 12,
                                weight: '600',
                                family: 'Inter'
                            }
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        border: {
                            display: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 11,
                                weight: '600',
                                family: 'Inter'
                            }
                        },
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Add "no data" overlay if needed
        if (!hasData) {
            const container = canvas.parentElement;
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                pointer-events: none;
            `;
            overlay.innerHTML = `
                <div style="font-size: 0.875rem; color: var(--text-tertiary); font-weight: 600;">
                    No lessons completed yet
                </div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                    Complete lessons to see distribution!
                </div>
            `;
            container.appendChild(overlay);
        }
    } catch (error) {
        console.error('Error creating study chart:', error);
    }
}

// Display strengths and weaknesses
function displayStrengthsWeaknesses() {
    const container = document.getElementById('strengthsWeaknesses');
    const analysis = dashboardData.analyzePerformance();
    
    let html = `
        <div class="strength-section strengths">
            <div class="strength-header strengths">
                <i class="ri-emotion-happy-line"></i>
                <span>Your Strengths</span>
            </div>
            <ul class="strength-list">
    `;
    
    if (analysis.strengths.length > 0) {
        analysis.strengths.forEach(item => {
            html += `
                <li class="strength-item">
                    <i class="ri-checkbox-circle-fill"></i>
                    <span>${item.topic} (${item.score}%)</span>
                </li>
            `;
        });
    } else {
        html += `<li class="strength-item"><i class="ri-information-line"></i><span>Take more quizzes to see your strengths</span></li>`;
    }
    
    html += `
            </ul>
        </div>
        
        <div class="strength-section weaknesses">
            <div class="strength-header weaknesses">
                <i class="ri-lightbulb-line"></i>
                <span>Areas to Improve</span>
            </div>
            <ul class="strength-list">
    `;
    
    if (analysis.weaknesses.length > 0) {
        analysis.weaknesses.forEach(item => {
            html += `
                <li class="strength-item weakness-item">
                    <i class="ri-alert-line"></i>
                    <span>${item.topic} (${item.score}%)</span>
                </li>
            `;
        });
    } else {
        html += `<li class="strength-item"><i class="ri-star-line"></i><span>Great job! No weak areas identified</span></li>`;
    }
    
    html += `
            </ul>
        </div>
    `;
    
    container.innerHTML = html;
}

// Format study time
function formatStudyTime(seconds) {
    if (seconds === 0) return '0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

