#!/bin/bash

# Script to update headers and footers for all exercise pages
echo "🔄 Updating headers and footers for all exercise pages..."

# Define the proper header template
HEADER_TEMPLATE='    <!-- Navigation -->
    <nav class="navbar">
        <div class="navbar-container">
            <div class="navbar-brand">
                <a href="../index.html" style="display: flex; align-items: center; text-decoration: none; gap: 0.75rem;">
                    <div class="brand-icon" style="background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500)); padding: 0.5rem; border-radius: 10px;">
                        <i class="ri-book-open-line" style="color: white; font-size: 1.5rem;"></i>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.1rem;">
                        <span class="brand-text" style="font-size: 1.25rem; font-weight: 700; background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">iPseudo</span>
                        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600; letter-spacing: 0.05em;">TUTORIAL HUB</span>
                    </div>
                </a>
                <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                    <i class="ri-sun-line theme-icon" id="lightIcon"></i>
                    <i class="ri-moon-line theme-icon hidden" id="darkIcon"></i>
                </button>
            </div>

            <div class="navbar-actions">
                <a href="../index.html" class="action-btn demo-btn">
                    <i class="ri-book-open-line"></i>
                    <span>All Lessons</span>
                </a>
                <a href="exercises-index.html" class="action-btn demo-btn">
                    <i class="ri-trophy-line"></i>
                    <span>Exercise Hub</span>
                </a>
                <a href="https://ipseudoeditor.netlify.app/" target="_blank" class="action-btn download-btn">
                    <i class="ri-play-circle-line"></i>
                    <span>Try Live</span>
                </a>
            </div>
        </div>
    </nav>'

# Define the proper footer template
FOOTER_TEMPLATE='    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="brand-icon">
                        <i class="ri-code-s-slash-line"></i>
                    </div>
                    <span class="brand-name">iPseudo IDE</span>
                    <p class="footer-tagline">Making pseudocode beautiful</p>
                </div>
                
                <div class="footer-links">
                    <div class="footer-column">
                        <h4>Tutorial</h4>
                        <ul>
                            <li><a href="../index.html">All Lessons</a></li>
                            <li><a href="../01-introduction-to-pseudocode.html">Getting Started</a></li>
                            <li><a href="../06-conditional-statements.html">Conditionals</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-column">
                        <h4>Exercises</h4>
                        <ul>
                            <li><a href="exercises-index.html">Exercise Hub</a></li>
                            <li><a href="exercises-variables.html">Variables & Data Types</a></li>
                            <li><a href="exercises-operators.html">Operators</a></li>
                            <li><a href="exercises-conditionals.html">Conditionals</a></li>
                            <li><a href="exercises-loops.html">Loops</a></li>
                            <li><a href="exercises-functions.html">Functions</a></li>
                            <li><a href="exercises-arrays.html">Arrays</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-column">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="../my-notes.html">My Notes</a></li>
                            <li><a href="../statistics.html">My Statistics</a></li>
                            <li><a href="../contact.html">Contact</a></li>
                            <li><a href="https://ipseudoeditor.netlify.app/" target="_blank">Try Live Editor</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-column">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="https://github.com/MbarkT3sto/iPseudoApp/issues">Report Issue</a></li>
                            <li><a href="../contact.html">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 iPseudo IDE by <strong>M'\''BARK</strong>. Free for personal & educational use.</p>
            </div>
        </div>
    </footer>'

# List of files to update
FILES=("exercises-conditionals.html" "exercises-loops.html" "exercises-functions.html" "exercises-arrays.html" "exercises-index.html")

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Updating $file..."
        
        # Update header
        sed -i '' '/<!-- Header -->/,/<\/header>/c\
'"$HEADER_TEMPLATE" "$file"
        
        # Update footer
        sed -i '' '/<!-- Footer -->/,/<\/footer>/c\
'"$FOOTER_TEMPLATE" "$file"
        
        echo "   ✅ $file updated successfully"
    else
        echo "❌ File $file not found"
    fi
done

echo "🎉 All headers and footers updated successfully!"
