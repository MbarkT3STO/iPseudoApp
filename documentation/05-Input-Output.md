# 💬 Input and Output in iPseudo

Master user interaction and data display with Input and Print statements!

---

## 🎯 Overview

Input and Output (I/O) are fundamental to interactive programs:
- **Input** - Get data from the user
- **Print** - Display data to the user

---

## 📤 The Print Statement

Display text, numbers, and variables to the console.

### Basic Syntax

```pseudo
Print value
Print value1, value2, value3, ...
```

---

### Simple Print Examples

```pseudo
Algorithm SimplePrint

# Print text
Print "Hello, World!"

# Print numbers
Print 42
Print 3.14159

# Print boolean
Print true

Endalgorithm
```

**Output:**
```
Hello, World!
42
3.14159
true
```

---

### Printing Multiple Values

```pseudo
Algorithm MultiplePrint

var name = "Alice"
var age = 25
var score = 95.5

# Print multiple values separated by commas
Print "Name:", name
Print "Age:", age, "years"
Print "Score:", score, "out of 100"

# All in one line
Print name, "is", age, "years old with score", score

Endalgorithm
```

**Output:**
```
Name: Alice
Age: 25 years
Score: 95.5 out of 100
Alice is 25 years old with score 95.5
```

---

### Printing with Concatenation

```pseudo
Algorithm PrintConcatenation

var firstName = "John"
var lastName = "Doe"

# Using + to combine strings
Print "Full name: " + firstName + " " + lastName

# Mixing concatenation and commas
var age = 30
Print firstName + " " + lastName, "- Age:", age

Endalgorithm
```

**Output:**
```
Full name: John Doe
John Doe - Age: 30
```

---

### Empty Lines

```pseudo
Algorithm EmptyLines

Print "First line"
Print ""              # Empty line
Print "Third line"
Print ""
Print ""
Print "Sixth line"

Endalgorithm
```

**Output:**
```
First line

Third line


Sixth line
```

---

## 📥 The Input Statement

Get data from users with interactive prompts.

### Basic Syntax

```pseudo
var variableName = Input "Prompt message"
```

---

### Simple Input Examples

```pseudo
Algorithm SimpleInput

# Get text input
var name = Input "What is your name?"
Print "Hello,", name + "!"

# Get number input
var age = Input "What is your age?"
Print "You are", age, "years old"

# Get any input
var favoriteColor = Input "What is your favorite color?"
Print "Nice! I like", favoriteColor, "too!"

Endalgorithm
```

**Example Session:**
```
What is your name? Sarah
Hello, Sarah!
What is your age? 22
You are 22 years old
What is your favorite color? Blue
Nice! I like Blue too!
```

---

### Using Input in Calculations

```pseudo
Algorithm InputCalculations

Print "=== Rectangle Area Calculator ==="
Print ""

var length = Input "Enter rectangle length:"
var width = Input "Enter rectangle width:"

# Calculate area
var area = length * width

Print ""
Print "Rectangle dimensions:", length, "x", width
Print "Area:", area, "square units"

Endalgorithm
```

**Example Session:**
```
=== Rectangle Area Calculator ===

Enter rectangle length: 5
Enter rectangle width: 8

Rectangle dimensions: 5 x 8
Area: 40 square units
```

---

### Multiple Inputs

```pseudo
Algorithm MultipleInputs

Print "=== Student Information Form ==="
Print ""

Declare studentName As String
Declare studentAge As Integer
Declare studentGPA As Float

Variable nameInput = Input "Student name:"
Variable ageInput = Input "Student age:"
Variable gpaInput = Input "Student GPA:"

Set nameInput To studentName
Set ageInput To studentAge
Set gpaInput To studentGPA

Print ""
Print "=== Student Record ==="
Print "Name:", studentName
Print "Age:", studentAge
Print "GPA:", studentGPA

# Calculate status
If studentGPA >= 3.5 Then
    Print "Status: Honor Roll"
Else
    Print "Status: Good Standing"
Endif

Endalgorithm
```

---

## 🎨 Formatted Output

Create beautiful, formatted output:

### Example 1: Table Format

```pseudo
Algorithm TableFormat

Print "================================"
Print "|  Name    |  Age  |  Score  |"
Print "================================"

var name1 = "Alice"
var age1 = 25
var score1 = 95

var name2 = "Bob"
var age2 = 30
var score2 = 88

Print "| ", name1, "  |  ", age1, "  |   ", score1, "   |"
Print "| ", name2, "    |  ", age2, "  |   ", score2, "   |"
Print "================================"

Endalgorithm
```

**Output:**
```
================================
|  Name    |  Age  |  Score  |
================================
|  Alice   |   25  |    95   |
|  Bob     |   30  |    88   |
================================
```

---

### Example 2: Progress Indicator

```pseudo
Algorithm ProgressIndicator

Print "Loading..."

For i = 1 To 5
    Print "Progress:", i * 20, "%"
Endfor

Print "Complete!"

Endalgorithm
```

**Output:**
```
Loading...
Progress: 20 %
Progress: 40 %
Progress: 60 %
Progress: 80 %
Progress: 100 %
Complete!
```

---

### Example 3: Report Generator

```pseudo
Algorithm ReportGenerator

var companyName = "TechCorp"
var year = 2024
var revenue = 1500000
var expenses = 1200000
var profit = revenue - expenses

Print "╔═══════════════════════════════╗"
Print "║   ANNUAL FINANCIAL REPORT     ║"
Print "╚═══════════════════════════════╝"
Print ""
Print "Company:", companyName
Print "Year:", year
Print ""
Print "Revenue:  $", revenue
Print "Expenses: $", expenses
Print "─────────────────────────────────"
Print "Profit:   $", profit
Print ""

If profit > 0 Then
    Print "📈 Status: Profitable"
Else
    Print "📉 Status: Loss"
Endif

Endalgorithm
```

---

## 🔢 Input Validation Example

```pseudo
Algorithm InputValidation

Print "=== Age Validator ==="
Print ""

var age = Input "Enter your age (1-120):"

# Validate input
If age < 1 or age > 120 Then
    Print "❌ Error: Invalid age!"
    Print "Please enter a value between 1 and 120"
Else
    Print "✅ Valid age:", age
    
    # Process valid age
    If age < 18 Then
        Print "Category: Minor"
    Else
        If age < 65 Then
            Print "Category: Adult"
        Else
            Print "Category: Senior"
        Endif
    Endif
Endif

Endalgorithm
```

---

## 🎯 Interactive Menu Example

```pseudo
Algorithm InteractiveMenu

Print "╔═══════════════════════╗"
Print "║   MAIN MENU           ║"
Print "╚═══════════════════════╝"
Print ""
Print "1. Start Game"
Print "2. View High Scores"
Print "3. Settings"
Print "4. Exit"
Print ""

var choice = Input "Enter your choice (1-4):"

Print ""

If choice == 1 Then
    Print "🎮 Starting game..."
Else
    If choice == 2 Then
        Print "🏆 High Scores:"
        Print "1. Alice - 1500"
        Print "2. Bob - 1200"
    Else
        If choice == 3 Then
            Print "⚙️ Opening settings..."
        Else
            If choice == 4 Then
                Print "👋 Goodbye!"
            Else
                Print "❌ Invalid choice!"
            Endif
        Endif
    Endif
Endif

Endalgorithm
```

---

## 🎨 Output Styling Tips

### Use Separators

```pseudo
Print "==="
Print "---"
Print "***"
Print "═══"
Print "───"
```

### Use Emojis (in strings)

```pseudo
Print "✅ Success!"
Print "❌ Error!"
Print "⚠️ Warning!"
Print "💡 Tip:"
Print "🎯 Goal:"
```

### Use Boxes and Lines

```pseudo
Print "┌────────────┐"
Print "│  Title     │"
Print "└────────────┘"
```

---

## 💡 Best Practices

### 1. Clear Prompts
```pseudo
# ❌ Unclear
var x = Input "Enter:"

# ✅ Clear
var age = Input "Enter your age (years):"
```

### 2. Informative Output
```pseudo
# ❌ Just numbers
Print 42

# ✅ With context
Print "The answer is:", 42
```

### 3. Structured Display
```pseudo
# Use blank lines for readability
Print "Section 1"
Print "Data here"
Print ""
Print "Section 2"
Print "More data"
```

### 4. Confirm User Input
```pseudo
var name = Input "Enter name:"
Print "You entered:", name  # Confirm back to user
```

---

## 🎓 Complete I/O Example

```pseudo
Algorithm CompleteSurvey

Print "╔════════════════════════════════╗"
Print "║   CUSTOMER SATISFACTION SURVEY ║"
Print "╚════════════════════════════════╝"
Print ""

# Collect information
var customerName = Input "Your name:"
var productName = Input "Product purchased:"
var rating = Input "Rating (1-5):"
var wouldRecommend = Input "Would recommend? (yes/no):"

Print ""
Print "═════════════════════════════════"
Print "   SURVEY SUMMARY"
Print "═════════════════════════════════"
Print ""
Print "Customer: ", customerName
Print "Product:  ", productName
Print "Rating:   ", rating, "/ 5"
Print "Recommend:", wouldRecommend
Print ""

# Analyze rating
If rating >= 4 Then
    Print "😊 Thank you for the great feedback!"
Else
    If rating >= 2 Then
        Print "🤔 We'll work on improving!"
    Else
        Print "😔 We're sorry. We'll do better!"
    Endif
Endif

Print ""
Print "Thank you for your time!"

Endalgorithm
```

---

## 📋 Quick Reference

### Print Syntax
```pseudo
Print "text"                    # Print text
Print variable                  # Print variable value
Print "text", variable          # Print both
Print value1, value2, value3    # Print multiple values
Print ""                        # Print empty line
```

### Input Syntax
```pseudo
var name = Input "prompt"       # Get input into variable
```

### Common Patterns
```pseudo
# Pattern 1: Input-Process-Output
var input = Input "Enter value:"
var result = input * 2
Print "Result:", result

# Pattern 2: Prompt-Confirm-Use
var name = Input "Name:"
Print "Hello,", name
# ... use name later ...

# Pattern 3: Multiple Inputs
var x = Input "X:"
var y = Input "Y:"
Print "Sum:", x + y
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Not Storing Input
```pseudo
# ❌ Wrong
Input "Enter name:"  # Input is lost!

# ✅ Correct
var name = Input "Enter name:"  # Input is stored
```

### Pitfall 2: Printing Without Labels
```pseudo
# ❌ Unclear
Print result

# ✅ Clear
Print "The result is:", result
```

---

**Next:** Learn about **[Conditional Statements](06-Conditional-Statements.md)** →

---

*Great I/O makes great programs!* 💬✨

