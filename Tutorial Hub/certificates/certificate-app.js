// Certificate App - Main application logic
let currentCertificateType = null;
let certificateGenerator = null;

document.addEventListener('DOMContentLoaded', function() {
    displayProgressSummary();
    displayCertificates();
    
    // Check for demo mode in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
        enableDemoMode();
    }
});

// Demo Mode - Unlock all certificates for testing
function enableDemoMode() {
    if (!confirm('⚠️ This will replace your current progress with demo data to unlock all certificates for testing.\n\nYour real progress will be backed up and can be restored.\n\nContinue?')) {
        return;
    }
    
    console.log('🎭 Demo Mode Activated - All certificates unlocked!');
    
    // Backup existing data
    const backup = {
        lessonProgress: localStorage.getItem('lessonProgress'),
        quizResults: localStorage.getItem('quizResults'),
        quizStats: localStorage.getItem('quizStats')
    };
    localStorage.setItem('progressBackup', JSON.stringify(backup));
    
    // Mark all lessons as completed
    const lessonProgress = {};
    for (let i = 1; i <= 20; i++) {
        lessonProgress[`lesson-${i}`] = 'completed';
    }
    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
    
    // Add perfect quiz scores
    const quizResults = {};
    [1, 2, 3, 5, 7, 8, 10, 12, 15, 16].forEach((lessonId) => {
        quizResults[lessonId] = {
            lessonId: lessonId,
            score: 5,
            total: 5,
            percentage: 100,
            answers: [0, 1, 2, 3, 4],
            timeSpent: 300,
            completedAt: Date.now(),
            passed: true
        };
    });
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    
    // Update quiz stats
    const quizStats = {
        totalQuizzes: 10,
        totalPassed: 10,
        totalScore: 50,
        totalQuestions: 50,
        totalTimeSpent: 3000,
        completedQuizzes: [1, 2, 3, 5, 7, 8, 10, 12, 15, 16],
        averageScore: 100
    };
    localStorage.setItem('quizStats', JSON.stringify(quizStats));
    
    // Mark demo mode as active
    localStorage.setItem('demoMode', 'true');
    
    // Show success notification
    alert('✅ Demo Mode Enabled!\n\nAll certificates are now unlocked. The page will refresh.');
    
    // Refresh the page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Restore Real Progress
function restoreRealProgress() {
    const backup = localStorage.getItem('progressBackup');
    
    if (!backup) {
        alert('No backup found. Demo mode may not have been activated yet.');
        return;
    }
    
    if (!confirm('Restore your real progress?\n\nThis will remove demo data and restore your actual learning progress.')) {
        return;
    }
    
    const data = JSON.parse(backup);
    
    // Restore backed up data
    if (data.lessonProgress) {
        localStorage.setItem('lessonProgress', data.lessonProgress);
    } else {
        localStorage.removeItem('lessonProgress');
    }
    
    if (data.quizResults) {
        localStorage.setItem('quizResults', data.quizResults);
    } else {
        localStorage.removeItem('quizResults');
    }
    
    if (data.quizStats) {
        localStorage.setItem('quizStats', data.quizStats);
    } else {
        localStorage.removeItem('quizStats');
    }
    
    // Remove demo mode flag and backup
    localStorage.removeItem('demoMode');
    localStorage.removeItem('progressBackup');
    
    alert('✅ Real Progress Restored!\n\nYour actual progress has been restored. The page will refresh.');
    
    // Refresh the page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Display overall progress summary
function displayProgressSummary() {
    const container = document.getElementById('progressSummary');
    
    const earnedCerts = CertificateHelpers.getEarnedCertificates();
    const totalCerts = Object.keys(certificateTypes).length;
    const completedLessons = CertificateHelpers.countCompletedLessons([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    const quizStats = CertificateHelpers.getQuizStats();
    
    const summaryHTML = `
        <div class="progress-summary">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); text-align: center; margin-bottom: 1rem;">
                <i class="ri-bar-chart-line"></i>
                Your Learning Progress
            </h2>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-value">${earnedCerts.length}/${totalCerts}</div>
                    <div class="summary-label">Certificates Earned</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${completedLessons}/20</div>
                    <div class="summary-label">Lessons Completed</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${quizStats.totalQuizzes}</div>
                    <div class="summary-label">Quizzes Taken</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${quizStats.averageScore}%</div>
                    <div class="summary-label">Average Quiz Score</div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = summaryHTML;
}

// Display all certificates
function displayCertificates() {
    const container = document.getElementById('certificatesList');
    let cardsHTML = '';
    
    for (const [key, cert] of Object.entries(certificateTypes)) {
        const status = CertificateHelpers.checkRequirements(key);
        const card = createCertificateCard(cert, status);
        cardsHTML += card;
    }
    
    container.innerHTML = cardsHTML;
}

// Create individual certificate card
function createCertificateCard(cert, status) {
    const isLocked = !status.eligible;
    const progress = Math.min(status.progress, 100);
    
    let requirementsHTML = '';
    
    if (cert.requirements.lessons) {
        requirementsHTML = `
            <div class="requirement-item ${status.completed === status.total ? 'completed' : 'incomplete'}">
                <i class="ri-checkbox-circle-line"></i>
                <span>Complete ${status.total} lessons (${status.completed}/${status.total})</span>
            </div>
        `;
        
        if (cert.requirements.minScore) {
            const scoresMet = status.avgScore >= cert.requirements.minScore || status.avgScore === 0;
            requirementsHTML += `
                <div class="requirement-item ${scoresMet ? 'completed' : 'incomplete'}">
                    <i class="ri-checkbox-circle-line"></i>
                    <span>Average ${cert.requirements.minScore}% on quizzes ${status.avgScore > 0 ? `(${status.avgScore}%)` : ''}</span>
                </div>
            `;
        }
    } else if (cert.requirements.perfectQuizzes) {
        requirementsHTML = `
            <div class="requirement-item ${status.completed >= status.total ? 'completed' : 'incomplete'}">
                <i class="ri-checkbox-circle-line"></i>
                <span>Get 100% on ${status.total} quizzes (${status.completed}/${status.total})</span>
            </div>
        `;
    } else if (cert.requirements.lessonsCompleted) {
        requirementsHTML = `
            <div class="requirement-item incomplete">
                <i class="ri-time-line"></i>
                <span>${status.note || 'Coming soon'}</span>
            </div>
        `;
    }
    
    return `
        <div class="certificate-card ${isLocked ? 'locked' : ''}">
            <div class="certificate-icon">
                <i class="${cert.icon}"></i>
            </div>
            
            <h3 class="certificate-title">${cert.title}</h3>
            <p class="certificate-subtitle">${cert.subtitle}</p>
            
            <div class="certificate-requirements">
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.75rem;">
                    Requirements:
                </div>
                ${requirementsHTML}
            </div>
            
            <div class="certificate-progress">
                <div class="progress-label">
                    <span class="progress-label-text">Progress</span>
                    <span class="progress-label-value">${progress}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                </div>
            </div>
            
            <div class="certificate-actions">
                ${isLocked ? `
                    <button class="cert-btn cert-btn-secondary" disabled>
                        <i class="ri-lock-line"></i>
                        Locked
                    </button>
                ` : `
                    <button class="cert-btn cert-btn-secondary" onclick="previewCertificate('${cert.id}')">
                        <i class="ri-eye-line"></i>
                        Preview
                    </button>
                    <button class="cert-btn cert-btn-primary" onclick="generateCertificate('${cert.id}')">
                        <i class="ri-download-line"></i>
                        Download
                    </button>
                `}
            </div>
        </div>
    `;
}

// Generate and download certificate
function generateCertificate(certType) {
    const studentName = CertificateHelpers.getStudentName();
    
    if (!studentName) {
        // Show name input modal
        currentCertificateType = certType;
        showNameModal();
    } else {
        // Generate directly
        createAndDownloadCertificate(certType, studentName);
    }
}

// Preview certificate
function previewCertificate(certType) {
    const studentName = CertificateHelpers.getStudentName();
    
    if (!studentName) {
        // Show name input modal
        currentCertificateType = certType;
        showNameModal();
    } else {
        // Show preview directly
        showCertificatePreview(certType, studentName);
    }
}

// Show name input modal
function showNameModal() {
    const modal = document.getElementById('nameModal');
    const input = document.getElementById('studentName');
    
    // Pre-fill if name exists
    const savedName = CertificateHelpers.getStudentName();
    if (savedName) {
        input.value = savedName;
    }
    
    modal.style.display = 'flex';
    input.focus();
    
    // Allow Enter key to submit
    input.onkeypress = function(e) {
        if (e.key === 'Enter') {
            saveName();
        }
    };
}

// Close name modal
function closeNameModal() {
    document.getElementById('nameModal').style.display = 'none';
    currentCertificateType = null;
}

// Save name and continue
function saveName() {
    const input = document.getElementById('studentName');
    const name = input.value.trim();
    
    if (!name) {
        alert('Please enter your name');
        return;
    }
    
    if (name.length < 2) {
        alert('Please enter a valid name (at least 2 characters)');
        return;
    }
    
    // Save name
    CertificateHelpers.saveStudentName(name);
    
    // Close modal
    closeNameModal();
    
    // Show preview
    if (currentCertificateType) {
        showCertificatePreview(currentCertificateType, name);
    }
}

// Show certificate preview
async function showCertificatePreview(certType, studentName) {
    const generator = new CertificateCanvas(certType, studentName);
    certificateGenerator = generator;
    
    const preview = document.getElementById('certificatePreview');
    preview.innerHTML = ''; // Clear previous content
    
    // Generate canvas
    const canvas = await generator.generatePreview();
    
    // Style the canvas for display
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    canvas.style.borderRadius = '12px';
    canvas.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)';
    
    // Add to preview
    preview.appendChild(canvas);
    
    // Ensure preview is centered and visible
    preview.style.display = 'flex';
    preview.style.justifyContent = 'center';
    preview.style.alignItems = 'center';
    preview.style.padding = '2rem';
    
    // Display certificate ID
    const certIdText = document.getElementById('certIdText');
    certIdText.textContent = generator.certificateId;
    
    const modal = document.getElementById('previewModal');
    modal.style.display = 'flex';
}

// Copy certificate ID to clipboard
function copyCertificateId() {
    if (!certificateGenerator) return;
    
    const certId = certificateGenerator.certificateId;
    const certIdText = document.getElementById('certIdText');
    const copyBtn = document.getElementById('copyCertIdBtn');
    
    // Copy to clipboard
    navigator.clipboard.writeText(certId).then(() => {
        // Update button to show success
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="ri-check-line"></i><span>Copied!</span>';
        copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Flash the ID text
        certIdText.style.background = 'linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500))';
        certIdText.style.webkitBackgroundClip = 'text';
        certIdText.style.webkitTextFillColor = 'transparent';
        certIdText.style.backgroundClip = 'text';
        certIdText.style.transition = 'all 0.3s';
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = 'linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500))';
            
            certIdText.style.background = 'none';
            certIdText.style.webkitBackgroundClip = 'unset';
            certIdText.style.webkitTextFillColor = 'unset';
            certIdText.style.backgroundClip = 'unset';
            certIdText.style.color = 'var(--text-primary)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy certificate ID. Please copy it manually.');
    });
}

// Close preview modal
function closePreviewModal() {
    document.getElementById('previewModal').style.display = 'none';
    certificateGenerator = null;
}

// Download certificate from preview
async function downloadCertificate() {
    if (certificateGenerator) {
        await certificateGenerator.download();
    }
}

// Create and download certificate directly (without preview)
function createAndDownloadCertificate(certType, studentName) {
    showCertificatePreview(certType, studentName);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const nameModal = document.getElementById('nameModal');
    const previewModal = document.getElementById('previewModal');
    
    if (event.target === nameModal) {
        closeNameModal();
    }
    
    if (event.target === previewModal) {
        closePreviewModal();
    }
};

