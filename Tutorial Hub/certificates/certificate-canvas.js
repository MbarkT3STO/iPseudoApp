// Certificate Canvas Generator - Direct canvas drawing for perfect output
class CertificateCanvas {
    constructor(certificateType, studentName) {
        this.certType = certificateTypes[certificateType];
        this.studentName = studentName;
        this.certificateId = CertificateHelpers.generateCertificateId();
        this.issueDate = new Date();
        this.canvas = null;
        this.ctx = null;
        this.width = 1200;
        this.height = 800;
    }
    
    // Create canvas and get context
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        return this.canvas;
    }
    
    // Draw gradient background
    drawBackground() {
        const ctx = this.ctx;
        
        // Main gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        bgGradient.addColorStop(0, '#0f172a');
        bgGradient.addColorStop(0.5, '#1e293b');
        bgGradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Background circles (decorative)
        ctx.save();
        ctx.globalAlpha = 0.15;
        
        // Circle 1 - Purple
        const circle1 = ctx.createRadialGradient(100, 100, 0, 100, 100, 250);
        circle1.addColorStop(0, '#9333ea');
        circle1.addColorStop(1, 'transparent');
        ctx.fillStyle = circle1;
        ctx.fillRect(0, 0, 400, 400);
        
        // Circle 2 - Blue
        const circle2 = ctx.createRadialGradient(this.width - 100, this.height - 100, 0, this.width - 100, this.height - 100, 200);
        circle2.addColorStop(0, '#3b82f6');
        circle2.addColorStop(1, 'transparent');
        ctx.fillStyle = circle2;
        ctx.fillRect(this.width - 400, this.height - 400, 400, 400);
        
        // Circle 3 - Purple center
        const circle3 = ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, 150);
        circle3.addColorStop(0, '#9333ea');
        circle3.addColorStop(1, 'transparent');
        ctx.fillStyle = circle3;
        ctx.fillRect(this.width / 2 - 150, this.height / 2 - 150, 300, 300);
        
        // Grid pattern
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < this.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Top gradient bar
        const topGradient = ctx.createLinearGradient(0, 0, this.width, 0);
        topGradient.addColorStop(0, '#9333ea');
        topGradient.addColorStop(0.5, '#3b82f6');
        topGradient.addColorStop(1, '#9333ea');
        ctx.fillStyle = topGradient;
        ctx.fillRect(0, 0, this.width, 8);
    }
    
    // Draw text with gradient
    drawGradientText(text, x, y, fontSize, fontWeight = '800', fontFamily = 'Inter') {
        const ctx = this.ctx;
        
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        
        // Create gradient for text
        const gradient = ctx.createLinearGradient(x - 200, y, x + 200, y);
        gradient.addColorStop(0, '#9333ea');
        gradient.addColorStop(0.5, '#3b82f6');
        gradient.addColorStop(1, '#9333ea');
        
        ctx.fillStyle = gradient;
        ctx.fillText(text, x, y);
    }
    
    // Draw regular text
    drawText(text, x, y, fontSize, color, fontWeight = '400', fontFamily = 'Inter', align = 'center') {
        const ctx = this.ctx;
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = align;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
    
    // Wrap and draw multi-line text
    drawWrappedText(text, x, y, maxWidth, fontSize, color, lineHeight = 1.6) {
        const ctx = this.ctx;
        const words = text.split(' ');
        let line = '';
        let lineY = y;
        
        ctx.font = `400 ${fontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillStyle = color;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, lineY);
                line = words[i] + ' ';
                lineY += fontSize * lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, lineY);
        
        return lineY + fontSize * lineHeight;
    }
    
    // Draw the complete certificate
    async draw() {
        this.createCanvas();
        
        // Draw background
        this.drawBackground();
        
        const centerX = this.width / 2;
        const padding = 80;
        let currentY = 70;
        
        // Header - Logo Icon
        this.ctx.font = '900 70px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const logoGradient = this.ctx.createLinearGradient(centerX - 60, currentY, centerX + 60, currentY);
        logoGradient.addColorStop(0, '#9333ea');
        logoGradient.addColorStop(1, '#3b82f6');
        this.ctx.fillStyle = logoGradient;
        this.ctx.fillText('{ }', centerX, currentY);
        currentY += 60;
        
        // Brand Name
        this.ctx.textBaseline = 'alphabetic';
        this.drawGradientText('iPseudo', centerX, currentY, 44, '800', 'Inter');
        currentY += 28;
        
        // Subtitle
        this.drawText('TUTORIAL HUB', centerX, currentY, 12, '#94a3b8', '600', 'Inter');
        currentY += 50;
        
        // Certificate Badge
        const badgeWidth = 310;
        const badgeHeight = 44;
        const badgeX = centerX - badgeWidth / 2;
        const badgeY = currentY - badgeHeight / 2;
        
        this.ctx.fillStyle = 'rgba(147, 51, 234, 0.15)';
        this.ctx.strokeStyle = 'rgba(147, 51, 234, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 22);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.drawText('CERTIFICATE OF ACHIEVEMENT', centerX, currentY + 7, 11, '#cbd5e1', '600', 'Inter');
        currentY += 60;
        
        // Decorative line top
        const ornamentGradient1 = this.ctx.createLinearGradient(centerX - 80, currentY, centerX + 80, currentY);
        ornamentGradient1.addColorStop(0, 'transparent');
        ornamentGradient1.addColorStop(0.5, '#9333ea');
        ornamentGradient1.addColorStop(1, 'transparent');
        this.ctx.fillStyle = ornamentGradient1;
        this.ctx.fillRect(centerX - 80, currentY, 160, 3);
        currentY += 50;
        
        // Certificate Title
        this.ctx.font = '800 42px Inter';
        this.ctx.textAlign = 'center';
        const titleGradient = this.ctx.createLinearGradient(centerX - 450, currentY, centerX + 450, currentY);
        titleGradient.addColorStop(0, '#ffffff');
        titleGradient.addColorStop(0.5, '#e2e8f0');
        titleGradient.addColorStop(1, '#ffffff');
        this.ctx.fillStyle = titleGradient;
        this.ctx.fillText(this.certType.title, centerX, currentY);
        currentY += 26;
        
        // Subtitle
        this.drawText(this.certType.subtitle.toUpperCase(), centerX, currentY, 14, '#94a3b8', '600', 'Inter');
        currentY += 48;
        
        // Divider
        const dividerGradient = this.ctx.createLinearGradient(centerX - 50, currentY, centerX + 50, currentY);
        dividerGradient.addColorStop(0, 'transparent');
        dividerGradient.addColorStop(0.5, '#3b82f6');
        dividerGradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = dividerGradient;
        this.ctx.fillRect(centerX - 50, currentY, 100, 2);
        currentY += 40;
        
        // "This certifies that"
        this.drawText('This certifies that', centerX, currentY, 13, '#cbd5e1', '500', 'Inter');
        currentY += 50;
        
        // Student Name
        this.ctx.font = '800 52px Playfair Display';
        this.ctx.textAlign = 'center';
        const nameGradient = this.ctx.createLinearGradient(centerX - 450, currentY, centerX + 450, currentY);
        nameGradient.addColorStop(0, '#9333ea');
        nameGradient.addColorStop(0.25, '#3b82f6');
        nameGradient.addColorStop(0.5, '#3b82f6');
        nameGradient.addColorStop(0.75, '#3b82f6');
        nameGradient.addColorStop(1, '#9333ea');
        this.ctx.fillStyle = nameGradient;
        this.ctx.fillText(this.studentName, centerX, currentY);
        currentY += 18;
        
        // Name underline
        const underlineGradient = this.ctx.createLinearGradient(centerX - 220, currentY, centerX + 220, currentY);
        underlineGradient.addColorStop(0, 'transparent');
        underlineGradient.addColorStop(0.25, '#9333ea');
        underlineGradient.addColorStop(0.75, '#3b82f6');
        underlineGradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = underlineGradient;
        this.ctx.fillRect(centerX - 220, currentY, 440, 3);
        currentY += 48;
        
        // Description text
        const status = CertificateHelpers.checkRequirements(this.certType.id);
        const descStartY = currentY;
        currentY = this.drawWrappedText(this.certType.certificateText, centerX, currentY, 920, 15, '#cbd5e1', 1.75);
        
        // Quiz score badge (if applicable)
        if (status.avgScore) {
            currentY += 30;
            const scoreText = `★ Average Score: ${status.avgScore}% ★`;
            const scoreBadgeWidth = 250;
            const scoreBadgeHeight = 42;
            const scoreBadgeX = centerX - scoreBadgeWidth / 2;
            const scoreBadgeY = currentY - scoreBadgeHeight / 2;
            
            this.ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
            this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.roundRect(scoreBadgeX, scoreBadgeY, scoreBadgeWidth, scoreBadgeHeight, 21);
            this.ctx.fill();
            this.ctx.stroke();
            
            this.drawText(scoreText, centerX, currentY + 7, 14, '#fbbf24', '700', 'Inter');
            currentY += 40;
        } else {
            currentY += 20;
        }
        
        // Decorative line bottom
        const ornamentGradient2 = this.ctx.createLinearGradient(centerX - 80, currentY, centerX + 80, currentY);
        ornamentGradient2.addColorStop(0, 'transparent');
        ornamentGradient2.addColorStop(0.5, '#3b82f6');
        ornamentGradient2.addColorStop(1, 'transparent');
        this.ctx.fillStyle = ornamentGradient2;
        this.ctx.fillRect(centerX - 80, currentY, 160, 3);
        
        // Footer section - absolute positioning at bottom
        const footerY = this.height - 80;
        
        // Footer separator line (horizontal)
        this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(padding + 70, footerY - 38);
        this.ctx.lineTo(this.width - padding - 200, footerY - 38);
        this.ctx.stroke();
        
        // Footer details
        const formattedDate = this.issueDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const footerDetails = [
            { label: 'CERTIFICATE ID', value: this.certificateId },
            { label: 'ISSUE DATE', value: formattedDate },
            { label: 'AUTHORIZED BY', value: "M'BARK" }
        ];
        
        // Calculate footer layout
        const footerContentWidth = this.width - (padding * 2) - 200; // Reserve space for seal
        const footerSectionWidth = footerContentWidth / 3;
        
        footerDetails.forEach((detail, index) => {
            const xPos = padding + 70 + (footerSectionWidth * index) + (footerSectionWidth / 2);
            
            // Label
            this.drawText(detail.label, xPos, footerY - 8, 10, '#64748b', '600', 'Inter');
            
            // Value or Signature
            if (detail.label === 'AUTHORIZED BY') {
                // Draw signature above the name
                this.drawSignature(xPos, footerY + 2);
                // Draw name below signature
                this.drawText(detail.value, xPos, footerY + 24, 11, '#94a3b8', '500', 'Inter');
            } else {
                this.drawText(detail.value, xPos, footerY + 18, 13, '#e2e8f0', '700', 'Inter');
            }
            
            // Vertical divider
            if (index < footerDetails.length - 1) {
                const dividerX = padding + 70 + footerSectionWidth * (index + 1);
                this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.moveTo(dividerX, footerY - 22);
                this.ctx.lineTo(dividerX, footerY + 22);
                this.ctx.stroke();
            }
        });
        
        // Draw seal - bottom right corner with proper margin
        this.drawSeal(this.width - 110, this.height - 110);
        
        // Verification badge - bottom center
        this.drawVerificationBadge();
    }
    
    // Draw rotating seal
    drawSeal(x, y) {
        const ctx = this.ctx;
        const radius = 55;
        
        // Outer ring with gradient (thicker, more prominent)
        ctx.save();
        
        // Draw multiple gradient rings for depth
        for (let i = 0; i < 3; i++) {
            const ringGradient = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
            ringGradient.addColorStop(0, '#9333ea');
            ringGradient.addColorStop(0.5, '#3b82f6');
            ringGradient.addColorStop(1, '#9333ea');
            
            ctx.beginPath();
            ctx.arc(x, y, radius - i * 2, 0, Math.PI * 2);
            ctx.strokeStyle = ringGradient;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.5 - i * 0.15;
            ctx.stroke();
        }
        
        // Main ring
        const mainRingGradient = ctx.createConicGradient(0, x, y);
        mainRingGradient.addColorStop(0, '#9333ea');
        mainRingGradient.addColorStop(0.25, '#3b82f6');
        mainRingGradient.addColorStop(0.5, '#9333ea');
        mainRingGradient.addColorStop(0.75, '#3b82f6');
        mainRingGradient.addColorStop(1, '#9333ea');
        
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = mainRingGradient;
        ctx.lineWidth = 6;
        ctx.stroke();
        
        // Inner circle (darker background with subtle gradient)
        const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, radius - 8);
        innerGradient.addColorStop(0, '#1e293b');
        innerGradient.addColorStop(1, '#0f172a');
        ctx.beginPath();
        ctx.arc(x, y, radius - 8, 0, Math.PI * 2);
        ctx.fillStyle = innerGradient;
        ctx.fill();
        
        ctx.restore();
        
        // Icon in center (using emoji)
        this.ctx.font = '900 46px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Draw icon based on certificate type
        const iconSymbols = {
            beginner: '🌱',
            intermediate: '🌿',
            advanced: '🚀',
            master: '👑',
            quizAce: '⭐',
            speedLearner: '⚡'
        };
        
        this.ctx.fillText(iconSymbols[this.certType.id] || '✓', x, y + 2);
        this.ctx.textBaseline = 'alphabetic';
    }
    
    // Draw artistic hand-drawn signature
    drawSignature(x, y) {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.1); // Natural signature tilt
        
        // Create gradient for signature ink
        const signatureGradient = ctx.createLinearGradient(-120, -20, 120, 20);
        signatureGradient.addColorStop(0, '#9333ea');
        signatureGradient.addColorStop(0.5, '#3b82f6');
        signatureGradient.addColorStop(1, '#9333ea');
        
        ctx.strokeStyle = signatureGradient;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Main signature stroke - one flowing artistic line
        ctx.beginPath();
        
        // Start with elegant initial swoop (capital M)
        ctx.moveTo(-110, 8);
        ctx.lineWidth = 1.2;
        ctx.bezierCurveTo(-108, -5, -105, -20, -95, -22);
        
        // First peak of M
        ctx.lineWidth = 2.8;
        ctx.bezierCurveTo(-85, -24, -75, -18, -70, -8);
        ctx.lineWidth = 3.5;
        ctx.bezierCurveTo(-65, 2, -63, 10, -65, 14);
        
        // Dip and second peak
        ctx.lineWidth = 2.2;
        ctx.bezierCurveTo(-67, 10, -68, 5, -68, 0);
        ctx.lineWidth = 3;
        ctx.bezierCurveTo(-68, -8, -65, -15, -58, -12);
        ctx.bezierCurveTo(-52, -9, -48, 0, -48, 8);
        ctx.lineWidth = 2.5;
        ctx.bezierCurveTo(-48, 12, -47, 15, -45, 14);
        
        // Flow into lower case letters
        ctx.lineWidth = 2;
        ctx.bezierCurveTo(-42, 12, -38, 8, -35, 4);
        
        // "b" with ascender
        ctx.lineWidth = 1.8;
        ctx.bezierCurveTo(-32, 0, -30, -10, -28, -18);
        ctx.lineWidth = 2.2;
        ctx.bezierCurveTo(-26, -20, -24, -18, -22, -12);
        ctx.lineWidth = 2.8;
        ctx.bezierCurveTo(-20, -6, -18, 2, -15, 8);
        ctx.bezierCurveTo(-12, 14, -5, 16, 2, 14);
        ctx.lineWidth = 2.5;
        ctx.bezierCurveTo(8, 12, 12, 8, 12, 2);
        ctx.lineWidth = 2;
        ctx.bezierCurveTo(12, -4, 8, -8, 2, -8);
        ctx.lineWidth = 1.8;
        ctx.bezierCurveTo(-4, -8, -10, -4, -12, 2);
        
        // Connected "a" with flowing loop
        ctx.lineWidth = 2.2;
        ctx.bezierCurveTo(-10, 8, -5, 12, 2, 12);
        ctx.lineWidth = 2.8;
        ctx.bezierCurveTo(10, 12, 18, 8, 22, 2);
        ctx.bezierCurveTo(26, -4, 26, -12, 20, -16);
        ctx.lineWidth = 2.2;
        ctx.bezierCurveTo(14, -20, 6, -18, 2, -12);
        ctx.lineWidth = 1.8;
        ctx.bezierCurveTo(0, -8, 0, -2, 3, 2);
        
        // Tail of "a" connecting to "r"
        ctx.lineWidth = 2;
        ctx.bezierCurveTo(6, 6, 12, 10, 18, 12);
        ctx.lineWidth = 2.5;
        ctx.bezierCurveTo(22, 13, 26, 12, 30, 8);
        
        // "r" - quick artistic stroke
        ctx.lineWidth = 2.8;
        ctx.bezierCurveTo(32, 4, 34, -2, 36, -10);
        ctx.lineWidth = 2.2;
        ctx.bezierCurveTo(37, -14, 40, -18, 45, -18);
        ctx.lineWidth = 1.6;
        ctx.bezierCurveTo(50, -18, 54, -15, 56, -12);
        
        // Flow into "k"
        ctx.lineWidth = 1.8;
        ctx.bezierCurveTo(52, -8, 50, 0, 52, 8);
        
        // "k" main vertical with dynamic pressure
        ctx.moveTo(58, -20);
        ctx.lineWidth = 2;
        ctx.bezierCurveTo(57, -12, 56, -4, 56, 4);
        ctx.lineWidth = 2.8;
        ctx.bezierCurveTo(56, 10, 57, 15, 60, 18);
        
        // K upper crossing with flair
        ctx.moveTo(56, -2);
        ctx.lineWidth = 2.5;
        ctx.bezierCurveTo(62, -8, 70, -14, 78, -16);
        ctx.lineWidth = 1.8;
        ctx.bezierCurveTo(82, -17, 85, -16, 86, -14);
        
        // K lower crossing - sweeping
        ctx.moveTo(56, 2);
        ctx.lineWidth = 2.2;
        ctx.bezierCurveTo(64, 6, 72, 10, 80, 12);
        ctx.lineWidth = 2.8;
        ctx.bezierCurveTo(88, 14, 95, 14, 100, 12);
        
        // Grand finale - dramatic flourish swooping under
        ctx.lineWidth = 3;
        ctx.bezierCurveTo(108, 10, 115, 6, 118, 0);
        ctx.lineWidth = 2.5;
        ctx.bezierCurveTo(120, -4, 120, -10, 116, -16);
        ctx.lineWidth = 2;
        ctx.bezierCurveTo(112, -22, 105, -25, 98, -24);
        ctx.lineWidth = 1.5;
        ctx.bezierCurveTo(92, -23, 88, -20, 86, -16);
        
        // Swooping underline flourish that crosses back
        ctx.lineWidth = 2.2;
        ctx.bezierCurveTo(84, -12, 80, -8, 70, -4);
        ctx.lineWidth = 2.8;
        ctx.bezierCurveTo(50, 2, 20, 8, -10, 18);
        ctx.lineWidth = 3.2;
        ctx.bezierCurveTo(-40, 25, -70, 28, -95, 26);
        ctx.lineWidth = 2.5;
        ctx.bezierCurveTo(-110, 24, -118, 20, -120, 16);
        ctx.lineWidth = 1.8;
        ctx.bezierCurveTo(-122, 12, -120, 8, -115, 6);
        ctx.lineWidth = 1.2;
        ctx.bezierCurveTo(-110, 4, -105, 4, -100, 5);
        
        ctx.stroke();
        
        // Add subtle shadow for depth and realism
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.translate(1.5, 2);
        ctx.stroke();
        
        ctx.restore();
        
        // Add some artistic dots (like ink dots from lifting pen)
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.1);
        
        ctx.fillStyle = signatureGradient;
        ctx.globalAlpha = 0.4;
        
        // Small decorative dots
        ctx.beginPath();
        ctx.arc(-108, -5, 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(115, -18, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Draw verification badge
    drawVerificationBadge() {
        const ctx = this.ctx;
        const x = this.width / 2;
        const y = this.height - 22;
        const badgeWidth = 230;
        const badgeHeight = 36;
        
        ctx.save();
        
        // Badge background
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x - badgeWidth / 2, y - badgeHeight / 2, badgeWidth, badgeHeight, 18);
        ctx.fill();
        ctx.stroke();
        
        // Checkmark icon
        this.ctx.font = '700 16px Inter';
        this.ctx.fillStyle = '#10b981';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('✓', x - 70, y);
        
        // Badge text
        this.ctx.textBaseline = 'alphabetic';
        this.drawText('VERIFIED ACHIEVEMENT', x + 12, y + 5, 11, '#10b981', '600', 'Inter');
        
        ctx.restore();
    }
    
    // Generate and display in preview
    async generatePreview() {
        // Wait for fonts to load (especially Dancing Script for signature)
        await document.fonts.ready;
        await this.draw();
        return this.canvas;
    }
    
    // Download as PNG
    async download() {
        if (!this.canvas) {
            await this.draw();
        }
        
        // Show loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(15, 23, 42, 0.95);
            color: white;
            padding: 1.5rem 2.5rem;
            border-radius: 12px;
            z-index: 20000;
            font-weight: 600;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(147, 51, 234, 0.3);
            font-family: Inter, sans-serif;
            font-size: 15px;
        `;
        loadingMsg.innerHTML = '📥 Downloading certificate...';
        document.body.appendChild(loadingMsg);
        
        // Small delay to show message
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Convert to blob and download
        this.canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `iPseudo-Certificate-${this.certType.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Remove loading message
            document.body.removeChild(loadingMsg);
            
            // Show success message
            this.showSuccessMessage();
        }, 'image/png', 1.0);
    }
    
    // Show success notification
    showSuccessMessage() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
            font-weight: 600;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        notification.innerHTML = `
            <span style="font-size: 1.25rem;">✓</span>
            <span>Certificate downloaded successfully!</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add Canvas roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

