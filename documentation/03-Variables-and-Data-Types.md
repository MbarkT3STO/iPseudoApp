# 📦 Variables and Data Types

Master variables and data types in iPseudo - the foundation of all programming!

---

## 🎯 What are Variables?

Variables are **containers** that store data. Think of them as labeled boxes where you can put values and retrieve them later.

```pseudo
Algorithm VariableBasics

var name = "Alice"      # A box labeled "name" containing "Alice"
var age = 25            # A box labeled "age" containing 25
var score = 98.5        # A box labeled "score" containing 98.5

Print name    # Look inside the "name" box
Print age     # Look inside the "age" box
Print score   # Look inside the "score" box

Endalgorithm
```

**Output:**
```
Alice
25
98.5
```

---

## 🔤 Variable Declaration Styles

iPseudo offers **three ways** to declare variables:

### Style 1: Traditional `var` Keyword

```pseudo
Algorithm TraditionalStyle

var studentName = "Bob"
var studentAge = 20
var studentGPA = 3.75
var isEnrolled = true

Print studentName, "-", "Age:", studentAge

Endalgorithm
```

**Features:**
- ✅ Simple and concise
- ✅ Familiar to programmers
- ✅ No type specification needed

---

### Style 2: `Variable` Keyword

```pseudo
Algorithm VariableKeyword

Variable studentName = "Bob"
Variable studentAge = 20
Variable studentGPA = 3.75
Variable isEnrolled = true

Print studentName, "-", "Age:", studentAge

Endalgorithm
```

**Features:**
- ✅ More explicit and readable
- ✅ Self-documenting
- ✅ Beginner-friendly

---

### Style 3: `Declare As` Type System

```pseudo
Algorithm TypedDeclaration

Declare studentName As String
Declare studentAge As Integer
Declare studentGPA As Float
Declare isEnrolled As Boolean

# Assign values later
Set "Bob" To studentName
Set 20 To studentAge
Set 3.75 To studentGPA
Set true To isEnrolled

Print studentName, "-", "Age:", studentAge

Endalgorithm
```

**Features:**
- ✅ Type-safe declarations
- ✅ Separate declaration and initialization
- ✅ Professional style
- ✅ Clear type documentation

---

## 🔄 Variable Assignment Styles

### Style 1: Assignment Operator

```pseudo
Algorithm AssignmentOperator

var count = 0       # Initialize
count = 10          # Update
count = count + 5   # Calculate and update

Print count  # Output: 15

Endalgorithm
```

---

### Style 2: `Set To` Syntax

```pseudo
Algorithm SetToSyntax

Variable count = 0          # Initialize
Set 10 To count             # Update
Set count + 5 To count      # Calculate and update

Print count  # Output: 15

Endalgorithm
```

**When to use `Set To`:**
- 📝 Makes intent clear: "Set VALUE to VARIABLE"
- 🎓 Great for beginners
- 📚 Reads like natural language

---

## 📊 Data Types in Detail

### 1. Integer (Whole Numbers)

```pseudo
Algorithm IntegerExamples

Declare age As Integer
Declare studentCount As Integer
Declare temperature As Integer

Set 25 To age
Set 150 To studentCount
Set -5 To temperature

Print "Age:", age                    # 25
Print "Students:", studentCount      # 150
Print "Temperature:", temperature    # -5

# Integer arithmetic
var a = 10
var b = 3

Print "Integer division:", a / b     # 3.333... (becomes float)
Print "Modulus:", a mod b            # 1

Endalgorithm
```

**Integer Characteristics:**
- ✅ No decimal point
- ✅ Can be positive, negative, or zero
- ✅ Used for counting, indexing
- ✅ Division creates floating-point result

---

### 2. Float (Decimal Numbers)

```pseudo
Algorithm FloatExamples

Declare price As Float
Declare temperature As Float
Declare average As Float

Set 19.99 To price
Set 98.6 To temperature
Set 85.75 To average

Print "Price: $", price
Print "Temperature:", temperature, "°F"
Print "Average:", average

# Float arithmetic
var result = 10.5 + 2.3
Print "Sum:", result              # 12.8

var division = 22.0 / 7.0
Print "Pi approximation:", division   # 3.142857...

Endalgorithm
```

**Float Characteristics:**
- ✅ Has decimal point
- ✅ Precise calculations
- ✅ Used for measurements, currency
- ✅ Can represent very large or small numbers

---

### 3. String (Text)

```pseudo
Algorithm StringExamples

Declare firstName As String
Declare lastName As String
Declare fullName As String

Set "John" To firstName
Set "Doe" To lastName

# String concatenation
Set firstName + " " + lastName To fullName

Print "Full name:", fullName  # John Doe

# Strings with quotes
var message1 = "Hello, World!"
var message2 = 'Single quotes work too!'
var quote = "He said \"Hello\""  # Escaped quotes

Print message1
Print message2
Print quote

Endalgorithm
```

**String Characteristics:**
- ✅ Enclosed in quotes (" " or ' ')
- ✅ Can contain any text
- ✅ Concatenate with + operator
- ✅ Can be empty: `""`

---

### 4. Boolean (True/False)

```pseudo
Algorithm BooleanExamples

Declare isStudent As Boolean
Declare hasLicense As Boolean
Declare canVote As Boolean

Set true To isStudent
Set false To hasLicense

var age = 20
Set age >= 18 To canVote

Print "Is student:", isStudent        # true
Print "Has license:", hasLicense      # false
Print "Can vote:", canVote            # true

# Boolean operations
var a = true
var b = false

Print "a AND b:", a and b   # false
Print "a OR b:", a or b     # true
Print "NOT a:", not a       # false

Endalgorithm
```

**Boolean Characteristics:**
- ✅ Only two values: `true` or `false`
- ✅ Result of comparisons
- ✅ Used in conditions
- ✅ Combined with logical operators

---

### 5. Number (Generic Numeric Type)

```pseudo
Algorithm NumberExamples

# Number can be integer or float
Declare value As Number

Set 42 To value
Print value  # 42

Set 3.14 To value
Print value  # 3.14

# Useful when you don't care about int vs float
Variable measurement = 10
measurement = 10.5  # Can change from int to float

Endalgorithm
```

---

### 6. Char (Single Character)

```pseudo
Algorithm CharExamples

Declare grade As Char
Declare initial As Char

Set 'A' To grade
Set 'J' To initial

Print "Grade:", grade        # A
Print "Initial:", initial    # J

Endalgorithm
```

---

## 🔄 Type Conversion

### Implicit Conversion

```pseudo
Algorithm ImplicitConversion

var a = 10        # Integer
var b = 3.5       # Float
var c = a + b     # Mixed operation

Print c           # 13.5 (automatically converted to float)

# String concatenation
var number = 42
var text = "The answer is " + number

Print text        # The answer is 42

Endalgorithm
```

---

## 🎭 Variable Scope

### Local Variables

```pseudo
Algorithm VariableScope

var globalVar = "I'm global"

For i = 1 To 3
    var localVar = "I'm local to this loop"
    Print "Loop", i, "-", localVar
Endfor

# localVar doesn't exist here
Print globalVar  # Works fine

Endalgorithm
```

---

## 💡 Advanced Variable Techniques

### Swapping Values

```pseudo
Algorithm SwapValues

var a = 10
var b = 20

Print "Before swap: a =", a, "b =", b

# Swap using temporary variable
var temp = a
a = b
b = temp

Print "After swap: a =", a, "b =", b

Endalgorithm
```

**Output:**
```
Before swap: a = 10 b = 20
After swap: a = 20 b = 10
```

---

### Accumulator Pattern

```pseudo
Algorithm AccumulatorPattern

var total = 0

For i = 1 To 10
    total = total + i
Endfor

Print "Sum of 1 to 10:", total

Endalgorithm
```

**Output:**
```
Sum of 1 to 10: 55
```

---

### Counter Pattern

```pseudo
Algorithm CounterPattern

var evenCount = 0
var oddCount = 0

For number = 1 To 20
    If number mod 2 == 0 Then
        evenCount = evenCount + 1
    Else
        oddCount = oddCount + 1
    Endif
Endfor

Print "Even numbers:", evenCount
Print "Odd numbers:", oddCount

Endalgorithm
```

**Output:**
```
Even numbers: 10
Odd numbers: 10
```

---

## 🎯 Complete Examples

### Example 1: Multiple Variable Styles

```pseudo
Algorithm MixedStyles

# Traditional style
var count = 0

# Variable keyword style
Variable name = "System"

# Declare As style
Declare value As Float
Set 99.99 To value

# All styles work together!
Print name, "- Count:", count, "Value:", value

Endalgorithm
```

---

### Example 2: Temperature Converter

```pseudo
Algorithm TemperatureConverter

Print "=== Temperature Converter ==="
Print "(Celsius to Fahrenheit)"
Print ""

Declare celsius As Float
Declare fahrenheit As Float

Variable userInput = Input "Enter temperature in Celsius:"
Set userInput To celsius

# Convert to Fahrenheit: F = C * 9/5 + 32
Set celsius * 9 / 5 + 32 To fahrenheit

Print ""
Print celsius, "°C =", fahrenheit, "°F"

Endalgorithm
```

**Example Output:**
```
=== Temperature Converter ===
(Celsius to Fahrenheit)

Enter temperature in Celsius: 25

25°C = 77°F
```

---

### Example 3: Circle Calculator

```pseudo
Algorithm CircleCalculator

Constant PI = 3.14159

var radius = Input "Enter circle radius:"

# Calculate area and circumference
var area = PI * radius * radius
var circumference = 2 * PI * radius

Print ""
Print "=== Circle Calculations ==="
Print "Radius:", radius
Print "Area:", area
Print "Circumference:", circumference

Endalgorithm
```

---

## 📋 Quick Reference

### Declaration Syntax

| Style | Syntax | Example |
|-------|--------|---------|
| Traditional | `var name = value` | `var age = 25` |
| Variable | `Variable name = value` | `Variable age = 25` |
| Typed | `Declare name As Type` | `Declare age As Integer` |

### Assignment Syntax

| Style | Syntax | Example |
|-------|--------|---------|
| Operator | `variable = value` | `age = 26` |
| Set To | `Set value To variable` | `Set 26 To age` |

### Data Types

| Type | Values | Example |
|------|--------|---------|
| Integer | Whole numbers | `42`, `-10` |
| Float | Decimals | `3.14`, `-2.5` |
| Number | Any number | `42`, `3.14` |
| String | Text | `"Hello"` |
| Boolean | true/false | `true`, `false` |
| Char | Single character | `'A'` |

---

## ⚠️ Common Pitfalls

### Pitfall 1: Uninitialized Variables
```pseudo
# ❌ Wrong
Declare count As Integer
Print count  # Error: count has no value!

# ✅ Correct
Declare count As Integer
Set 0 To count
Print count  # 0
```

### Pitfall 2: Type Mismatches
```pseudo
# Be careful with types
var text = "100"
var number = 50
var result = text + number  # String concatenation: "10050"
```

---

## 💡 Best Practices

1. **Initialize variables** when you declare them
2. **Use descriptive names** that explain the purpose
3. **Choose appropriate types** for your data
4. **Be consistent** with your syntax style
5. **Group related variables** together
6. **Comment complex variable relationships**

---

## 🎓 Practice Exercises

### Exercise 1: Variable Swap
Swap the values of two variables without using a third variable (hint: use arithmetic).

### Exercise 2: Type Showcase
Create a program that demonstrates each data type with meaningful examples.

### Exercise 3: Calculator Variables
Create variables for a calculator and perform all basic operations.

---

**Next:** Learn about **[Operators](04-Operators.md)** to manipulate your variables →

---

*Variables are the building blocks of all algorithms!* 🧱✨

