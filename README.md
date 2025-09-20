# iPseudo IDE

A modern Neumorphic Pseudocode IDE built with Electron, featuring soft UI design, tactile interactions, and beautiful depth effects.

## Features

- **Neumorphic Design**: Modern soft UI with depth and tactile interactions
- **Beautiful Themes**: Light and dark neumorphic themes with proper contrast
- **Monaco Editor**: Custom pseudocode syntax highlighting with neumorphic styling
- **Real-time Execution**: Sandboxed environment for pseudocode execution
- **Interactive Console**: Neumorphic console with smooth animations
- **Cross-platform**: Support for Windows, macOS, and Linux
- **Responsive Design**: Adaptive layouts for all screen sizes
- **Accessibility**: High contrast ratios and keyboard navigation
- **Modern Animations**: Smooth micro-interactions and transitions

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript files:
   ```bash
   npm run build
   ```

4. Start the application:
   ```bash
   npm start
   ```

## Development

- Run in development mode with hot reload:
  ```bash
  npm run dev
  ```

## Example Code

```pseudocode
# Calculate factorial
var n = 5
var fact = 1

for i = 1 to n
    fact = fact * i
endfor

print "Factorial of", n
print fact
```

## Supported Keywords

- Control Flow: `if`, `then`, `elseif`, `else`, `endif`, `while`, `endwhile`, `for`, `to`, `endfor`
- Variables: `var`
- Functions: `function`, `return`, `endfunction`
- I/O: `input`, `print`
- Logic: `and`, `or`, `not`
- Constants: `true`, `false`, `null`
- Control: `break`, `continue`

## License

MIT
