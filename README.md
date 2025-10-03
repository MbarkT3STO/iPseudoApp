<div align="center">

# 🚀 iPseudo IDE

### A Modern Pseudocode IDE with Beautiful Neumorphic Design

*Learn algorithms, write pseudocode, and build your programming foundation — all in a stunning, tactile interface.*

[![License: Dual](https://img.shields.io/badge/License-Dual%20(Free%2FCommercial)-blue.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-v38.1.2-47848F?logo=electron)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Monaco Editor](https://img.shields.io/badge/Monaco-v0.43.0-0078D4?logo=visual-studio-code)](https://microsoft.github.io/monaco-editor/)

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples)

---

</div>

## 🎯 What is iPseudo?

**iPseudo** is a modern, cross-platform desktop IDE designed specifically for learning and writing pseudocode. With its beautiful neumorphic UI, intuitive syntax, and real-time execution, iPseudo makes algorithm development accessible, enjoyable, and visually stunning.

Whether you're a student learning programming concepts, an educator teaching algorithms, or a developer planning logic flow — iPseudo provides the perfect environment to think, write, and execute pseudocode effortlessly.

---

## ✨ Features

### 🎨 **Beautiful Neumorphic Design**
- Modern soft UI with tactile depth effects
- Smooth animations and micro-interactions
- Light and dark themes with seamless switching
- Carefully crafted color palette for visual comfort

### 💻 **Powerful Code Editor**
- Monaco Editor integration with custom pseudocode syntax
- Intelligent syntax highlighting
- Auto-completion and suggestions
- Line numbers and code folding
- Multiple font options (Inter, JetBrains Mono, Fira Code)

### ⚡ **Real-time Execution**
- Instant code execution with sandboxed environment
- Interactive console with user input support
- Clear error messages and debugging feedback
- Live output display

### 🔤 **Flexible Syntax**
- Case-insensitive keywords
- Multiple syntax styles (traditional, typed, natural language)
- Comprehensive language support for:
  - Variables and data types
  - Conditional statements (if/else)
  - Loops (for, while, repeat-until)
  - Functions and procedures
  - Arrays and data structures
  - Input/Output operations

### 📚 **Rich Documentation**
- Comprehensive guides and tutorials
- Interactive examples
- Quick reference cards
- Best practices and patterns

### 🌐 **Cross-Platform**
- Windows, macOS, and Linux support
- Native performance with Electron
- Consistent experience across platforms

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

### Quick Install

```bash
# Clone the repository
git clone https://github.com/mbarkt3sto/iPseudoApp.git

# Navigate to the project directory
cd iPseudoApp

# Install dependencies
npm install

# Build the application
npm run build

# Start the IDE
npm start
```

### Development Mode

```bash
# Run with hot reload
npm run dev

# Watch TypeScript files
npm run watch
```

---

## 🎓 Quick Start

### Your First Program

1. **Launch iPseudo IDE**
2. **Write your first algorithm:**

```pseudo
Algorithm HelloWorld

Print "Hello, World!"
Print "Welcome to iPseudo IDE!"

Endalgorithm
```

3. **Click the Run button (▶️)**
4. **See the output in the console!**

### Simple Examples

#### 📊 **Calculate Factorial**
```pseudo
Algorithm Factorial

var n = 5
var fact = 1

For i = 1 To n
    fact = fact * i
Endfor

Print "Factorial of", n, "is", fact

Endalgorithm
```

#### 🔢 **Grade Calculator**
```pseudo
Algorithm GradeCalculator

var score = Input "Enter your score (0-100):"

If score >= 90 Then
    Print "Grade: A - Excellent!"
Elseif score >= 80 Then
    Print "Grade: B - Good job!"
Elseif score >= 70 Then
    Print "Grade: C - Keep trying!"
Elseif score >= 60 Then
    Print "Grade: D - Needs improvement"
Else
    Print "Grade: F - Study more"
Endif

Endalgorithm
```

#### 🔁 **Sum of Numbers**
```pseudo
Algorithm SumOfNumbers

var total = 0
var count = Input "How many numbers?"

For i = 1 To count
    var num = Input "Enter number:"
    total = total + num
Endfor

Print "Sum:", total
Print "Average:", total / count

Endalgorithm
```

---

## 📖 Documentation

Explore our comprehensive documentation to master iPseudo:

| Document | Description |
|----------|-------------|
| [**Getting Started**](documentation/01-Getting-Started.md) | Introduction and first steps |
| [**Language Overview**](documentation/02-Language-Overview.md) | Core concepts and philosophy |
| [**Variables & Data Types**](documentation/03-Variables-and-Data-Types.md) | Working with data |
| [**Operators**](documentation/04-Operators.md) | Arithmetic, logical, and comparison |
| [**Input/Output**](documentation/05-Input-Output.md) | User interaction |
| [**Conditional Statements**](documentation/06-Conditional-Statements.md) | Decision making |
| [**Loops**](documentation/07-Loops.md) | Repetition and iteration |
| [**Functions**](documentation/09-Functions.md) | Reusable code blocks |
| [**Arrays**](documentation/12-Arrays.md) | Working with collections |
| [**Advanced Syntax**](documentation/14-Advanced-Syntax.md) | Pro tips and techniques |
| [**Complete Examples**](documentation/20-Complete-Examples.md) | Real-world programs |
| [**Quick Reference**](documentation/99-Quick-Reference.md) | Cheat sheet |

---

## 🎨 Design System

iPseudo features a carefully crafted neumorphic design system:

- **Soft UI Principles** - Depth, shadows, and tactile feedback
- **Design Tokens** - Consistent colors, spacing, and typography
- **Performance Optimized** - Hardware-accelerated animations
- **Accessible** - WCAG compliant with high contrast ratios
- **Responsive** - Adapts to all screen sizes

Read more in our [Design System Documentation](DESIGN_SYSTEM.md).

---

## 💡 Examples

Check out the `examples/` directory for more sample programs:

- [`comprehensive-example.pseudo`](examples/comprehensive-example.pseudo) - Full-featured demonstration
- [`variable-keyword-examples.pseudo`](examples/variable-keyword-examples.pseudo) - Variable syntax variations
- [`declare-as-type-examples.pseudo`](examples/declare-as-type-examples.pseudo) - Type declarations
- [`set-value-examples.pseudo`](examples/set-value-examples.pseudo) - Assignment operations
- [`new-features-examples.pseudo`](examples/new-features-examples.pseudo) - Latest features

---

## 🛠️ Tech Stack

iPseudo is built with modern, robust technologies:

| Technology | Purpose |
|------------|---------|
| [**Electron**](https://www.electronjs.org/) | Cross-platform desktop framework |
| [**TypeScript**](https://www.typescriptlang.org/) | Type-safe development |
| [**Monaco Editor**](https://microsoft.github.io/monaco-editor/) | VS Code-powered editor |
| **CSS3** | Neumorphic design system |
| **Web Workers** | Sandboxed code execution |

---

## 🎯 Supported Features

### Language Features
- ✅ Variables (var, Variable, Declare As)
- ✅ Data Types (Integer, Float, String, Boolean)
- ✅ Operators (Arithmetic, Logical, Comparison)
- ✅ Conditional Statements (If/Elseif/Else)
- ✅ Loops (For, While, Repeat-Until)
- ✅ Functions and Procedures
- ✅ Arrays and Collections
- ✅ Input/Output Operations
- ✅ Constants
- ✅ Comments
- ✅ Multiple Syntax Styles

### IDE Features
- ✅ Syntax Highlighting
- ✅ Code Auto-completion
- ✅ Real-time Execution
- ✅ Interactive Console
- ✅ Error Detection
- ✅ Theme Switching (Light/Dark)
- ✅ Multiple Font Options
- ✅ Settings Customization
- ✅ File Management
- ✅ Keyboard Shortcuts

---

## 🎨 Screenshots

### Light Theme
*Beautiful neumorphic design with soft shadows and depth*

### Dark Theme
*Modern dark interface optimized for low-light environments*

### Code Editor
*Monaco Editor with custom pseudocode syntax highlighting*

### Settings Panel
*Customize your experience with intuitive settings*

---

## 🤝 Contributing

Contributions are welcome! Whether you're fixing bugs, adding features, or improving documentation:

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure cross-platform compatibility

---

## 📝 License

**iPseudo IDE** uses a **dual licensing** model:

### 🆓 Free License (Personal & Educational Use)
This software is **completely free** for:
- ✅ Personal use
- ✅ Educational purposes
- ✅ Learning and teaching
- ✅ Academic research
- ✅ Non-profit organizations

Under the free license, you may use, modify, and distribute iPseudo IDE for non-commercial purposes.

### 💼 Commercial License (Business Use)
For commercial use, including but not limited to:
- 💰 Business environments
- 💰 Commercial training programs
- 💰 Professional software development
- 💰 Monetized educational content
- 💰 Corporate use

**A commercial license is required.** Please contact us for pricing and licensing terms.

---

**Questions about licensing?** See the full [LICENSE](LICENSE) file or contact us at [your-email@example.com]

---

## 🌟 Acknowledgments

- **Monaco Editor** - Powering our code editing experience
- **Electron** - Enabling cross-platform desktop development
- **Inter Font Family** - Beautiful typography
- **Neumorphism Design Movement** - Inspiring our UI/UX

---

## 📞 Support

### Need Help?
- 📖 Read the [Documentation](documentation/)
- 💬 Open an [Issue](https://github.com/yourusername/iPseudoApp/issues)
- 📧 Contact the maintainers

### Found a Bug?
Please [open an issue](https://github.com/yourusername/iPseudoApp/issues/new) with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Your environment (OS, version, etc.)

---

## 🗺️ Roadmap

### Upcoming Features
- [ ] Code snippets library
- [ ] Export to various programming languages
- [ ] Collaborative editing
- [ ] Plugin system
- [ ] Advanced debugging tools
- [ ] Mobile companion app
- [ ] Cloud sync
- [ ] Version control integration

---

## 💖 Show Your Support

If you find iPseudo helpful, please consider:

- ⭐ **Starring** this repository
- 🐦 **Sharing** with your network
- 🤝 **Contributing** to the project
- 📢 **Spreading the word**

---

<div align="center">

### Built with ❤️ for educators and learners worldwide

**[⬆ Back to Top](#-ipseudo-ide)**

---

*Making pseudocode beautiful, one algorithm at a time.* ✨

</div>
