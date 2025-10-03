#!/bin/bash

# iPseudo IDE Icon Conversion Script
# This script converts the SVG icon to various formats needed for different platforms

echo "🎨 iPseudo IDE Icon Converter"
echo "=============================="
echo ""

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed!"
    echo ""
    echo "Please install ImageMagick first:"
    echo "  macOS:   brew install imagemagick"
    echo "  Windows: choco install imagemagick"
    echo "  Linux:   sudo apt-get install imagemagick"
    echo ""
    exit 1
fi

# Determine the convert command
if command -v magick &> /dev/null; then
    CONVERT_CMD="magick convert"
else
    CONVERT_CMD="convert"
fi

echo "✅ ImageMagick found!"
echo ""

# Create output directories
mkdir -p windows
mkdir -p macos
mkdir -p linux
mkdir -p web

echo "📁 Creating platform-specific icons..."
echo ""

# ===== WINDOWS =====
echo "🪟 Converting for Windows..."
$CONVERT_CMD ipseudo-icon.svg -background none -define icon:auto-resize=256,128,64,48,32,16 windows/ipseudo-icon.ico
if [ $? -eq 0 ]; then
    echo "   ✅ Windows icon created: windows/ipseudo-icon.ico"
else
    echo "   ❌ Failed to create Windows icon"
fi
echo ""

# ===== MACOS =====
echo "🍎 Converting for macOS..."

# Check if we're on macOS and iconutil is available
if [[ "$OSTYPE" == "darwin"* ]] && command -v iconutil &> /dev/null; then
    # Create iconset directory
    mkdir -p macos/icon.iconset
    
    # Generate all required sizes for macOS
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 16x16 macos/icon.iconset/icon_16x16.png
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 32x32 macos/icon.iconset/icon_16x16@2x.png
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 32x32 macos/icon.iconset/icon_32x32.png
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 64x64 macos/icon.iconset/icon_32x32@2x.png
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 128x128 macos/icon.iconset/icon_128x128.png
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 256x256 macos/icon.iconset/icon_128x128@2x.png
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 256x256 macos/icon.iconset/icon_256x256.png
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 512x512 macos/icon.iconset/icon_256x256@2x.png
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 512x512 macos/icon.iconset/icon_512x512.png
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 1024x1024 macos/icon.iconset/icon_512x512@2x.png
    
    # Convert to .icns
    iconutil -c icns macos/icon.iconset -o macos/ipseudo-icon.icns
    
    if [ $? -eq 0 ]; then
        echo "   ✅ macOS icon created: macos/ipseudo-icon.icns"
        rm -rf macos/icon.iconset
    else
        echo "   ❌ Failed to create macOS icon"
    fi
else
    echo "   ⚠️  Skipping .icns creation (requires macOS with iconutil)"
    echo "   💡 Creating PNG fallback for macOS..."
    $CONVERT_CMD ipseudo-icon.svg -background none -resize 1024x1024 macos/ipseudo-icon.png
    echo "   ✅ macOS PNG created: macos/ipseudo-icon.png"
fi
echo ""

# ===== LINUX =====
echo "🐧 Converting for Linux..."
$CONVERT_CMD ipseudo-icon.svg -background none -resize 512x512 linux/ipseudo-icon.png
$CONVERT_CMD ipseudo-icon.svg -background none -resize 256x256 linux/ipseudo-icon-256.png
$CONVERT_CMD ipseudo-icon.svg -background none -resize 128x128 linux/ipseudo-icon-128.png
$CONVERT_CMD ipseudo-icon.svg -background none -resize 64x64 linux/ipseudo-icon-64.png
$CONVERT_CMD ipseudo-icon.svg -background none -resize 48x48 linux/ipseudo-icon-48.png
$CONVERT_CMD ipseudo-icon.svg -background none -resize 32x32 linux/ipseudo-icon-32.png

if [ $? -eq 0 ]; then
    echo "   ✅ Linux icons created in linux/"
else
    echo "   ❌ Failed to create Linux icons"
fi
echo ""

# ===== WEB / FAVICONS =====
echo "🌐 Converting for Web..."
$CONVERT_CMD ipseudo-icon.svg -background none -resize 512x512 web/icon-512.png
$CONVERT_CMD ipseudo-icon.svg -background none -resize 192x192 web/icon-192.png
$CONVERT_CMD ipseudo-icon.svg -background none -resize 180x180 web/apple-touch-icon.png
$CONVERT_CMD ipseudo-icon.svg -background none -resize 32x32 web/favicon-32.png
$CONVERT_CMD ipseudo-icon.svg -background none -resize 16x16 web/favicon-16.png

# Create multi-size favicon.ico for web
$CONVERT_CMD ipseudo-icon.svg -background none -define icon:auto-resize=48,32,16 web/favicon.ico

if [ $? -eq 0 ]; then
    echo "   ✅ Web icons created in web/"
else
    echo "   ❌ Failed to create Web icons"
fi
echo ""

# ===== SUMMARY =====
echo "=============================="
echo "✨ Icon Conversion Complete!"
echo "=============================="
echo ""
echo "📦 Generated Files:"
echo "   Windows: windows/ipseudo-icon.ico"
if [[ "$OSTYPE" == "darwin"* ]] && command -v iconutil &> /dev/null; then
    echo "   macOS:   macos/ipseudo-icon.icns"
else
    echo "   macOS:   macos/ipseudo-icon.png (use .icns converter online)"
fi
echo "   Linux:   linux/ipseudo-icon.png (and other sizes)"
echo "   Web:     web/favicon.ico (and PNG variants)"
echo ""
echo "💡 Next Steps:"
echo "   1. Copy the platform-specific icons to your build folder"
echo "   2. Update package.json with icon paths"
echo "   3. Rebuild your Electron app"
echo ""
echo "📖 See README.md for detailed usage instructions"
echo ""

