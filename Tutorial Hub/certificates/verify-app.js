// Certificate Verification System
document.addEventListener('DOMContentLoaded', function() {
    // Allow Enter key to verify
    const input = document.getElementById('certificateId');
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyCertificate();
        }
    });
    
    // Check for ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('id');
    if (certId) {
        input.value = certId;
        verifyCertificate();
    }
});

// Verify certificate by ID
function verifyCertificate() {
    const input = document.getElementById('certificateId');
    const certId = input.value.trim().toUpperCase();
    
    if (!certId) {
        showError('Please enter a certificate ID');
        return;
    }
    
    // Validate format
    if (!certId.startsWith('CERT-')) {
        showError('Invalid certificate ID format. ID must start with "CERT-"');
        return;
    }
    
    // Get issued certificates from localStorage
    const issuedCertificates = getIssuedCertificates();
    
    // Check if certificate exists
    const certificate = issuedCertificates[certId];
    
    if (certificate) {
        showValidCertificate(certificate);
    } else {
        showInvalidCertificate(certId);
    }
}

// Show valid certificate
function showValidCertificate(cert) {
    const resultBox = document.getElementById('resultBox');
    
    const issueDate = new Date(cert.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    resultBox.className = 'result-box valid';
    resultBox.innerHTML = `
        <div class="result-icon">
            <i class="ri-checkbox-circle-fill"></i>
        </div>
        
        <h2 class="result-title">Certificate Verified! ✓</h2>
        
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
            This certificate is <strong style="color: #10b981;">authentic</strong> and was issued by iPseudo Tutorial Hub.
        </p>
        
        <div class="cert-details">
            <div class="cert-detail-row">
                <span class="cert-detail-label">Certificate ID</span>
                <span class="cert-detail-value">${cert.certificateId}</span>
            </div>
            <div class="cert-detail-row">
                <span class="cert-detail-label">Recipient</span>
                <span class="cert-detail-value">${cert.studentName}</span>
            </div>
            <div class="cert-detail-row">
                <span class="cert-detail-label">Achievement</span>
                <span class="cert-detail-value">${cert.certificateTitle}</span>
            </div>
            <div class="cert-detail-row">
                <span class="cert-detail-label">Level</span>
                <span class="cert-detail-value">${cert.certificateSubtitle}</span>
            </div>
            <div class="cert-detail-row">
                <span class="cert-detail-label">Issue Date</span>
                <span class="cert-detail-value">${issueDate}</span>
            </div>
            ${cert.averageScore ? `
                <div class="cert-detail-row">
                    <span class="cert-detail-label">Average Quiz Score</span>
                    <span class="cert-detail-value">${cert.averageScore}%</span>
                </div>
            ` : ''}
            <div class="cert-detail-row">
                <span class="cert-detail-label">Status</span>
                <span class="cert-detail-value" style="color: #10b981;">
                    <i class="ri-verified-badge-fill"></i> Verified
                </span>
            </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(16, 185, 129, 0.05); border-radius: 8px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #10b981; font-weight: 600; font-size: 0.9375rem;">
                <i class="ri-shield-check-fill"></i>
                <span>This certificate is genuine and was issued by M'BARK</span>
            </div>
        </div>
    `;
    
    // Scroll to results
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show invalid certificate
function showInvalidCertificate(certId) {
    const resultBox = document.getElementById('resultBox');
    
    resultBox.className = 'result-box invalid';
    resultBox.innerHTML = `
        <div class="result-icon">
            <i class="ri-close-circle-fill"></i>
        </div>
        
        <h2 class="result-title">Certificate Not Found</h2>
        
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">
            The certificate ID <strong style="color: #ef4444;">${certId}</strong> could not be verified.
        </p>
        
        <div style="background: var(--bg-secondary); border-radius: 10px; padding: 1.5rem; text-align: left;">
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">
                Possible Reasons:
            </h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9375rem;">
                    <i class="ri-error-warning-line" style="color: #ef4444; margin-top: 0.125rem;"></i>
                    <span>The certificate ID was entered incorrectly</span>
                </li>
                <li style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9375rem;">
                    <i class="ri-error-warning-line" style="color: #ef4444; margin-top: 0.125rem;"></i>
                    <span>The certificate has not been issued yet</span>
                </li>
                <li style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9375rem;">
                    <i class="ri-error-warning-line" style="color: #ef4444; margin-top: 0.125rem;"></i>
                    <span>The certificate was issued on a different device/browser</span>
                </li>
                <li style="display: flex; align-items: start; gap: 0.5rem; color: var(--text-secondary); font-size: 0.9375rem;">
                    <i class="ri-error-warning-line" style="color: #ef4444; margin-top: 0.125rem;"></i>
                    <span>The certificate may be fraudulent</span>
                </li>
            </ul>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(239, 68, 68, 0.05); border-radius: 8px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #ef4444; font-weight: 600; font-size: 0.9375rem;">
                <i class="ri-shield-cross-fill"></i>
                <span>This certificate could not be verified</span>
            </div>
        </div>
    `;
    
    // Scroll to results
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show error message
function showError(message) {
    const resultBox = document.getElementById('resultBox');
    
    resultBox.className = 'result-box invalid';
    resultBox.innerHTML = `
        <div class="result-icon">
            <i class="ri-alert-line"></i>
        </div>
        <h2 class="result-title">Error</h2>
        <p style="color: var(--text-secondary);">${message}</p>
    `;
    
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Get issued certificates from localStorage
function getIssuedCertificates() {
    const stored = localStorage.getItem('issuedCertificates');
    return stored ? JSON.parse(stored) : {};
}

// Save issued certificate (called when certificate is downloaded)
function saveIssuedCertificate(certificateId, certificateData) {
    const issuedCertificates = getIssuedCertificates();
    issuedCertificates[certificateId] = {
        certificateId: certificateId,
        studentName: certificateData.studentName,
        certificateTitle: certificateData.certificateTitle,
        certificateSubtitle: certificateData.certificateSubtitle,
        certificateType: certificateData.certificateType,
        issuedAt: Date.now(),
        averageScore: certificateData.averageScore || null
    };
    localStorage.setItem('issuedCertificates', JSON.stringify(issuedCertificates));
}

