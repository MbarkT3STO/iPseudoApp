# 🔀 Conditional Statements

Master decision-making in your algorithms with IF, ELSE, and complex conditions!

---

## 🎯 What are Conditional Statements?

Conditional statements let your program **make decisions** and execute different code based on conditions.

Think of them as **"if this, then that"** logic.

---

## 🔷 Simple IF Statement

Execute code only when a condition is true:

### Syntax

```pseudo
If condition Then
    # Code to execute when condition is true
Endif
```

### Example

```pseudo
Algorithm SimpleIF

var age = 20

If age >= 18 Then
    Print "You are an adult"
Endif

Print "Program continues"

Endalgorithm
```

**Output:**
```
You are an adult
Program continues
```

---

## 🔶 IF-ELSE Statement

Execute one block or another based on a condition:

### Syntax

```pseudo
If condition Then
    # Code when condition is true
Else
    # Code when condition is false
Endif
```

### Example

```pseudo
Algorithm IF_ELSE_Example

var temperature = Input "Enter temperature (°F):"

Print ""

If temperature >= 70 Then
    Print "🌞 It's warm outside!"
    Print "Wear light clothes"
Else
    Print "🧥 It's cold outside!"
    Print "Wear a jacket"
Endif

Print ""
Print "Have a great day!"

Endalgorithm
```

**Example Output:**
```
Enter temperature (°F): 65

🧥 It's cold outside!
Wear a jacket

Have a great day!
```

---

## 🔷 Nested IF Statements

Multiple levels of conditions:

```pseudo
Algorithm NestedIF

var score = Input "Enter your score (0-100):"

Print ""
Print "=== Grade Calculation ==="

If score >= 90 Then
    Print "Grade: A"
    Print "Excellent work!"
Else
    If score >= 80 Then
        Print "Grade: B"
        Print "Good job!"
    Else
        If score >= 70 Then
            Print "Grade: C"
            Print "Satisfactory"
        Else
            If score >= 60 Then
                Print "Grade: D"
                Print "Needs improvement"
            Else
                Print "Grade: F"
                Print "Please study more"
            Endif
        Endif
    Endif
Endif

Endalgorithm
```

**Example Output:**
```
Enter your score (0-100): 87

=== Grade Calculation ===
Grade: B
Good job!
```

---

## 🎯 Multiple Conditions with Logical Operators

Combine conditions using `and`, `or`, `not`:

### AND Operator

Both conditions must be true:

```pseudo
Algorithm ANDExample

var age = Input "Enter age:"
var hasLicense = Input "Have driver's license? (true/false):"

Print ""

If age >= 18 and hasLicense == true Then
    Print "✅ You can drive!"
Else
    Print "❌ You cannot drive yet"
    
    If age < 18 Then
        Print "Reason: Too young"
    Endif
    
    If hasLicense == false Then
        Print "Reason: No license"
    Endif
Endif

Endalgorithm
```

---

### OR Operator

At least one condition must be true:

```pseudo
Algorithm ORExample

var day = Input "Enter day of week:"

Print ""

If day == "Saturday" or day == "Sunday" Then
    Print "🎉 It's the weekend!"
    Print "Time to relax!"
Else
    Print "💼 It's a weekday"
    Print "Time to work!"
Endif

Endalgorithm
```

---

### NOT Operator

Negate a condition:

```pseudo
Algorithm NOTExample

var isRaining = false

If not isRaining Then
    Print "☀️ Go outside and enjoy!"
Else
    Print "☔ Stay inside or bring umbrella"
Endif

Endalgorithm
```

---

### Complex Conditions

```pseudo
Algorithm ComplexConditions

var age = 25
var income = 50000
var creditScore = 720

Print "=== Loan Eligibility Checker ==="
Print ""

# Complex AND condition
If age >= 21 and income >= 30000 and creditScore >= 650 Then
    Print "✅ Loan Approved!"
    
    # Additional benefits check
    If creditScore >= 750 Then
        Print "🌟 Qualified for premium rate"
    Endif
Else
    Print "❌ Loan Denied"
    Print ""
    Print "Reasons:"
    
    If age < 21 Then
        Print "- Age requirement not met"
    Endif
    
    If income < 30000 Then
        Print "- Income requirement not met"
    Endif
    
    If creditScore < 650 Then
        Print "- Credit score too low"
    Endif
Endif

Endalgorithm
```

---

## 🎲 Comparison Operators in Conditions

### All Comparison Types

```pseudo
Algorithm ComparisonOperators

var x = 10

# Equal to
If x == 10 Then
    Print "x equals 10"
Endif

# Not equal to
If x != 5 Then
    Print "x does not equal 5"
Endif

# Greater than
If x > 5 Then
    Print "x is greater than 5"
Endif

# Less than
If x < 20 Then
    Print "x is less than 20"
Endif

# Greater than or equal
If x >= 10 Then
    Print "x is at least 10"
Endif

# Less than or equal
If x <= 15 Then
    Print "x is at most 15"
Endif

Endalgorithm
```

---

## 🎯 Real-World Examples

### Example 1: Age Category

```pseudo
Algorithm AgeCategory

var age = Input "Enter your age:"

Print ""

If age < 0 Then
    Print "❌ Invalid age!"
Else
    If age < 13 Then
        Print "👶 Child"
    Else
        If age < 20 Then
            Print "👦 Teenager"
        Else
            If age < 65 Then
                Print "👨 Adult"
            Else
                Print "👴 Senior"
            Endif
        Endif
    Endif
Endif

Endalgorithm
```

---

### Example 2: Password Strength Checker

```pseudo
Algorithm PasswordStrength

var password = Input "Enter password:"
var length = Input "Enter password length:"  # Simulated

Print ""
Print "=== Password Strength ==="

var isStrong = false

If length >= 12 Then
    If length >= 16 Then
        Print "💪 Very Strong Password"
        isStrong = true
    Else
        Print "✅ Strong Password"
        isStrong = true
    Endif
Else
    If length >= 8 Then
        Print "⚠️ Medium Password"
        Print "Tip: Use at least 12 characters"
    Else
        Print "❌ Weak Password"
        Print "Tip: Use at least 8 characters"
    Endif
Endif

Endalgorithm
```

---

### Example 3: Ticket Pricing

```pseudo
Algorithm TicketPricing

Print "=== Movie Ticket Pricing ==="
Print ""

var age = Input "Enter your age:"
var isStudent = Input "Are you a student? (true/false):"

Declare price As Float
Set 12.00 To price  # Standard price

Print ""

# Age-based discounts
If age < 12 Then
    Set 6.00 To price
    Print "🎫 Child ticket: $", price
Else
    If age >= 65 Then
        Set 8.00 To price
        Print "🎫 Senior ticket: $", price
    Else
        # Check student discount
        If isStudent == true Then
            Set 9.00 To price
            Print "🎫 Student ticket: $", price
        Else
            Print "🎫 Standard ticket: $", price
        Endif
    Endif
Endif

Endalgorithm
```

---

## 🧩 Pattern: Range Checking

Check if a value falls within a range:

```pseudo
Algorithm RangeChecker

var score = Input "Enter score (0-100):"

Print ""

If score >= 0 and score <= 100 Then
    Print "✅ Valid score:", score
    
    # Process score
    If score >= 90 and score <= 100 Then
        Print "Grade: A (Excellent)"
    Else
        If score >= 80 and score < 90 Then
            Print "Grade: B (Good)"
        Else
            If score >= 70 and score < 80 Then
                Print "Grade: C (Average)"
            Else
                Print "Grade: F (Below Average)"
            Endif
        Endif
    Endif
Else
    Print "❌ Invalid score!"
    Print "Score must be between 0 and 100"
Endif

Endalgorithm
```

---

## 🎮 Pattern: State Machine

```pseudo
Algorithm TrafficLight

var lightColor = Input "Enter traffic light color (red/yellow/green):"

Print ""
Print "🚦 Traffic Light Status"
Print ""

If lightColor == "red" Then
    Print "🔴 STOP"
    Print "Wait for green light"
Else
    If lightColor == "yellow" Then
        Print "🟡 CAUTION"
        Print "Prepare to stop"
    Else
        If lightColor == "green" Then
            Print "🟢 GO"
            Print "Proceed with caution"
        Else
            Print "❌ Invalid light color"
        Endif
    Endif
Endif

Endalgorithm
```

---

## 💡 Advanced Techniques

### Technique 1: Early Exit Pattern

```pseudo
Algorithm EarlyExit

var value = Input "Enter a positive number:"

If value <= 0 Then
    Print "❌ Error: Number must be positive"
    # Exit early (don't process further)
Else
    # Main processing
    var squared = value ^ 2
    var cubed = value ^ 3
    
    Print "✅ Processing..."
    Print "Square:", squared
    Print "Cube:", cubed
Endif

Endalgorithm
```

---

### Technique 2: Flag Variables

```pseudo
Algorithm FlagVariables

var age = Input "Enter age:"
var income = Input "Enter income:"

# Use flags to track conditions
var ageOK = age >= 21
var incomeOK = income >= 30000

Print ""

If ageOK and incomeOK Then
    Print "✅ All requirements met"
Else
    Print "❌ Requirements not met:"
    
    If not ageOK Then
        Print "- Minimum age is 21"
    Endif
    
    If not incomeOK Then
        Print "- Minimum income is $30,000"
    Endif
Endif

Endalgorithm
```

---

## 📊 Truth Table Reference

### AND Operator
| A | B | A and B |
|---|---|---------|
| true | true | true |
| true | false | false |
| false | true | false |
| false | false | false |

### OR Operator
| A | B | A or B |
|---|---|--------|
| true | true | true |
| true | false | true |
| false | true | true |
| false | false | false |

### NOT Operator
| A | not A |
|---|-------|
| true | false |
| false | true |

---

## 📋 Quick Reference

```pseudo
# Simple IF
If condition Then
    # code
Endif

# IF-ELSE
If condition Then
    # code when true
Else
    # code when false
Endif

# Nested IF
If condition1 Then
    # code
Else
    If condition2 Then
        # code
    Else
        # code
    Endif
Endif

# Multiple conditions
If condition1 and condition2 Then
    # both must be true
Endif

If condition1 or condition2 Then
    # at least one must be true
Endif

If not condition Then
    # condition must be false
Endif
```

---

## ⚠️ Common Mistakes

### Mistake 1: Missing Then
```pseudo
# ❌ Wrong
If x > 5
    Print x
Endif

# ✅ Correct
If x > 5 Then
    Print x
Endif
```

### Mistake 2: Missing Endif
```pseudo
# ❌ Wrong
If x > 5 Then
    Print x
# Missing Endif!

# ✅ Correct
If x > 5 Then
    Print x
Endif
```

### Mistake 3: Using = Instead of ==
```pseudo
# ❌ Wrong
If score = 100 Then  # Assignment, not comparison!

# ✅ Correct
If score == 100 Then  # Comparison
```

---

## 💡 Best Practices

1. **Always use Endif** to close IF statements
2. **Indent nested conditions** for readability
3. **Use parentheses** for complex conditions
4. **Limit nesting** to 3-4 levels maximum
5. **Consider using functions** for deeply nested logic
6. **Add comments** to explain complex conditions

---

## 🎓 Practice Exercises

### Exercise 1: Leap Year Checker
Determine if a year is a leap year.

### Exercise 2: Triangle Validator
Check if three sides can form a valid triangle.

### Exercise 3: Grade Calculator with Bonus
Calculate grades with bonus points for perfect attendance.

---

**Next:** Learn about **[Loops](07-Loops.md)** to repeat actions →

---

*Make smart decisions with conditional statements!* 🔀✨

