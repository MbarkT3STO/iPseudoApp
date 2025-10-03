@echo off
REM iPseudo IDE Icon Conversion Script for Windows
REM This script converts the SVG icon to various formats needed for different platforms

echo ========================================
echo   iPseudo IDE Icon Converter (Windows)
echo ========================================
echo.

REM Check if ImageMagick is installed
where magick >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: ImageMagick is not installed!
    echo.
    echo Please install ImageMagick first:
    echo   1. Download from: https://imagemagick.org/script/download.php#windows
    echo   2. Or use Chocolatey: choco install imagemagick
    echo.
    pause
    exit /b 1
)

echo ImageMagick found!
echo.

REM Create output directories
if not exist "windows" mkdir windows
if not exist "linux" mkdir linux
if not exist "web" mkdir web

echo Creating platform-specific icons...
echo.

REM ===== WINDOWS =====
echo Converting for Windows...
magick convert ipseudo-icon.svg -background none -define icon:auto-resize=256,128,64,48,32,16 windows\ipseudo-icon.ico
if %ERRORLEVEL% EQU 0 (
    echo    SUCCESS: Windows icon created: windows\ipseudo-icon.ico
) else (
    echo    ERROR: Failed to create Windows icon
)
echo.

REM ===== LINUX =====
echo Converting for Linux...
magick convert ipseudo-icon.svg -background none -resize 512x512 linux\ipseudo-icon.png
magick convert ipseudo-icon.svg -background none -resize 256x256 linux\ipseudo-icon-256.png
magick convert ipseudo-icon.svg -background none -resize 128x128 linux\ipseudo-icon-128.png
magick convert ipseudo-icon.svg -background none -resize 64x64 linux\ipseudo-icon-64.png
magick convert ipseudo-icon.svg -background none -resize 48x48 linux\ipseudo-icon-48.png
magick convert ipseudo-icon.svg -background none -resize 32x32 linux\ipseudo-icon-32.png

if %ERRORLEVEL% EQU 0 (
    echo    SUCCESS: Linux icons created in linux\
) else (
    echo    ERROR: Failed to create Linux icons
)
echo.

REM ===== WEB / FAVICONS =====
echo Converting for Web...
magick convert ipseudo-icon.svg -background none -resize 512x512 web\icon-512.png
magick convert ipseudo-icon.svg -background none -resize 192x192 web\icon-192.png
magick convert ipseudo-icon.svg -background none -resize 180x180 web\apple-touch-icon.png
magick convert ipseudo-icon.svg -background none -resize 32x32 web\favicon-32.png
magick convert ipseudo-icon.svg -background none -resize 16x16 web\favicon-16.png
magick convert ipseudo-icon.svg -background none -define icon:auto-resize=48,32,16 web\favicon.ico

if %ERRORLEVEL% EQU 0 (
    echo    SUCCESS: Web icons created in web\
) else (
    echo    ERROR: Failed to create Web icons
)
echo.

REM ===== MACOS (PNG only, .icns requires macOS) =====
echo Converting for macOS...
if not exist "macos" mkdir macos
magick convert ipseudo-icon.svg -background none -resize 1024x1024 macos\ipseudo-icon.png

if %ERRORLEVEL% EQU 0 (
    echo    SUCCESS: macOS PNG created: macos\ipseudo-icon.png
    echo    NOTE: To create .icns file, use a Mac or online converter
) else (
    echo    ERROR: Failed to create macOS icon
)
echo.

REM ===== SUMMARY =====
echo ========================================
echo   Icon Conversion Complete!
echo ========================================
echo.
echo Generated Files:
echo    Windows: windows\ipseudo-icon.ico
echo    macOS:   macos\ipseudo-icon.png (use .icns converter)
echo    Linux:   linux\ipseudo-icon.png (and other sizes)
echo    Web:     web\favicon.ico (and PNG variants)
echo.
echo Next Steps:
echo    1. Copy the platform-specific icons to your build folder
echo    2. Update package.json with icon paths
echo    3. Rebuild your Electron app
echo.
echo See README.md for detailed usage instructions
echo.
pause

