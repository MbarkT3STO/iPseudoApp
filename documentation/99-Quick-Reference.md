# ⚡ iPseudo Quick Reference

Fast lookup for all iPseudo syntax and features!

---

## 📋 Program Structure

```pseudo
Algorithm ProgramName
    # Your code here
Endalgorithm
```

---

## 💬 Comments

```pseudo
# Single line comment
Print "Code"  # Inline comment
```

---

## 📦 Variables

### Declaration Styles

```pseudo
# Style 1: Traditional
var name = value

# Style 2: Variable keyword
Variable name = value

# Style 3: Typed
Declare name As Type
Set value To name
```

### Assignment Styles

```pseudo
# Style 1: Operator
variable = value

# Style 2: Set To
Set value To variable
```

---

## 🔢 Data Types

| Type | Example | Description |
|------|---------|-------------|
| `Integer` | `42`, `-10` | Whole numbers |
| `Float` | `3.14`, `-2.5` | Decimal numbers |
| `Number` | `42`, `3.14` | Any numeric value |
| `String` | `"Hello"` | Text |
| `Boolean` | `true`, `false` | True/False values |
| `Char` | `'A'` | Single character |

---

## 💎 Constants

```pseudo
Constant PI = 3.14159
Constant MAX_SIZE = 100
```

---

## ⚡ Operators

### Arithmetic

| Operator | Operation | Example |
|----------|-----------|---------|
| `+` | Addition | `5 + 3` |
| `-` | Subtraction | `5 - 3` |
| `*` | Multiplication | `5 * 3` |
| `/` | Division | `10 / 4` |
| `mod` | Modulus | `10 mod 3` |
| `^` | Power | `2 ^ 3` |

### Comparison

| Operator | Meaning | Example |
|----------|---------|---------|
| `==` | Equal | `x == 5` |
| `!=` | Not equal | `x != 5` |
| `>` | Greater | `x > 5` |
| `<` | Less | `x < 5` |
| `>=` | Greater/Equal | `x >= 5` |
| `<=` | Less/Equal | `x <= 5` |

### Logical

| Operator | Meaning | Example |
|----------|---------|---------|
| `and` | Both true | `a and b` |
| `or` | At least one true | `a or b` |
| `not` | Opposite | `not a` |

---

## 📤 Input/Output

```pseudo
# Output
Print "text"
Print variable
Print value1, value2, value3

# Input
var name = Input "Prompt:"
```

---

## 🔀 Conditional Statements

```pseudo
# Simple IF
If condition Then
    # code
Endif

# IF-ELSE
If condition Then
    # code
Else
    # code
Endif

# Nested IF
If condition1 Then
    # code
Else
    If condition2 Then
        # code
    Endif
Endif
```

---

## 🔁 Loops

### FOR Loop

```pseudo
# Basic
For i = 1 To 10
    # code
Endfor

# With step
For i = 0 To 100 Step 10
    # code
Endfor

# Countdown
For i = 10 To 1 Step -1
    # code
Endfor
```

### WHILE Loop

```pseudo
While condition Do
    # code
Endwhile
```

### REPEAT-UNTIL Loop

```pseudo
Repeat
    # code
Until condition
```

---

## 🔧 Functions

```pseudo
# Simple function
Function name()
    # code
Endfunction

# With parameters
Function name(param1, param2)
    # code
Endfunction

# With return
Function name(param)
    # code
    Return value
Endfunction

# With types
Function name(param As Type)
    Declare result As Type
    # code
    Return result
Endfunction

# Call function
functionName(arg1, arg2)
var result = functionName(arg1)
```

---

## 🔧 Procedures

```pseudo
Procedure name(param1, param2)
    # code
Endprocedure

# Call procedure
procedureName(arg1, arg2)
```

---

## 📊 Arrays

```pseudo
# Declaration
var arrayName[size]

# Assignment
arrayName[0] = value
arrayName[1] = value

# Access
var x = arrayName[0]

# Iterate
For i = 0 To size - 1
    Print arrayName[i]
Endfor
```

---

## 🎯 Common Patterns

### Pattern 1: Input-Process-Output

```pseudo
# Input
var value = Input "Enter value:"

# Process
var result = value * 2

# Output
Print "Result:", result
```

### Pattern 2: Accumulator

```pseudo
var sum = 0
For i = 1 To 10
    sum = sum + i
Endfor
```

### Pattern 3: Counter

```pseudo
var count = 0
For i = 1 To 100
    If condition Then
        count = count + 1
    Endif
Endfor
```

### Pattern 4: Find Maximum

```pseudo
var max = array[0]
For i = 1 To size - 1
    If array[i] > max Then
        max = array[i]
    Endif
Endfor
```

### Pattern 5: Search

```pseudo
var found = false
For i = 0 To size - 1
    If array[i] == target Then
        found = true
    Endif
Endfor
```

---

## 📝 Keywords Reference

### Structure Keywords
- `Algorithm` / `Endalgorithm`
- `Function` / `Endfunction`
- `Procedure` / `Endprocedure`

### Variable Keywords
- `var`
- `Variable`
- `Declare` / `As`
- `Set` / `To`
- `Constant`

### Control Flow Keywords
- `If` / `Then` / `Else` / `Endif`
- `For` / `To` / `Step` / `Endfor`
- `While` / `Do` / `Endwhile`
- `Repeat` / `Until`

### I/O Keywords
- `Print`
- `Input`

### Other Keywords
- `Return`
- `and`, `or`, `not`
- `mod`
- `true`, `false`

---

## 🎨 Code Template

```pseudo
Algorithm TemplateName
# Description: What this program does
# Author: Your name
# Date: Today

# Constants
Constant MAX_VALUE = 100

# Variables
Declare mainVariable As Type
Variable counter = 0

# Functions
Function helperFunction(param As Type)
    Declare result As Type
    # Function logic
    Return result
Endfunction

# Main program logic
Print "Program start"

# Input
var input = Input "Enter value:"

# Processing
var result = helperFunction(input)

# Output
Print "Result:", result

Print "Program end"

Endalgorithm
```

---

## ⚠️ Common Mistakes Quick Fix

| Mistake | Fix |
|---------|-----|
| Missing `Endif` | Always close `If` with `Endif` |
| Missing `Endfor` | Always close `For` with `Endfor` |
| Missing `Endwhile` | Always close `While` with `Endwhile` |
| Missing `Endfunction` | Always close `Function` with `Endfunction` |
| Using `=` in conditions | Use `==` for comparison |
| Array index out of bounds | Use `0` to `size-1` |
| Forgetting `Return` | Functions should return values |
| Undefined variables | Declare before using |

---

## 💡 Best Practices Checklist

- [ ] Use descriptive variable names
- [ ] Add comments for complex logic
- [ ] Declare constants for fixed values
- [ ] Initialize variables before use
- [ ] Check array bounds
- [ ] Handle edge cases
- [ ] Use functions for reusable code
- [ ] Keep functions short and focused
- [ ] Indent code properly
- [ ] Test with different inputs

---

## 🎯 Syntax Comparison Table

| Feature | Traditional | Modern | Type-Safe |
|---------|------------|--------|-----------|
| Variable | `var x = 5` | `Variable x = 5` | `Declare x As Integer` |
| Assignment | `x = 10` | `Set 10 To x` | `Set 10 To x` |
| Constant | N/A | `Constant PI = 3.14` | `Constant PI = 3.14` |
| Function | `Function f(x)` | `Function f(x)` | `Function f(x As Type)` |

---

## 🚀 Performance Tips

1. **Initialize variables** to avoid undefined behavior
2. **Use constants** for values that don't change
3. **Minimize loop nesting** for clarity
4. **Use functions** to organize code
5. **Validate input** before processing
6. **Handle errors** gracefully

---

## 📚 Example Snippets

### Swap Two Variables

```pseudo
var temp = a
a = b
b = temp
```

### Check Even/Odd

```pseudo
If number mod 2 == 0 Then
    Print "Even"
Else
    Print "Odd"
Endif
```

### Sum Array

```pseudo
var sum = 0
For i = 0 To size - 1
    sum = sum + array[i]
Endfor
```

### Factorial

```pseudo
var fact = 1
For i = 1 To n
    fact = fact * i
Endfor
```

### Find in Array

```pseudo
var found = false
For i = 0 To size - 1
    If array[i] == target Then
        found = true
    Endif
Endfor
```

---

## 🎓 Learning Path

1. ✅ Basic syntax (variables, print)
2. ✅ Input/Output
3. ✅ Conditions (if/else)
4. ✅ Loops (for/while)
5. ✅ Functions
6. ✅ Arrays
7. ✅ Advanced features
8. ✅ Best practices

---

**Keep this reference handy while coding!** 📌

---

*Quick answers when you need them!* ⚡✨

