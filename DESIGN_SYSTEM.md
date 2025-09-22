# 🎨 Neumorphic Design System - iPseudo IDE

## Overview

This document outlines the neumorphic design system implemented for iPseudo IDE v1.0. The new design features soft UI principles, tactile interactions, depth effects, and modern neumorphism aesthetics.

## 🎯 Design Principles

### 1. **Neumorphic & Tactile**
- Soft UI with depth and dimension
- Tactile interactions with proper feedback
- Natural shadows and highlights for depth perception
- Elements that appear to emerge from or recede into the background

### 2. **Modern Soft UI**
- Clean typography with Inter font family
- Consistent spacing and alignment
- Soft, muted color palette for visual comfort
- Gentle animations and micro-interactions

### 3. **Performance First**
- Hardware-accelerated animations
- Optimized CSS for smooth rendering
- Efficient shadow rendering and depth effects
- Minimal repaints with efficient CSS

### 4. **Accessibility**
- High contrast ratios in both light and dark themes
- Keyboard navigation support
- Screen reader friendly
- Reduced motion support for accessibility

### 5. **Responsive Design**
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements
- Consistent depth effects across devices

## 🎨 Color Palette

### Primary Colors (Soft Blue)
- **Soft Blue 50**: `#f0f7ff` - Lightest blue
- **Soft Blue 100**: `#e0efff` - Light blue
- **Soft Blue 500**: `#0a84ff` - Main blue
- **Soft Blue 600**: `#0066cc` - Darker blue
- **Soft Blue 900**: `#002d5c` - Darkest blue

### Secondary Colors (Warm Purple)
- **Warm Purple 100**: `#f3e8ff` - Light purple
- **Warm Purple 500**: `#a855f7` - Main purple
- **Warm Purple 600**: `#9333ea` - Darker purple
- **Warm Purple 900**: `#581c87` - Darkest purple

### Accent Colors (Soft Green)
- **Soft Green 100**: `#dcfce7` - Light green
- **Soft Green 500**: `#22c55e` - Success green
- **Soft Green 600**: `#16a34a` - Darker green
- **Soft Orange 500**: `#f97316` - Warning orange
- **Soft Red 500**: `#ef4444` - Error red

### Neutral Colors (Soft Grays)
- **Soft Gray 50**: `#f8fafc` - Lightest gray
- **Soft Gray 100**: `#f1f5f9` - Light gray
- **Soft Gray 500**: `#64748b` - Medium gray
- **Soft Gray 900**: `#0f172a` - Darkest gray
- **Soft Gray 950**: `#020617` - Darkest gray

## 🧩 Component System

### Neumorphic Buttons
- **Primary**: Raised appearance with soft shadows
- **Secondary**: Subtle depth with gentle shadows
- **Accent**: Enhanced depth with accent colors
- **Icon**: Circular buttons with proper depth
- **Ghost**: Minimal depth with hover effects

### Neumorphic Tabs
- **Active**: Raised appearance with soft shadows
- **Inactive**: Subtle depth with gentle shadows
- **Hover**: Enhanced depth with smooth transitions

### Neumorphic Cards
- **Default**: Raised appearance with soft shadows
- **Pressed**: Inset appearance with pressed shadows
- **Floating**: Enhanced depth with floating shadows
- **Interactive**: Hover effects with depth changes

### Neumorphic Modals
- **Overlay**: Semi-transparent with backdrop blur
- **Content**: Neumorphic background with depth
- **Animations**: Smooth scale-in effects with bounce

## 📱 Layout System

### Grid System
- **12-column responsive grid**
- **Consistent spacing**: 4px, 8px, 12px, 16px, 24px, 32px
- **Flexible containers** with proper alignment

### Typography
- **Font Family**: Inter (primary), JetBrains Mono (code)
- **Font Sizes**: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px
- **Font Weights**: 400, 500, 600, 700
- **Line Heights**: 1.25 (tight), 1.5 (normal), 1.75 (relaxed)

### Spacing
- **Consistent spacing scale** based on 4px units
- **Logical spacing** for visual hierarchy
- **Responsive spacing** that adapts to screen size

## 🌙 Theme System

### Light Theme (Default)
- Clean white backgrounds
- Dark text for readability
- Subtle shadows and borders
- Blue accent colors

### Dark Theme
- Deep dark backgrounds
- Light text for contrast
- Enhanced shadows and glows
- Brighter accent colors

### Theme Switching
- Smooth transitions between themes
- Consistent color relationships
- Preserved user preferences
- System preference detection

## ⚡ Performance Optimizations

### Hardware Acceleration
- GPU-accelerated animations
- Transform-based transitions
- Efficient shadow rendering
- Optimized backdrop filters

### Animation Performance
- Transform and opacity only
- Avoid layout-triggering properties
- Respect reduced motion preferences
- Efficient keyframe animations

### Rendering Optimization
- CSS containment for better performance
- Optimized font loading
- Efficient image rendering
- Smart z-index stacking

## 📁 File Organization

```
src/renderer/styles/
├── design-tokens.css    # Color system, spacing, typography
├── base.css            # Reset, typography, utilities
├── components.css      # Button, input, card components
├── layout.css          # Grid, navigation, main layout
├── theme.css           # Light/dark theme overrides
├── performance.css     # Performance optimizations
└── main.css           # Main stylesheet with imports
```

## 🚀 Usage Guidelines

### CSS Custom Properties
All design tokens are available as CSS custom properties:

```css
.my-component {
  background: var(--primary-500);
  color: var(--text-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
}
```

### Component Classes
Use semantic component classes:

```html
<button class="btn btn-primary">Primary Button</button>
<div class="card card-glass">Glass Card</div>
<div class="tab active">Active Tab</div>
```

### Responsive Design
Use responsive utilities:

```html
<div class="hidden sm:block">Visible on small screens and up</div>
<div class="lg:block">Visible on large screens and up</div>
```

## 🔧 Customization

### Adding New Colors
1. Add color values to `design-tokens.css`
2. Update light/dark theme overrides in `theme.css`
3. Test contrast ratios for accessibility

### Creating New Components
1. Define component styles in `components.css`
2. Add responsive variants
3. Include theme support
4. Add performance optimizations

### Modifying Layouts
1. Update layout styles in `layout.css`
2. Ensure responsive behavior
3. Test on different screen sizes
4. Maintain accessibility standards

## 📊 Performance Metrics

### Target Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimization Strategies
- **Lazy loading** for non-critical resources
- **Efficient animations** using transform/opacity
- **Optimized fonts** with font-display: swap
- **Minimal repaints** with efficient CSS

## 🎯 Future Enhancements

### Planned Features
- **Component library** documentation
- **Design tokens** export for other tools
- **Automated accessibility** testing
- **Performance monitoring** integration

### Design System Evolution
- **Regular updates** to color palette
- **New component additions** based on needs
- **Accessibility improvements** based on feedback
- **Performance optimizations** as needed

---

*This design system is continuously evolving to provide the best user experience while maintaining high performance and accessibility standards.*
