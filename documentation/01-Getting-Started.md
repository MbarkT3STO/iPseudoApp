# 🚀 Getting Started with iPseudo

Welcome to iPseudo! This guide will help you write your first pseudocode algorithm and understand the basics of the language.

---

## 📝 What is Pseudocode?

Pseudocode is a way to describe algorithms using a combination of natural language and programming concepts. It's designed to be:

- **Easy to read** - Like plain English
- **Easy to write** - No complex syntax rules
- **Language independent** - Focuses on logic, not implementation
- **Perfect for learning** - Understand concepts without language barriers

---

## 🎯 Your First Algorithm

Let's write a simple "Hello World" program in iPseudo:

```pseudo
Algorithm HelloWorld

Print "Hello, World!"
Print "Welcome to iPseudo!"

Endalgorithm
```

### Running Your Code:
1. Open iPseudo IDE
2. Type or paste the code in the editor
3. Click the **Run** button (▶️)
4. See the output in the console!

**Output:**
```
Hello, World!
Welcome to iPseudo!
```

---

## 🔤 Basic Structure

Every iPseudo program follows this structure:

```pseudo
Algorithm ProgramName
    # Your code goes here
Endalgorithm
```

### Components:
- **`Algorithm`** - Marks the start of your program
- **`ProgramName`** - A descriptive name (no spaces, use CamelCase)
- **`# Comments`** - Lines starting with # are comments
- **`Endalgorithm`** - Marks the end of your program

---

## 💬 Comments

Comments help you document your code:

```pseudo
Algorithm CommentsExample

# This is a single-line comment
# Comments are ignored during execution
# Use them to explain your code!

Print "This line runs"  # You can also add comments after code

Endalgorithm
```

**Output:**
```
This line runs
```

---

## 📊 Simple Variables

Variables store data that can change:

```pseudo
Algorithm SimpleVariables

# Declare a variable
var name = "Alice"
var age = 25
var score = 95.5

# Display the values
Print "Name:", name
Print "Age:", age
Print "Score:", score

Endalgorithm
```

**Output:**
```
Name: Alice
Age: 25
Score: 95.5
```

---

## 🔢 Basic Arithmetic

Perform calculations with numbers:

```pseudo
Algorithm BasicMath

var a = 10
var b = 3

Print "Addition:", a + b
Print "Subtraction:", a - b
Print "Multiplication:", a * b
Print "Division:", a / b
Print "Modulus:", a mod b

Endalgorithm
```

**Output:**
```
Addition: 13
Subtraction: 7
Multiplication: 30
Division: 3.3333333333333335
Modulus: 1
```

---

## 🎤 Getting User Input

Interact with users using the `Input` keyword:

```pseudo
Algorithm UserInput

var userName = Input "What is your name?"
var userAge = Input "How old are you?"

Print "Hello", userName + "!"
Print "You are", userAge, "years old"

Endalgorithm
```

**How It Works:**
1. Program shows a prompt asking for input
2. User types their response
3. Value is stored in the variable
4. You can use the variable in your code

---

## 🔀 Simple Decision Making

Use `IF` statements to make decisions:

```pseudo
Algorithm SimpleDecision

var age = Input "Enter your age:"

If age >= 18 Then
    Print "You are an adult"
Else
    Print "You are a minor"
Endif

Endalgorithm
```

**Example Output:**
```
Enter your age: 25
You are an adult
```

---

## 🔁 Simple Loop

Repeat actions using loops:

```pseudo
Algorithm SimpleLoop

Print "Counting from 1 to 5:"

For i = 1 To 5
    Print "Number:", i
Endfor

Print "Done counting!"

Endalgorithm
```

**Output:**
```
Counting from 1 to 5:
Number: 1
Number: 2
Number: 3
Number: 4
Number: 5
Done counting!
```

---

## 🎓 Your First Real Program

Let's combine everything to create a simple calculator:

```pseudo
Algorithm SimpleCalculator

Print "=== Simple Calculator ==="
Print ""

var num1 = Input "Enter first number:"
var num2 = Input "Enter second number:"

Print ""
Print "Results:"
Print "--------"
Print num1, "+", num2, "=", num1 + num2
Print num1, "-", num2, "=", num1 - num2
Print num1, "*", num2, "=", num1 * num2
Print num1, "/", num2, "=", num1 / num2

Print ""
Print "Thank you for using the calculator!"

Endalgorithm
```

**Example Session:**
```
=== Simple Calculator ===

Enter first number: 15
Enter second number: 3

Results:
--------
15 + 3 = 18
15 - 3 = 12
15 * 3 = 45
15 / 3 = 5

Thank you for using the calculator!
```

---

## 📋 Syntax Summary

| Feature | Syntax | Example |
|---------|--------|---------|
| **Algorithm** | `Algorithm Name` ... `Endalgorithm` | `Algorithm Test` |
| **Comment** | `# comment` | `# This is a comment` |
| **Variable** | `var name = value` | `var age = 25` |
| **Print** | `Print value1, value2, ...` | `Print "Hello", name` |
| **Input** | `var x = Input "prompt"` | `var age = Input "Age?"` |
| **If Statement** | `If condition Then` ... `Endif` | `If age > 18 Then` |
| **For Loop** | `For var = start To end` ... `Endfor` | `For i = 1 To 10` |

---

## 💡 Tips for Beginners

### ✅ Do's:
- **Use descriptive names** for variables and algorithms
- **Add comments** to explain complex logic
- **Test small parts** before building big programs
- **Follow the structure** (Algorithm ... Endalgorithm)
- **Use proper spacing** for readability

### ❌ Don'ts:
- **Don't forget** `Endalgorithm`, `Endif`, `Endfor`
- **Don't use spaces** in variable names (use camelCase)
- **Don't nest** too deeply (keep it simple)
- **Don't skip** the `Algorithm` declaration

---

## 🎯 Next Steps

Now that you've learned the basics, explore these topics:

1. **[Variables and Data Types](03-Variables-and-Data-Types.md)** - Deep dive into variables
2. **[Conditional Statements](06-Conditional-Statements.md)** - Advanced decision making
3. **[Loops](07-Loops.md)** - Mastering repetition
4. **[Functions](09-Functions.md)** - Creating reusable code

---

## 🎓 Practice Exercises

Try these simple exercises to practice:

### Exercise 1: Temperature Converter
Create a program that converts Celsius to Fahrenheit.

### Exercise 2: Even or Odd
Write a program that checks if a number is even or odd.

### Exercise 3: Multiplication Table
Create a program that displays the multiplication table for a given number.

### Exercise 4: Sum Calculator
Write a program that calculates the sum of numbers from 1 to N.

---

## 📌 Quick Reference Card

```pseudo
# Program Structure
Algorithm MyProgram
    # Your code here
Endalgorithm

# Variables
var name = "value"

# Output
Print "message", variable

# Input
var x = Input "prompt"

# Conditions
If condition Then
    # code
Else
    # code
Endif

# Loops
For i = 1 To 10
    # code
Endfor
```

---

## 🌟 What Makes iPseudo Special?

- **🎨 Modern IDE** - Beautiful interface with syntax highlighting
- **⚡ Instant Execution** - Run code immediately
- **🎯 Flexible Syntax** - Multiple ways to write the same thing
- **📚 Rich Examples** - Learn from real code
- **🔄 Real-time Feedback** - See results as you code
- **🌓 Theme Support** - Customize your environment

---

## 🤝 Need Help?

- Explore the **Examples** folder for more code samples
- Check the **[Common Patterns](18-Common-Patterns.md)** guide
- Review **[Debugging Tips](19-Debugging-Tips.md)** if you encounter issues

---

**Ready to dive deeper? Continue to [Language Overview](02-Language-Overview.md)** →

---

*Happy Coding! 🚀*

