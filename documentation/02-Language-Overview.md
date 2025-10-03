# 📖 iPseudo Language Overview

A comprehensive overview of the iPseudo pseudocode language, its philosophy, and core features.

---

## 🎯 Language Philosophy

iPseudo is designed with these core principles:

### 1. **Readability First**
Code should read like natural language, making algorithms easy to understand.

### 2. **Flexibility**
Multiple syntax styles let you choose what feels most natural.

### 3. **Simplicity**
Focus on logic and algorithms, not language quirks.

### 4. **Educational**
Perfect for learning programming concepts without syntax overhead.

---

## 🔤 Case Insensitivity

iPseudo is **case-insensitive**, meaning these are all equivalent:

```pseudo
Algorithm Example
    PRINT "Hello"
    Print "World"
    print "!"
Endalgorithm
```

**All of these work:**
- `ALGORITHM` = `Algorithm` = `algorithm`
- `PRINT` = `Print` = `print`
- `VAR` = `Var` = `var`
- `IF` = `If` = `if`

💡 **Tip:** Choose a style and stay consistent for better readability!

---

## 📐 Program Structure

### Basic Structure

```pseudo
Algorithm ProgramName
    # Your code here
Endalgorithm
```

### With Comments

```pseudo
Algorithm ProgramName
# Description: What this program does
# Author: Your name
# Date: Today's date

    # Main program logic
    Print "Program starts"
    
    # Your code here
    
    Print "Program ends"
    
Endalgorithm
```

---

## 🎨 Syntax Styles

iPseudo supports **multiple syntax styles** for the same operations:

### Variable Declaration

**Style 1: Traditional**
```pseudo
var count = 0
var name = "Alice"
```

**Style 2: Variable Keyword**
```pseudo
Variable count = 0
Variable name = "Alice"
```

**Style 3: Declare with Type**
```pseudo
Declare count As Integer
Declare name As String
```

**All three styles work!** Choose what you prefer.

---

### Variable Assignment

**Style 1: Assignment Operator**
```pseudo
var x = 10
x = 20  # Update the value
```

**Style 2: Set To Syntax**
```pseudo
Variable x = 10
Set 20 To x  # Update the value
```

**Both styles work!** Mix and match as needed.

---

## 🔢 Data Types

iPseudo supports several data types:

### Primitive Types

| Type | Description | Example |
|------|-------------|---------|
| **Integer** | Whole numbers | `42`, `-10`, `0` |
| **Float** | Decimal numbers | `3.14`, `-2.5`, `0.001` |
| **Number** | Any numeric value | `42`, `3.14` |
| **String** | Text | `"Hello"`, `'World'` |
| **Boolean** | True/False | `true`, `false` |
| **Char** | Single character | `'A'`, `'z'` |

### Type Flexibility

```pseudo
Algorithm TypeFlexibility

# Numbers can be integers or floats
var count = 42          # Integer
var price = 19.99       # Float

# Strings can use double or single quotes
var text1 = "Hello"
var text2 = 'World'

# Boolean values
var isActive = true
var isComplete = false

Endalgorithm
```

---

## 🎭 Keywords

### Control Flow Keywords

- `Algorithm` / `Endalgorithm` - Program boundaries
- `If` / `Then` / `Else` / `Endif` - Conditional logic
- `For` / `To` / `Endfor` - For loops
- `While` / `Do` / `Endwhile` - While loops
- `Repeat` / `Until` - Repeat-until loops

### Variable Keywords

- `var` - Variable declaration
- `Variable` - Alternative variable declaration
- `Declare` / `As` - Type-safe variable declaration
- `Set` / `To` - Alternative assignment syntax
- `Constant` - Constant declaration

### Function Keywords

- `Function` / `Endfunction` - Function definition
- `Procedure` / `Endprocedure` - Procedure definition
- `Return` - Return a value from function

### I/O Keywords

- `Print` - Output data
- `Input` - Get user input

### Operators

- `and`, `or`, `not` - Logical operators
- `mod` - Modulus operator

---

## 📋 Naming Conventions

### Valid Names

```pseudo
# Variables
var studentName = "John"
var totalCount = 0
var isActive = true

# Algorithms
Algorithm CalculateAverage
Algorithm ProcessStudentData
Algorithm FindMaximum
```

### Invalid Names

```pseudo
# ❌ Don't use spaces
var student name = "John"  # Wrong!

# ❌ Don't start with numbers
var 1stPlace = "Gold"  # Wrong!

# ❌ Don't use special characters (except underscore)
var student-name = "John"  # Wrong!
var student@school = "John"  # Wrong!
```

### Best Practices

✅ **Use descriptive names**: `studentAge` instead of `x`  
✅ **Use camelCase**: `totalScore` instead of `totalscore`  
✅ **Be consistent**: Pick a style and stick to it  
✅ **Avoid abbreviations**: `averageScore` instead of `avgScr`  

---

## 🎯 Complete Example

Here's a complete example showcasing basic features:

```pseudo
Algorithm SimpleGradeCalculator
# A program to calculate a student's grade

# Get student information
var studentName = Input "Enter student name:"
var score = Input "Enter test score (0-100):"

Print ""
Print "=== Grade Report ==="
Print "Student:", studentName
Print "Score:", score

# Determine grade
var grade = ""

If score >= 90 Then
    grade = "A"
Else
    If score >= 80 Then
        grade = "B"
    Else
        If score >= 70 Then
            grade = "C"
        Else
            If score >= 60 Then
                grade = "D"
            Else
                grade = "F"
            Endif
        Endif
    Endif
Endif

Print "Grade:", grade

# Display status
If grade == "F" Then
    Print "Status: Failed - Please study more"
Else
    Print "Status: Passed - Good job!"
Endif

Endalgorithm
```

**Example Output:**
```
Enter student name: Sarah
Enter test score (0-100): 87

=== Grade Report ===
Student: Sarah
Score: 87
Grade: B
Status: Passed - Good job!
```

---

## 🔍 Understanding Output

When you run a program, you'll see:

### Success Output
```
✅ Execution completed successfully
Time: 5ms
```

### Error Output
```
❌ Error: Variable 'name' is not defined
Line 5: Print name
```

---

## 🎨 IDE Features

### Modern UI Highlights:

- **🎨 Syntax Highlighting** - Color-coded keywords
- **📝 Auto-completion** - Smart suggestions as you type
- **⚡ Instant Execution** - Run code with one click
- **📊 Console Output** - Clear, formatted results
- **🎯 Line Numbers** - Easy code navigation
- **🌓 Theme Support** - Dark and light modes
- **💾 Auto-save** - Never lose your work

---

## 🚦 Common Patterns

### Pattern 1: Initialize and Use
```pseudo
var total = 0
total = total + 10
Print total  # Output: 10
```

### Pattern 2: Input and Process
```pseudo
var value = Input "Enter a number:"
var doubled = value * 2
Print "Double:", doubled
```

### Pattern 3: Condition and Action
```pseudo
var age = 20
If age >= 18 Then
    Print "Adult"
Endif
```

---

## ⚠️ Common Mistakes

### 1. Forgetting End Keywords
```pseudo
# ❌ Wrong
Algorithm Test
    Print "Hello"
# Missing Endalgorithm!

# ✅ Correct
Algorithm Test
    Print "Hello"
Endalgorithm
```

### 2. Undefined Variables
```pseudo
# ❌ Wrong
Print count  # count not defined!

# ✅ Correct
var count = 0
Print count
```

### 3. Mismatched If/Endif
```pseudo
# ❌ Wrong
If x > 0 Then
    Print x
# Missing Endif!

# ✅ Correct
If x > 0 Then
    Print x
Endif
```

---

## 💡 Pro Tips

### Tip 1: Use Meaningful Names
```pseudo
# 😕 Hard to understand
var x = 85
var y = 90

# 😊 Easy to understand
var mathScore = 85
var scienceScore = 90
```

### Tip 2: Comment Complex Logic
```pseudo
# Calculate compound interest
# Formula: A = P(1 + r/n)^(nt)
var finalAmount = principal * (1 + rate / frequency) ^ (frequency * time)
```

### Tip 3: Break Down Complex Problems
```pseudo
# Break complex calculations into steps
var subtotal = price * quantity
var tax = subtotal * 0.08
var total = subtotal + tax
```

---

## 🎓 Learning Checklist

Mark off these as you master them:

- [ ] Can write a basic Algorithm structure
- [ ] Can use Print to display output
- [ ] Can declare and use variables
- [ ] Can get user Input
- [ ] Can use If statements
- [ ] Can create simple loops
- [ ] Can combine features in one program
- [ ] Understand error messages
- [ ] Can debug simple issues

---

## 🚀 Next Steps

Ready to learn more? Continue your journey:

1. **[Variables and Data Types](03-Variables-and-Data-Types.md)** - Master variables
2. **[Input and Output](05-Input-Output.md)** - Advanced I/O techniques
3. **[Conditional Statements](06-Conditional-Statements.md)** - Complex decision making

---

## 📚 Quick Reference

```pseudo
# Template for new programs
Algorithm MyProgram
    # 1. Declare variables
    var myVariable = initialValue
    
    # 2. Get input (if needed)
    var userInput = Input "Prompt:"
    
    # 3. Process data
    # Your logic here
    
    # 4. Display output
    Print "Result:", result
Endalgorithm
```

---

**Congratulations! 🎉 You're now ready to write iPseudo programs!**

Continue to **[Language Overview](02-Language-Overview.md)** to deepen your understanding →

---

*Master the fundamentals and build amazing algorithms!* 💻✨

