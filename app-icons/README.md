# iPseudo IDE App Icons

This folder contains the app icon for iPseudo IDE in various formats.

## 📁 Files

### Source File
- `ipseudo-icon.svg` - Original SVG source file (512x512px)

### Platform-Specific Icons
To create platform-specific icons from the SVG, follow the instructions below.

## 🎨 Icon Design

The icon features:
- **Gradient Background**: Blue to purple to cyan gradient circle
- **Code Brackets**: White curly braces representing code
- **"iP" Letters**: Representing "iPseudo"
- **Cursor Line**: Animated blinking cursor (in SVG)
- **Code Lines**: Small decorative code line indicators
- **Modern Glass Effect**: Semi-transparent elements with glow

## 🔄 Converting to Platform-Specific Formats

### For macOS (.icns)

**Option 1: Using Online Converter**
1. Go to https://cloudconvert.com/svg-to-icns
2. Upload `ipseudo-icon.svg`
3. Convert and download `ipseudo-icon.icns`

**Option 2: Using Command Line (macOS only)**
```bash
# Install imagemagick if not already installed
brew install imagemagick

# Convert SVG to PNG at different sizes
mkdir icon.iconset
sips -z 16 16     ipseudo-icon.svg --out icon.iconset/icon_16x16.png
sips -z 32 32     ipseudo-icon.svg --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     ipseudo-icon.svg --out icon.iconset/icon_32x32.png
sips -z 64 64     ipseudo-icon.svg --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   ipseudo-icon.svg --out icon.iconset/icon_128x128.png
sips -z 256 256   ipseudo-icon.svg --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   ipseudo-icon.svg --out icon.iconset/icon_256x256.png
sips -z 512 512   ipseudo-icon.svg --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   ipseudo-icon.svg --out icon.iconset/icon_512x512.png
sips -z 1024 1024 ipseudo-icon.svg --out icon.iconset/icon_512x512@2x.png

# Create .icns file
iconutil -c icns icon.iconset -o ipseudo-icon.icns

# Clean up
rm -rf icon.iconset
```

### For Windows (.ico)

**Option 1: Using Online Converter**
1. Go to https://cloudconvert.com/svg-to-ico
2. Upload `ipseudo-icon.svg`
3. Set size to 256x256 (or multi-size)
4. Convert and download `ipseudo-icon.ico`

**Option 2: Using ImageMagick**
```bash
# Install imagemagick if not already installed
# Windows: choco install imagemagick
# macOS: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Convert to ICO with multiple sizes
magick convert ipseudo-icon.svg -define icon:auto-resize=256,128,64,48,32,16 ipseudo-icon.ico
```

**Option 3: Using Inkscape**
```bash
# Install Inkscape first
# Then run:
inkscape ipseudo-icon.svg --export-type=png --export-width=256 --export-filename=temp.png
magick convert temp.png -define icon:auto-resize=256,128,64,48,32,16 ipseudo-icon.ico
rm temp.png
```

## 📦 Using in Electron App

### macOS
1. Place `ipseudo-icon.icns` in your project root or `build/` folder
2. Update `package.json`:
```json
{
  "build": {
    "appId": "com.mbark.ipseudo",
    "mac": {
      "icon": "ipseudo-icon.icns"
    }
  }
}
```

### Windows
1. Place `ipseudo-icon.ico` in your project root or `build/` folder
2. Update `package.json`:
```json
{
  "build": {
    "appId": "com.mbark.ipseudo",
    "win": {
      "icon": "ipseudo-icon.ico"
    }
  }
}
```

### Linux
1. Convert to PNG:
```bash
magick convert ipseudo-icon.svg -resize 512x512 ipseudo-icon.png
```
2. Update `package.json`:
```json
{
  "build": {
    "appId": "com.mbark.ipseudo",
    "linux": {
      "icon": "ipseudo-icon.png"
    }
  }
}
```

## 🎯 Quick Start (Recommended)

### Using electron-icon-builder (Easiest)

```bash
# Install electron-icon-builder
npm install -g electron-icon-builder

# Generate all platform icons automatically
electron-icon-builder --input=./ipseudo-icon.svg --output=./build

# This will create:
# - build/icons/mac/icon.icns (macOS)
# - build/icons/win/icon.ico (Windows)
# - build/icons/png/*.png (Linux)
```

### Using electron-builder with icon generators

```bash
# Install dependencies
npm install --save-dev electron-builder

# Create build configuration in package.json
# Then build with:
npm run build
```

## 🌐 Web & Progressive Web App

For web usage, you can use the SVG directly or convert to PNG:

```bash
# Convert to PNG for favicons
magick convert ipseudo-icon.svg -resize 192x192 favicon-192.png
magick convert ipseudo-icon.svg -resize 512x512 favicon-512.png
magick convert ipseudo-icon.svg -resize 32x32 favicon-32.png
magick convert ipseudo-icon.svg -resize 16x16 favicon-16.png
```

## 📝 Notes

- The SVG includes an animated cursor that won't appear in static formats (.ico, .icns)
- For best results, always start from the SVG source file
- The icon is optimized for both light and dark backgrounds
- The gradient colors match the app's design system

## 🎨 Color Palette

- **Blue**: #3b82f6 (Primary)
- **Purple**: #8b5cf6 (Secondary)
- **Cyan**: #06b6d4 (Accent)
- **Light Blue**: #60a5fa
- **Light Purple**: #a78bfa

## 📄 License

This icon is part of the iPseudo IDE project.
© 2024 MBARK. All rights reserved.

