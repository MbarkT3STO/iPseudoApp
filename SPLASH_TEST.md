# Splash Screen Testing Guide

## How to Test the Splash Screen

### Method 1: Run the Main App
```bash
npm start
```
The splash screen should appear first, then automatically transition to the main app after 3-4 seconds.

### Method 2: Test Splash Screen Only
```bash
node test-splash.js
```
This will show only the splash screen for testing purposes.

### Method 3: Test with Electron Directly
```bash
npx electron test-splash.js
```

## Keyboard Shortcuts (for testing)
- **Escape**: Skip splash screen immediately
- **Enter/Space**: Complete splash screen immediately

## What to Expect

1. **Splash Window**: A beautiful, modern splash screen window (500x600px)
2. **Animations**: 
   - Rotating logo with gradient rings
   - Floating geometric shapes
   - Animated particles that follow mouse
   - Progress bar with shimmer effect
3. **Loading Steps**: Visual indicators for Editor, Console, Settings, Ready
4. **Progress**: Realistic loading progress from 0% to 100%
5. **Completion**: Confetti animation when loading completes
6. **Transition**: **Main window only appears AFTER splash completes** (4+ seconds)
7. **No Overlap**: Main UI waits for splash to finish completely

## Troubleshooting

If the splash screen doesn't appear:
1. Check that `splash.html` exists in `src/renderer/`
2. Check that `splash.css` exists in `src/renderer/styles/`
3. Check that `splash.js` exists in `src/renderer/scripts/`
4. Verify the main process is properly configured in `src/main/main.ts`

## Files Modified
- `src/main/main.ts` - Added splash window creation and IPC handling
- `src/renderer/preload.ts` - Added IPC renderer access
- `src/renderer/splash.html` - Splash screen HTML
- `src/renderer/styles/splash.css` - Splash screen styles
- `src/renderer/scripts/splash.js` - Splash screen logic
