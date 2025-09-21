# Settings UI/Page - iPseudo IDE

## Overview
A comprehensive settings page has been created for the iPseudo IDE that matches the app's neumorphic design system and provides extensive customization options.

## Files Created

### 1. `src/renderer/settings.html`
- Main settings page HTML structure
- Organized into 6 sections: Appearance, Editor, Console, Performance, Shortcuts, and About
- Responsive design that works on desktop and mobile
- Neumorphic design elements matching the main app

### 2. `src/renderer/styles/settings.css`
- Complete CSS styling for the settings page
- Neumorphic design system integration
- Responsive layout for different screen sizes
- Dark/light theme support
- Custom scrollbars and animations

### 3. `src/renderer/scripts/settings.js`
- SettingsManager class for handling all settings functionality
- Local storage integration for persistent settings
- Real-time application of settings changes
- Form validation and UI updates

## Features

### Settings Sections

#### 1. Appearance
- **Theme Selection**: Light, Dark, or Auto (system preference)
- **Accent Color**: Custom color picker with preset options
- **UI Elements**: Toggle animations, glass effects, and particle effects

#### 2. Editor
- **Display**: Font size, font family, line height
- **Behavior**: Word wrap, minimap, auto-save, tab size

#### 3. Console
- **Display**: Console height, maximum messages, auto-scroll
- **Formatting**: Show timestamps, show icons

#### 4. Performance
- **Rendering**: Hardware acceleration, reduced motion
- **Memory**: Maximum tabs, auto-close tabs

#### 5. Shortcuts
- **Keyboard Shortcuts**: Display of all available shortcuts
- **Customization**: Ready for future shortcut customization

#### 6. About
- **App Information**: Version, description, features
- **Developer Info**: Contact information and social links

### Key Features

#### Neumorphic Design
- Soft UI elements with depth and shadows
- Tactile button interactions
- Glass morphism effects
- Smooth animations and transitions

#### Responsive Design
- Mobile-friendly layout
- Adaptive navigation
- Flexible form controls

#### Settings Persistence
- Local storage integration
- Automatic saving of changes
- Settings reset functionality

#### Real-time Application
- Immediate application of setting changes
- Live preview of modifications
- Seamless integration with main app

## Integration

### Main App Integration
- Settings button in top navigation now opens the settings page
- Settings are applied globally across the app
- Theme changes affect the entire application

### Navigation
- Back button returns to main editor
- Smooth transitions between sections
- Keyboard navigation support

## Usage

1. Click the settings button (gear icon) in the top navigation
2. Navigate between different settings sections using the sidebar
3. Modify settings using the various form controls
4. Changes are applied immediately and saved automatically
5. Use the "Reset" button to restore default settings
6. Click "Back" to return to the main editor

## Technical Details

### Settings Storage
- Settings are stored in `localStorage` under the key `iPseudoSettings`
- Default settings are defined in the `getDefaultSettings()` method
- Settings are automatically loaded on page initialization

### Theme System
- Supports light, dark, and auto themes
- Auto theme follows system preference
- Accent colors are applied globally via CSS custom properties

### Form Controls
- Toggle switches for boolean settings
- Range sliders for numeric values
- Select dropdowns for predefined options
- Color picker with preset options

### Error Handling
- Graceful fallback to default settings
- Console error logging for debugging
- User-friendly notifications

## Future Enhancements

- Keyboard shortcut customization
- Import/export settings
- Settings profiles
- Advanced editor configurations
- Plugin system integration

## Browser Compatibility

- Modern browsers with CSS Grid and Flexbox support
- Local storage support required
- CSS custom properties support needed
- ES6+ JavaScript features used

## Dependencies

- Remix Icons for UI icons
- Inter and JetBrains Mono fonts
- Neumorphism CSS design system
- Monaco Editor integration (for editor settings)
