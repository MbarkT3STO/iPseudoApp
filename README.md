# iPseudo IDE

A modern Pseudocode IDE built with Electron, featuring syntax highlighting, code execution, and a PyCharm-inspired interface.

## Features

- Beautiful dark/light theme with PyCharm-inspired UI
- Monaco Editor integration with custom pseudocode syntax highlighting
- Real-time code execution with sandboxed environment
- Interactive console output
- Cross-platform support (Windows, macOS, Linux)
- Theme switching
- Resizable panels
- Line numbers and current line highlighting

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
