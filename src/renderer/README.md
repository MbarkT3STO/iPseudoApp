# iPseudo IDE - Modern UI

A sophisticated, modern interface for the iPseudo IDE featuring glassmorphism design, enhanced accessibility, and a comprehensive design system.

## ✨ Features

### 🎨 Visual Design
- **Glassmorphism Effects**: Beautiful frosted glass effects with subtle transparency and backdrop filters
- **Advanced Color System**: Comprehensive color palette with semantic naming and dark/light theme support
- **Modern Typography**: Inter font family with proper hierarchy and responsive sizing
- **Smooth Animations**: Micro-interactions, transitions, and hover effects for enhanced UX
- **Gradient System**: Advanced gradient library with text gradients and animated backgrounds

### 🌙 Theme System
- **Dark/Light Themes**: Seamless theme switching with system preference detection
- **High Contrast Mode**: Enhanced accessibility with high contrast theme support
- **Theme Persistence**: Automatic theme saving and restoration
- **Custom Theme Support**: Easy customization through CSS custom properties

### 📱 Responsive Design
- **Mobile-First Approach**: Optimized for all device sizes
- **Touch-Friendly**: 44px minimum touch targets and touch-optimized interactions
- **Adaptive Layout**: Flexible grid system that adapts to different screen sizes
- **Print Styles**: Optimized print layouts for documentation

### ♿ Accessibility
- **WCAG 2.1 AA Compliant**: Full accessibility compliance
- **Keyboard Navigation**: Complete keyboard support with focus management
- **Screen Reader Support**: ARIA labels, live regions, and semantic markup
- **Reduced Motion**: Respects user motion preferences
- **High Contrast**: Enhanced visibility for users with visual impairments

### 🚀 Performance
- **Optimized CSS**: Efficient selectors and minimal redundancy
- **Lazy Loading**: On-demand loading of non-critical resources
- **Debounced Interactions**: Optimized input handling and API calls
- **Memory Management**: Efficient resource cleanup and garbage collection

## 📁 File Structure

```
modern-ui/
├── index.html                      # Main HTML file with semantic structure
├── test.html                       # Test HTML file for development
├── styles/
│   ├── modern-design-tokens.css    # Comprehensive design system tokens
│   ├── modern-base.css             # Base styles, resets, and typography
│   ├── modern-layout.css           # Layout components and grid system
│   ├── modern-components.css       # UI components and interactions
│   ├── modern-theme.css            # Theme-specific styles and overrides
│   └── performance.css             # Performance optimizations
├── scripts/
│   ├── modern-app.js               # Main application logic (original)
│   ├── modern-app-enhanced.js      # Enhanced app with better architecture
│   ├── modern-editor.js            # Editor functionality and features
│   └── runner.worker.js            # Pseudocode execution worker
├── monaco/                         # Monaco editor files
└── README.md                       # This documentation
```

## 🎨 Design System

### Color Palette
The design system includes a comprehensive color palette:

```css
/* Primary Colors */
--accent-primary: #6366f1;
--accent-secondary: #8b5cf6;
--accent-tertiary: #06b6d4;

/* Extended Palette */
--accent-purple: #9333ea;
--accent-pink: #ec4899;
--accent-indigo: #4f46e5;
--accent-cyan: #06b6d4;
--accent-emerald: #10b981;
--accent-amber: #f59e0b;
--accent-red: #ef4444;
```

### Typography Scale
```css
/* Font Sizes */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

### Spacing System
```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd iPseudoApp/modern-ui
   ```

2. **Open in browser**:
   ```bash
   # Using Python (if available)
   python -m http.server 8000
   
   # Or simply open index.html in a modern browser
   open index.html
   ```

3. **Start coding**:
   - The interface automatically detects your system theme
   - Use the theme toggle (🌙/☀️) to switch themes
   - All interactions support both mouse and keyboard input

## 🛠️ Customization

### Theme Customization
```css
/* Override theme colors */
:root {
  --accent-primary: #your-color;
  --accent-secondary: #your-color;
  --bg-primary: #your-color;
  --text-primary: #your-color;
}
```

### Component Customization
```css
/* Customize button styles */
.modern-btn-custom {
  --btn-bg: var(--accent-primary);
  --btn-color: white;
  --btn-padding: var(--space-3) var(--space-6);
  --btn-radius: var(--radius-lg);
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
@media (max-width: 480px) { /* Extra small devices */ }
@media (min-width: 481px) and (max-width: 768px) { /* Small devices */ }
@media (min-width: 769px) and (max-width: 1024px) { /* Medium devices */ }
@media (min-width: 1025px) { /* Large devices */ }
```

## ♿ Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and controls
- **Escape**: Close modals and dialogs
- **Arrow Keys**: Navigate within components

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Live Regions**: Dynamic content announcements
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Focus Management**: Visible focus indicators and logical tab order

## 🔧 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Opera | 76+ | ✅ Full |

## 📊 Performance

### CSS Optimizations
- **Efficient Selectors**: Optimized CSS selectors for better performance
- **Minimal Redundancy**: Consolidated styles and reduced duplication
- **Critical CSS**: Above-the-fold styles prioritized
- **Vendor Prefixes**: Only necessary prefixes for cross-browser compatibility

### JavaScript Optimizations
- **Modular Architecture**: Clean separation of concerns
- **Error Handling**: Comprehensive error management
- **Memory Management**: Efficient resource cleanup
- **Debounced Interactions**: Optimized input handling

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style
- Follow the existing CSS architecture
- Use semantic class names
- Include comments for complex logic
- Test across all supported browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inter Font**: Beautiful typography by Rasmus Andersson
- **Fira Code**: Monospace font for code editing
- **CSS Grid**: Modern layout system
- **CSS Custom Properties**: Dynamic theming system
- **Web Accessibility Initiative**: WCAG guidelines

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Made with ❤️ for the iPseudo IDE community**
