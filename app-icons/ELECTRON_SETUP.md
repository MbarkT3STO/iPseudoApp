# Setting Up Icons in Electron

This guide will help you integrate the iPseudo IDE icons into your Electron application.

## 📋 Prerequisites

Before starting, make sure you have:
- Node.js and npm installed
- Electron and electron-builder in your project

## 🚀 Quick Setup

### Step 1: Convert Icons

Run the conversion script to generate platform-specific formats:

```bash
cd app-icons
./convert-icons.sh
```

This will create:
- `windows/ipseudo-icon.ico` - Windows icon
- `macos/ipseudo-icon.icns` - macOS icon (requires macOS)
- `linux/ipseudo-icon.png` - Linux icon
- `web/` - Web favicons

### Step 2: Copy Icons to Build Folder

```bash
# Create build folder if it doesn't exist
mkdir -p build

# Copy platform-specific icons
cp app-icons/windows/ipseudo-icon.ico build/icon.ico
cp app-icons/macos/ipseudo-icon.icns build/icon.icns  # macOS only
cp app-icons/linux/ipseudo-icon.png build/icon.png
```

### Step 3: Update package.json

Add or update the `build` section in your `package.json`:

```json
{
  "name": "ipseudo-ide",
  "version": "1.0.0",
  "main": "dist/main/main.js",
  "build": {
    "appId": "com.mbark.ipseudo",
    "productName": "iPseudo IDE",
    "directories": {
      "buildResources": "build"
    },
    "mac": {
      "category": "public.app-category.developer-tools",
      "icon": "build/icon.icns",
      "target": [
        "dmg",
        "zip"
      ]
    },
    "win": {
      "icon": "build/icon.ico",
      "target": [
        "nsis",
        "portable"
      ]
    },
    "linux": {
      "icon": "build/icon.png",
      "category": "Development",
      "target": [
        "AppImage",
        "deb"
      ]
    },
    "files": [
      "dist/**/*",
      "node_modules/**/*",
      "package.json"
    ]
  }
}
```

### Step 4: Build Your App

```bash
# For development (all platforms)
npm run build

# For specific platform
npm run build -- --mac
npm run build -- --win
npm run build -- --linux
```

## 🔧 Advanced Configuration

### Using Different Icon Sizes

If you want to use different icon sizes for different purposes:

```json
{
  "build": {
    "mac": {
      "icon": "build/icon.icns"
    },
    "win": {
      "icon": "build/icon.ico"
    },
    "linux": {
      "icon": "build/icons"
    }
  }
}
```

For Linux, you can provide multiple sizes:

```bash
mkdir -p build/icons
cp app-icons/linux/ipseudo-icon-512.png build/icons/512x512.png
cp app-icons/linux/ipseudo-icon-256.png build/icons/256x256.png
cp app-icons/linux/ipseudo-icon-128.png build/icons/128x128.png
cp app-icons/linux/ipseudo-icon-64.png build/icons/64x64.png
cp app-icons/linux/ipseudo-icon-48.png build/icons/48x48.png
cp app-icons/linux/ipseudo-icon-32.png build/icons/32x32.png
```

### Setting Window Icon at Runtime

In your main process (`main.ts` or `main.js`):

```typescript
import { app, BrowserWindow } from 'electron';
import path from 'path';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../../build/icon.png'), // or icon.ico on Windows
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  mainWindow.loadFile('dist/renderer/index.html');
}

app.whenReady().then(createWindow);
```

### Setting App Icon for Packaged App

The icon set in `package.json` under `build` will be automatically used when you package your app with electron-builder.

## 🌐 Web Icon Setup

For the web version of your app or PWA, add these to your HTML:

```html
<!-- In your index.html <head> section -->

<!-- Standard favicon -->
<link rel="icon" type="image/x-icon" href="app-icons/web/favicon.ico">

<!-- PNG favicons for modern browsers -->
<link rel="icon" type="image/png" sizes="16x16" href="app-icons/web/favicon-16.png">
<link rel="icon" type="image/png" sizes="32x32" href="app-icons/web/favicon-32.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="app-icons/web/apple-touch-icon.png">

<!-- Android Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="app-icons/web/icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="app-icons/web/icon-512.png">

<!-- Web App Manifest -->
<link rel="manifest" href="manifest.json">
```

And create a `manifest.json`:

```json
{
  "name": "iPseudo IDE",
  "short_name": "iPseudo",
  "description": "Modern Pseudocode Development Environment",
  "icons": [
    {
      "src": "app-icons/web/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "app-icons/web/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#0f172a"
}
```

## 🎯 Troubleshooting

### Icon Not Showing in Windows

1. Make sure the `.ico` file has multiple sizes (16, 32, 48, 256)
2. Clear the icon cache:
   ```bash
   ie4uinit.exe -show
   ```
3. Rebuild your app

### Icon Not Showing in macOS

1. Ensure you're using `.icns` format
2. The icon must include all required sizes (16, 32, 64, 128, 256, 512, 1024 - both standard and @2x)
3. Rebuild your app and reinstall

### Icon Not Showing in Linux

1. Use PNG format
2. Make sure the icon is at least 256x256
3. Check the `.desktop` file has the correct icon path

### Icon Looks Blurry

1. Make sure you're using the SVG source for conversion
2. Ensure all required sizes are included in the .ico/.icns
3. Use higher resolution source (512x512 or 1024x1024)

## 📝 Notes

- Always start from the SVG source file for best quality
- Test icons on all target platforms before release
- Keep the SVG file for future updates
- Consider creating variants for different themes (light/dark)

## 🔄 Updating Icons

To update your app icon:

1. Edit `ipseudo-icon.svg`
2. Run `./convert-icons.sh` again
3. Copy new icons to build folder
4. Rebuild your app

## 📚 Additional Resources

- [Electron Builder Documentation](https://www.electron.build/configuration/configuration)
- [macOS Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/macos/icons-and-images/app-icon/)
- [Windows Icon Guidelines](https://docs.microsoft.com/en-us/windows/apps/design/style/iconography/app-icons)

---

**Need help?** Check the main README.md or open an issue on GitHub.

