# Splash Screen Debug Guide

## Issues Fixed

### 1. Theme Synchronization
- **Problem**: Splash screen theme not syncing with app settings
- **Solution**: 
  - Added proper IPC communication to read theme from settings.json
  - Added fallback to system theme if settings unavailable
  - Added immediate theme application for better UX

### 2. Splash Screen Getting Stuck
- **Problem**: Splash screen gets stuck on app restart
- **Solution**:
  - Added state management (`isSplashComplete` flag)
  - Added proper window cleanup and null checks
  - Added timeout fallbacks and error handling
  - Added duplicate request prevention

## Testing Steps

### Test 1: Theme Synchronization
1. Run the app: `npm start`
2. Open settings and change theme to dark mode
3. Close the app completely
4. Re-run the app: `npm start`
5. **Expected**: Splash screen should appear in dark mode

### Test 2: App Restart
1. Run the app: `npm start`
2. Let splash screen complete and main app appear
3. Close the app completely
4. Re-run the app: `npm start`
5. **Expected**: Splash screen should appear and complete normally

### Test 3: Debug Mode
1. Open DevTools in splash window (if possible)
2. Check console for debug messages:
   - "Splash screen DOM loaded, initializing..."
   - "Detecting theme for splash screen..."
   - "Applied system theme: [light/dark]"
   - "Requesting theme from main process..."
   - "Splash completion notified to main process"

## Debug Commands

### Run Debug Script
```bash
node debug-splash.js
```

### Check Settings File
```bash
cat ~/Library/Application\ Support/iPseudoApp/settings.json
```

### Check Console Logs
Look for these key messages:
- Theme detection logs
- IPC communication logs
- Window creation/cleanup logs
- Error messages

## Troubleshooting

### If Theme Still Not Syncing
1. Check if settings.json exists and contains theme
2. Check console for IPC errors
3. Verify preload.js is exposing ipcRenderer

### If Splash Still Gets Stuck
1. Check console for error messages
2. Look for "Notification timeout" errors
3. Check if main window is being created
4. Verify window cleanup is working

### Manual Testing
1. Use keyboard shortcuts in splash:
   - `Escape`: Skip splash immediately
   - `Enter/Space`: Complete splash immediately
2. Check if main window appears after shortcuts

## Expected Behavior

1. **First Run**: Splash appears → Theme detected → Main window created
2. **Subsequent Runs**: Same as first run, no stuck splash
3. **Theme Changes**: Splash respects app theme setting
4. **Error Handling**: Graceful fallbacks if anything fails
