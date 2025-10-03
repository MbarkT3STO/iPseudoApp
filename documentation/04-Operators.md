# ⚡ Operators in iPseudo

Master all operators to perform calculations, comparisons, and logical operations!

---

## 🎯 What are Operators?

Operators are **symbols** that perform operations on values and variables. They're the tools you use to manipulate data.

---

## 🔢 Arithmetic Operators

Perform mathematical calculations:

| Operator | Operation | Example | Result |
|----------|-----------|---------|--------|
| `+` | Addition | `5 + 3` | `8` |
| `-` | Subtraction | `5 - 3` | `2` |
| `*` | Multiplication | `5 * 3` | `15` |
| `/` | Division | `10 / 4` | `2.5` |
| `mod` | Modulus (remainder) | `10 mod 3` | `1` |
| `^` | Exponentiation | `2 ^ 3` | `8` |

### Complete Example

```pseudo
Algorithm ArithmeticOperators

var a = 15
var b = 4

Print "=== Arithmetic Operations ==="
Print "a =", a, "| b =", b
Print ""

Print "Addition: a + b =", a + b
Print "Subtraction: a - b =", a - b
Print "Multiplication: a * b =", a * b
Print "Division: a / b =", a / b
Print "Modulus: a mod b =", a mod b
Print "Exponentiation: a ^ 2 =", a ^ 2

Endalgorithm
```

**Output:**
```
=== Arithmetic Operations ===
a = 15 | b = 4

Addition: a + b = 19
Subtraction: a - b = 11
Multiplication: a * b = 60
Division: a / b = 3.75
Modulus: a mod b = 3
Exponentiation: a ^ 2 = 225
```

---

## 🔍 Comparison Operators

Compare values and get boolean results:

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `==` | Equal to | `5 == 5` | `true` |
| `!=` | Not equal to | `5 != 3` | `true` |
| `>` | Greater than | `5 > 3` | `true` |
| `<` | Less than | `5 < 3` | `false` |
| `>=` | Greater or equal | `5 >= 5` | `true` |
| `<=` | Less or equal | `5 <= 3` | `false` |

### Complete Example

```pseudo
Algorithm ComparisonOperators

var score = 85
var passingGrade = 60
var perfectScore = 100

Print "=== Comparison Operations ==="
Print "Score:", score
Print ""

Print "Score == 85:", score == 85                    # true
Print "Score != 100:", score != 100                  # true
Print "Score > passing:", score > passingGrade       # true
Print "Score < perfect:", score < perfectScore       # true
Print "Score >= 85:", score >= 85                    # true
Print "Score <= 100:", score <= 100                  # true

Endalgorithm
```

**Output:**
```
=== Comparison Operations ===
Score: 85

Score == 85: true
Score != 100: true
Score > passing: true
Score < perfect: true
Score >= 85: true
Score <= 100: true
```

---

## 🧠 Logical Operators

Combine boolean expressions:

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `and` | Both true | `true and true` | `true` |
| `or` | At least one true | `true or false` | `true` |
| `not` | Opposite | `not true` | `false` |

### Truth Tables

**AND Operator:**
```
true  and true  = true
true  and false = false
false and true  = false
false and false = false
```

**OR Operator:**
```
true  or true  = true
true  or false = true
false or true  = true
false or false = false
```

**NOT Operator:**
```
not true  = false
not false = true
```

### Complete Example

```pseudo
Algorithm LogicalOperators

var age = 25
var hasLicense = true
var hasInsurance = false

Print "=== Logical Operations ==="
Print ""

# AND operator
var canDrive = age >= 18 and hasLicense
Print "Can drive:", canDrive  # true

# OR operator
var needsDocuments = hasLicense or hasInsurance
Print "Has any document:", needsDocuments  # true

# NOT operator
var missingInsurance = not hasInsurance
Print "Missing insurance:", missingInsurance  # true

# Complex condition
var fullyQualified = age >= 18 and hasLicense and hasInsurance
Print "Fully qualified:", fullyQualified  # false

Endalgorithm
```

**Output:**
```
=== Logical Operations ===

Can drive: true
Has any document: true
Missing insurance: true
Fully qualified: false
```

---

## 🔗 String Operators

### String Concatenation

```pseudo
Algorithm StringConcatenation

var firstName = "John"
var lastName = "Smith"
var age = 30

# Concatenate strings with +
var fullName = firstName + " " + lastName
Print fullName  # John Smith

# Concatenate string with number
var message = firstName + " is " + age + " years old"
Print message  # John is 30 years old

# Multiple concatenations
var greeting = "Hello, " + firstName + "! Welcome!"
Print greeting  # Hello, John! Welcome!

Endalgorithm
```

---

## ⚙️ Operator Precedence

Operations are performed in this order (highest to lowest):

1. **Parentheses** `( )`
2. **Exponentiation** `^`
3. **Multiplication/Division/Modulus** `*`, `/`, `mod`
4. **Addition/Subtraction** `+`, `-`
5. **Comparison** `>`, `<`, `>=`, `<=`, `==`, `!=`
6. **NOT** `not`
7. **AND** `and`
8. **OR** `or`

### Example

```pseudo
Algorithm OperatorPrecedence

var result1 = 5 + 3 * 2       # 11 (not 16) - multiplication first
var result2 = (5 + 3) * 2     # 16 - parentheses first

var result3 = 10 / 2 + 3      # 8 - division, then addition
var result4 = 10 / (2 + 3)    # 2 - addition first

var result5 = 2 ^ 3 * 2       # 16 - exponentiation first
var result6 = (2 ^ 3) * 2     # 16 - same result (explicit)

Print result1  # 11
Print result2  # 16
Print result3  # 8
Print result4  # 2
Print result5  # 16
Print result6  # 16

Endalgorithm
```

**💡 Tip:** When in doubt, **use parentheses** to make your intent clear!

---

## 🎯 Practical Examples

### Example 1: BMI Calculator

```pseudo
Algorithm BMICalculator

Print "=== BMI Calculator ==="
Print ""

Declare weight As Float
Declare height As Float
Declare bmi As Float

Variable weightInput = Input "Enter weight (kg):"
Variable heightInput = Input "Enter height (m):"

Set weightInput To weight
Set heightInput To height

# Calculate BMI: weight / (height ^ 2)
Set weight / (height ^ 2) To bmi

Print ""
Print "Your BMI:", bmi

# Determine category
If bmi < 18.5 Then
    Print "Category: Underweight"
Else
    If bmi < 25 Then
        Print "Category: Normal weight"
    Else
        If bmi < 30 Then
            Print "Category: Overweight"
        Else
            Print "Category: Obese"
        Endif
    Endif
Endif

Endalgorithm
```

---

### Example 2: Grade Evaluator with Logic

```pseudo
Algorithm GradeEvaluator

var score = Input "Enter score (0-100):"
var attendance = Input "Enter attendance (0-100):"

Print ""
Print "=== Grade Evaluation ==="

# Multiple conditions with logical operators
var passed = score >= 60 and attendance >= 75
var honorRoll = score >= 90 and attendance >= 90
var needsHelp = score < 60 or attendance < 50

Print "Score:", score
Print "Attendance:", attendance, "%"
Print ""

Print "Passed:", passed
Print "Honor Roll:", honorRoll
Print "Needs Help:", needsHelp

# Complex decision
If passed and not needsHelp Then
    Print "Status: Good standing"
Else
    Print "Status: Needs improvement"
Endif

Endalgorithm
```

---

### Example 3: Shopping Cart

```pseudo
Algorithm ShoppingCart

Constant TAX_RATE = 0.08

Print "=== Shopping Cart ==="
Print ""

Declare itemPrice As Float
Declare quantity As Integer
Declare subtotal As Float
Declare tax As Float
Declare total As Float

Variable priceInput = Input "Enter item price:"
Variable qtyInput = Input "Enter quantity:"

Set priceInput To itemPrice
Set qtyInput To quantity

# Calculate totals
Set itemPrice * quantity To subtotal
Set subtotal * TAX_RATE To tax
Set subtotal + tax To total

Print ""
Print "Subtotal: $", subtotal
Print "Tax (8%): $", tax
Print "Total: $", total

# Discount logic
var hasDiscount = total >= 100
If hasDiscount Then
    var discount = total * 0.1
    var finalTotal = total - discount
    Print ""
    Print "Discount (10%): $", discount
    Print "Final Total: $", finalTotal
Endif

Endalgorithm
```

---

## 🎲 Advanced Operator Usage

### Compound Expressions

```pseudo
Algorithm CompoundExpressions

var x = 5
var y = 10
var z = 15

# Multiple operations in one expression
var result = (x + y) * z - x ^ 2

Print "Result:", result  # (15) * 15 - 25 = 200

# Complex boolean expression
var inRange = x > 0 and y < 20 and z <= 15
Print "In range:", inRange  # true

Endalgorithm
```

---

### Increment and Accumulate

```pseudo
Algorithm IncrementPatterns

var counter = 0

# Standard increment
counter = counter + 1
Print "Counter:", counter  # 1

# Increment by different amounts
counter = counter + 5
Print "Counter:", counter  # 6

# Accumulate values
var sum = 0
For i = 1 To 5
    sum = sum + i
Endfor
Print "Sum:", sum  # 15

Endalgorithm
```

---

## 📊 Operator Cheat Sheet

```pseudo
Algorithm OperatorCheatSheet

# Arithmetic
var add = 10 + 5        # 15
var sub = 10 - 5        # 5
var mul = 10 * 5        # 50
var div = 10 / 5        # 2
var mod = 10 mod 3      # 1
var exp = 2 ^ 8         # 256

# Comparison
var eq = 5 == 5         # true
var ne = 5 != 3         # true
var gt = 5 > 3          # true
var lt = 5 < 3          # false
var ge = 5 >= 5         # true
var le = 5 <= 3         # false

# Logical
var andOp = true and false    # false
var orOp = true or false      # true
var notOp = not true          # false

# String
var concat = "Hello" + " " + "World"  # Hello World

Print "All operators working!"

Endalgorithm
```

---

## ⚠️ Common Mistakes

### Mistake 1: Using = in Conditions
```pseudo
# ❌ Wrong
If score = 100 Then  # This is assignment, not comparison!

# ✅ Correct
If score == 100 Then  # This is comparison
```

### Mistake 2: Forgetting Parentheses
```pseudo
# ❌ Unclear
var result = a + b * c  # What's calculated first?

# ✅ Clear
var result = a + (b * c)  # Explicit order
```

### Mistake 3: Integer Division Confusion
```pseudo
var result = 10 / 3  # Result: 3.333... (float, not integer)
```

---

## 💡 Pro Tips

### Tip 1: Use Parentheses for Clarity
```pseudo
# Good: Clear intent
var average = (a + b + c) / 3
```

### Tip 2: Break Complex Expressions
```pseudo
# Instead of this:
var result = (a + b) * (c - d) / (e + f)

# Do this:
var sum = a + b
var difference = c - d
var divisor = e + f
var result = sum * difference / divisor
```

### Tip 3: Use Constants for Special Values
```pseudo
Constant PI = 3.14159
Constant TAX_RATE = 0.08

var area = PI * radius ^ 2
var tax = price * TAX_RATE
```

---

## 🎓 Practice Exercises

### Exercise 1: Calculator
Create a program that performs all arithmetic operations on two numbers.

### Exercise 2: Comparison Tester
Write a program that compares two numbers and shows all comparison results.

### Exercise 3: Logic Gate Simulator
Create a program that simulates AND, OR, and NOT gates with boolean inputs.

---

**Next:** Learn about **[Input and Output](05-Input-Output.md)** →

---

*Master operators to build powerful algorithms!* ⚡✨

