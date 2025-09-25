# iPseudo IDE - Modern UI

A completely new, modern UI for iPseudo IDE with splash screen-inspired design and glass morphism effects.

## Features

- **Modern Design**: Inspired by the splash screen with glass morphism effects and smooth animations
- **Same Layout**: Maintains the exact same layout and functionality as the original UI
- **Separate Files**: Completely independent HTML, CSS, TypeScript, and JavaScript files
- **Monaco Editor**: Full Monaco editor integration with pseudocode syntax highlighting
- **Theme System**: Modern theme system with dark/light modes
- **Responsive**: Fully responsive design that works on all screen sizes
- **Accessibility**: Built with accessibility in mind

## File Structure

```
modern-ui/
├── index.html              # Main HTML file
├── test.html              # Test HTML file for development
├── styles/
│   ├── modern-design-tokens.css    # Design tokens and CSS variables
│   ├── modern-base.css            # Base styles and utilities
│   ├── modern-components.css      # Component styles
│   ├── modern-layout.css          # Layout styles
│   └── modern-theme.css           # Theme system
├── scripts/
│   ├── app.js             # Main application logic
│   ├── editor.js          # Monaco editor integration
│   ├── theme.js           # Theme management
│   ├── errorManager.js    # Error handling
│   ├── errorSystem.js     # Error system
│   └── runner.worker.js   # Pseudocode execution worker
├── monaco/                # Monaco editor files
└── README.md             # This file
```

## Design System

### Colors
- **Primary**: Blue gradient (#3b82f6 → #8b5cf6 → #06b6d4)
- **Background**: Dark editor theme (#0d1117) with glass morphism
- **Text**: High contrast white (#f0f6fc) for dark theme
- **Accents**: Success green, warning orange, error red

### Typography
- **Primary Font**: Inter (UI elements)
- **Monospace Font**: Fira Code / JetBrains Mono (code)
- **Display Font**: Inter (headings)

### Components
- **Buttons**: Modern glass morphism buttons with hover effects
- **Panels**: Glass morphism panels with backdrop blur
- **Tabs**: Smooth tab switching with active states
- **Modals**: Modern modal system with backdrop blur
- **Badges**: Gradient badges with glow effects

## Usage

1. Open `index.html` in a web browser
2. The modern UI will load with the same functionality as the original
3. Use `test.html` for development and testing

## Development

The modern UI is built with:
- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with custom properties and glass morphism
- **TypeScript**: Type-safe JavaScript
- **Monaco Editor**: VS Code editor integration

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Same as the main iPseudo IDE project.
