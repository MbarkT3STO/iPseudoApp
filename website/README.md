# 🌐 iPseudo IDE Website

Beautiful static website for iPseudo IDE featuring glass morphism design that matches the Modern UI aesthetic.

## ✨ Features

- **Glass Morphism Design** - Stunning backdrop blur and gradient effects
- **Purple/Blue Color Scheme** - Matches the Modern UI perfectly
- **Fully Responsive** - Works on all devices and screen sizes
- **Smooth Animations** - Floating elements, gradient shifts, and interactive effects
- **Interactive Elements** - Tabs, hover effects, and smooth scrolling
- **Performance Optimized** - Lightweight and fast loading
- **Accessibility** - Respects reduced motion preferences

## 📁 Structure

```
website/
├── index.html          # Main landing page
├── css/
│   └── style.css       # All styles with glass morphism
├── js/
│   └── script.js       # Interactive functionality
└── assets/
    └── images/         # Screenshots and images (add your own)
```

## 🚀 Quick Start

### Local Development

Simply open `index.html` in your browser:

```bash
# Navigate to website folder
cd website

# Open in browser (macOS)
open index.html

# Or use a local server (recommended)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Using Live Server (VS Code)

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🌍 Deployment

### GitHub Pages

1. Push the website folder to your GitHub repository
2. Go to repository Settings → Pages
3. Select source branch and `/website` folder
4. Your site will be live at `https://yourusername.github.io/iPseudoApp/`

### Netlify

1. Drag and drop the `website` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repo and set build folder to `website`
3. Your site will be live instantly!

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the website directory
3. Follow the prompts
4. Your site will be deployed!

## 🎨 Customization

### Update Download Links

Edit `index.html` and replace the `#` in download buttons:

```html
<a href="YOUR_WINDOWS_DOWNLOAD_LINK" class="btn btn-download">
    <i class="ri-download-line"></i>
    <span>Download</span>
</a>
```

### Add Screenshots

1. Take screenshots of your app
2. Save them in `assets/images/`
3. Update the hero section in `index.html`

### Update GitHub Links

Replace `yourusername` with your actual GitHub username in:
- Documentation links
- Footer links
- Social links

### Modify Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --color-purple-500: rgb(147, 51, 234);
    --color-purple-600: rgb(139, 92, 246);
    --color-blue-500: rgb(59, 130, 246);
    /* Add your custom colors */
}
```

## 📱 Sections Included

1. **Hero** - Main landing with animated code editor mockup
2. **Features** - 6 feature cards with hover effects
3. **Download** - Platform-specific download cards (Windows, macOS, Linux)
4. **Syntax Examples** - Interactive tabbed code samples
5. **Documentation** - Links to documentation files
6. **About** - Tech stack and project info
7. **CTA** - Call-to-action section
8. **Footer** - Links and social media

## 🎯 Design Features

- ✨ Glass morphism with 24-32px backdrop blur
- 🌈 Purple/blue gradient scheme
- 🎨 Animated background with floating orbs
- 💫 Smooth transitions and hover effects
- 📱 Fully responsive design
- ♿ Accessibility compliant
- 🚀 Performance optimized animations

## 🛠️ Technologies

- HTML5
- CSS3 (Glass Morphism, Animations)
- JavaScript (ES6+)
- Remix Icons
- Google Fonts (Inter, JetBrains Mono)

## 📝 License

Matches the main project's dual license - free for personal/educational use, paid for commercial use.

---

## 👨‍💻 Developer

**M'BARK** - Full Stack Developer

- 🐙 GitHub: [@mbvrk](https://github.com/mbvrk)
- 💼 LinkedIn: [mbvrk](https://linkedin.com/in/mbvrk)
- 📝 Hashnode: [@mbvrk](https://hashnode.com/@mbvrk)

---

**Built with ❤️ to match iPseudo IDE's beautiful Modern UI**

