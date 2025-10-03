# 🔧 Functions in iPseudo

Master creating reusable, modular code with functions!

---

## 🎯 What are Functions?

Functions are **reusable blocks of code** that:
- Perform specific tasks
- Can accept input (parameters)
- Can return output (return values)
- Make code organized and maintainable

---

## 📐 Function Syntax

### Basic Structure

```pseudo
Function functionName(parameter1, parameter2, ...)
    # Function body
    # Code to execute
    Return value  # Optional
Endfunction
```

---

## 🔷 Simple Function

No parameters, no return value:

```pseudo
Algorithm SimpleFunctionExample

Function sayHello()
    Print "Hello from the function!"
    Print "Functions are awesome!"
Endfunction

# Main program
Print "Starting program"
sayHello()  # Call the function
Print "Program continues"

Endalgorithm
```

**Output:**
```
Starting program
Hello from the function!
Functions are awesome!
Program continues
```

---

## 🔶 Function with Parameters

Accept input values:

```pseudo
Algorithm ParameterExample

Function greetPerson(name)
    Print "Hello,", name + "!"
    Print "Welcome to iPseudo!"
Endfunction

# Main program
greetPerson("Alice")
greetPerson("Bob")
greetPerson("Charlie")

Endalgorithm
```

**Output:**
```
Hello, Alice!
Welcome to iPseudo!
Hello, Bob!
Welcome to iPseudo!
Hello, Charlie!
Welcome to iPseudo!
```

---

### Multiple Parameters

```pseudo
Algorithm MultipleParameters

Function displayPerson(name, age, city)
    Print "=== Person Info ==="
    Print "Name:", name
    Print "Age:", age
    Print "City:", city
    Print ""
Endfunction

# Main program
displayPerson("Alice", 25, "New York")
displayPerson("Bob", 30, "Los Angeles")

Endalgorithm
```

**Output:**
```
=== Person Info ===
Name: Alice
Age: 25
City: New York

=== Person Info ===
Name: Bob
Age: 30
City: Los Angeles
```

---

## 🎁 Function with Return Value

Return computed results:

```pseudo
Algorithm ReturnValueExample

Function double(number)
    var result = number * 2
    Return result
Endfunction

# Main program
var value = 5
var doubled = double(value)

Print "Original:", value
Print "Doubled:", doubled

# Use directly in expressions
Print "Triple:", double(value) + value

Endalgorithm
```

**Output:**
```
Original: 5
Doubled: 10
Triple: 15
```

---

### Multiple Return Scenarios

```pseudo
Algorithm MultipleReturns

Function getGrade(score)
    If score >= 90 Then
        Return "A"
    Else
        If score >= 80 Then
            Return "B"
        Else
            If score >= 70 Then
                Return "C"
            Else
                If score >= 60 Then
                    Return "D"
                Else
                    Return "F"
                Endif
            Endif
        Endif
    Endif
Endfunction

# Main program
var score1 = 95
var score2 = 73
var score3 = 58

Print "Score", score1, "→ Grade:", getGrade(score1)
Print "Score", score2, "→ Grade:", getGrade(score2)
Print "Score", score3, "→ Grade:", getGrade(score3)

Endalgorithm
```

**Output:**
```
Score 95 → Grade: A
Score 73 → Grade: C
Score 58 → Grade: F
```

---

## 🎨 Functions with Type Declarations

Specify parameter and return types:

```pseudo
Algorithm TypedFunctions

Function calculateArea(length As Float, width As Float)
    Declare area As Float
    Set length * width To area
    Return area
Endfunction

Function isEven(number As Integer)
    Declare result As Boolean
    Set number mod 2 == 0 To result
    Return result
Endfunction

# Main program
Declare rectangleArea As Float
Set calculateArea(5.5, 3.2) To rectangleArea

Print "Rectangle area:", rectangleArea

var testNumber = 42
Print testNumber, "is even:", isEven(testNumber)

Endalgorithm
```

---

## 🎯 Mathematical Functions

### Example 1: Power Function

```pseudo
Algorithm PowerFunction

Function power(base, exponent)
    var result = 1
    
    For i = 1 To exponent
        result = result * base
    Endfor
    
    Return result
Endfunction

# Test the function
Print "2^3 =", power(2, 3)
Print "5^2 =", power(5, 2)
Print "10^4 =", power(10, 4)

Endalgorithm
```

**Output:**
```
2^3 = 8
5^2 = 25
10^4 = 10000
```

---

### Example 2: Factorial Function

```pseudo
Algorithm FactorialFunction

Function factorial(n)
    var result = 1
    
    For i = 1 To n
        result = result * i
    Endfor
    
    Return result
Endfunction

# Main program
Print "=== Factorial Calculator ==="

For i = 1 To 10
    Print i, "! =", factorial(i)
Endfor

Endalgorithm
```

**Output:**
```
=== Factorial Calculator ===
1 ! = 1
2 ! = 2
3 ! = 6
4 ! = 24
5 ! = 120
6 ! = 720
7 ! = 5040
8 ! = 40320
9 ! = 362880
10 ! = 3628800
```

---

### Example 3: Maximum of Three

```pseudo
Algorithm MaxOfThree

Function max3(a, b, c)
    var maximum = a
    
    If b > maximum Then
        maximum = b
    Endif
    
    If c > maximum Then
        maximum = c
    Endif
    
    Return maximum
Endfunction

# Main program
var x = 45
var y = 67
var z = 52

var largest = max3(x, y, z)

Print "Numbers:", x, y, z
Print "Largest:", largest

Endalgorithm
```

**Output:**
```
Numbers: 45 67 52
Largest: 67
```

---

## 🎨 Utility Functions

### Example 1: String Functions

```pseudo
Algorithm StringFunctions

Function createGreeting(name, timeOfDay)
    var greeting = "Good " + timeOfDay + ", " + name + "!"
    Return greeting
Endfunction

Function makeUppercaseMessage(text)
    # Simulated uppercase (in real implementation)
    var message = "*** " + text + " ***"
    Return message
Endfunction

# Main program
var msg1 = createGreeting("Alice", "morning")
var msg2 = createGreeting("Bob", "evening")

Print msg1
Print msg2
Print ""
Print makeUppercaseMessage("Important")

Endalgorithm
```

---

### Example 2: Validation Functions

```pseudo
Algorithm ValidationFunctions

Function isValidAge(age)
    Return age >= 0 and age <= 120
Endfunction

Function isValidEmail(email)
    # Simplified check: contains @
    # In reality, this would be more complex
    var hasAt = false
    # Simulated check
    Return true  # Placeholder
Endfunction

Function isValidScore(score)
    Return score >= 0 and score <= 100
Endfunction

# Main program
var userAge = Input "Enter age:"

If isValidAge(userAge) == true Then
    Print "✅ Valid age"
Else
    Print "❌ Invalid age"
Endif

Endalgorithm
```

---

## 🎯 Business Logic Functions

### Example: Discount Calculator

```pseudo
Algorithm DiscountCalculator

Function calculateDiscount(price, quantity)
    var discount = 0
    
    # Volume discounts
    If quantity >= 100 Then
        discount = 0.20  # 20% off
    Else
        If quantity >= 50 Then
            discount = 0.15  # 15% off
        Else
            If quantity >= 10 Then
                discount = 0.10  # 10% off
            Endif
        Endif
    Endif
    
    Return discount
Endfunction

Function calculateTotal(price, quantity)
    var subtotal = price * quantity
    var discountRate = calculateDiscount(price, quantity)
    var discountAmount = subtotal * discountRate
    var total = subtotal - discountAmount
    
    Return total
Endfunction

# Main program
Print "=== Bulk Order Calculator ==="
Print ""

var itemPrice = Input "Item price:"
var qty = Input "Quantity:"

var discountPercent = calculateDiscount(itemPrice, qty) * 100
var finalTotal = calculateTotal(itemPrice, qty)

Print ""
Print "Price per item: $", itemPrice
Print "Quantity:", qty
Print "Discount:", discountPercent, "%"
Print "Total: $", finalTotal

Endalgorithm
```

---

## 🔄 Recursive Functions

Functions that call themselves:

### Example 1: Recursive Factorial

```pseudo
Algorithm RecursiveFactorial

Function factorialRecursive(n)
    If n <= 1 Then
        Return 1
    Else
        Return n * factorialRecursive(n - 1)
    Endif
Endfunction

# Main program
var number = 5
var result = factorialRecursive(number)

Print number, "! =", result

Endalgorithm
```

---

### Example 2: Recursive Fibonacci

```pseudo
Algorithm RecursiveFibonacci

Function fibonacci(n)
    If n <= 1 Then
        Return n
    Else
        Return fibonacci(n - 1) + fibonacci(n - 2)
    Endif
Endfunction

# Main program
Print "Fibonacci numbers:"

For i = 0 To 10
    Print "F(", i, ") =", fibonacci(i)
Endfor

Endalgorithm
```

---

## 🎯 Complete Example: Student Grade System

```pseudo
Algorithm StudentGradeSystem

Function calculateLetterGrade(score)
    If score >= 90 Then
        Return "A"
    Else
        If score >= 80 Then
            Return "B"
        Else
            If score >= 70 Then
                Return "C"
            Else
                If score >= 60 Then
                    Return "D"
                Else
                    Return "F"
                Endif
            Endif
        Endif
    Endif
Endfunction

Function calculateGPA(grade)
    If grade == "A" Then
        Return 4.0
    Else
        If grade == "B" Then
            Return 3.0
        Else
            If grade == "C" Then
                Return 2.0
            Else
                If grade == "D" Then
                    Return 1.0
                Else
                    Return 0.0
                Endif
            Endif
        Endif
    Endif
Endfunction

Function isPassing(score)
    Return score >= 60
Endfunction

# Main program
Print "=== Student Grade Calculator ==="
Print ""

var mathScore = Input "Math score:"
var scienceScore = Input "Science score:"
var englishScore = Input "English score:"

Print ""
Print "=== Results ==="

var mathGrade = calculateLetterGrade(mathScore)
var scienceGrade = calculateLetterGrade(scienceScore)
var englishGrade = calculateLetterGrade(englishScore)

Print "Math:", mathScore, "→", mathGrade
Print "Science:", scienceScore, "→", scienceGrade
Print "English:", englishScore, "→", englishGrade

var totalGPA = calculateGPA(mathGrade) + calculateGPA(scienceGrade) + calculateGPA(englishGrade)
var averageGPA = totalGPA / 3

Print ""
Print "Average GPA:", averageGPA

# Check if all courses passed
var allPassed = isPassing(mathScore) and isPassing(scienceScore) and isPassing(englishScore)

If allPassed == true Then
    Print "✅ Status: All courses passed!"
Else
    Print "❌ Status: Some courses need retake"
Endif

Endalgorithm
```

---

## 📋 Function Best Practices

### 1. Single Responsibility
Each function should do ONE thing well:

```pseudo
# ✅ Good: Each function has one job
Function calculateTax(amount)
    Return amount * 0.08
Endfunction

Function calculateTotal(subtotal, tax)
    Return subtotal + tax
Endfunction

# ❌ Bad: Function does too much
Function processOrder(price, quantity)
    # Calculates total, tax, discount, shipping...
    # Too many responsibilities!
Endfunction
```

---

### 2. Descriptive Names

```pseudo
# ✅ Good: Clear function names
Function calculateCircleArea(radius)
Function isValidEmail(email)
Function convertCelsiusToFahrenheit(celsius)

# ❌ Bad: Unclear names
Function calc(x)
Function check(data)
Function convert(n)
```

---

### 3. Keep Functions Short

```pseudo
# ✅ Good: Short, focused function
Function isAdult(age)
    Return age >= 18
Endfunction

# Better than having this logic repeated everywhere
```

---

## 💡 Advanced Function Patterns

### Pattern 1: Helper Functions

```pseudo
Algorithm HelperFunctions

Function isPositive(number)
    Return number > 0
Endfunction

Function isEven(number)
    Return number mod 2 == 0
Endfunction

Function isPositiveEven(number)
    Return isPositive(number) and isEven(number)
Endfunction

# Main program
For i = -5 To 10
    If isPositiveEven(i) == true Then
        Print i, "is positive and even"
    Endif
Endfor

Endalgorithm
```

---

### Pattern 2: Calculation Pipeline

```pseudo
Algorithm CalculationPipeline

Function calculateSubtotal(price, quantity)
    Return price * quantity
Endfunction

Function calculateTax(subtotal)
    Constant TAX_RATE = 0.08
    Return subtotal * TAX_RATE
Endfunction

Function calculateShipping(subtotal)
    If subtotal >= 50 Then
        Return 0  # Free shipping
    Else
        Return 5.99
    Endif
Endfunction

Function calculateTotal(price, quantity)
    var subtotal = calculateSubtotal(price, quantity)
    var tax = calculateTax(subtotal)
    var shipping = calculateShipping(subtotal)
    
    Return subtotal + tax + shipping
Endfunction

# Main program
var itemPrice = 19.99
var qty = 3

var total = calculateTotal(itemPrice, qty)

Print "Total cost: $", total

Endalgorithm
```

---

## 🎓 Complete Examples

### Example 1: Temperature Converter

```pseudo
Algorithm TemperatureConverter

Function celsiusToFahrenheit(celsius)
    var fahrenheit = celsius * 9 / 5 + 32
    Return fahrenheit
Endfunction

Function fahrenheitToCelsius(fahrenheit)
    var celsius = (fahrenheit - 32) * 5 / 9
    Return celsius
Endfunction

# Main program
Print "=== Temperature Converter ==="
Print ""

var tempC = Input "Enter temperature in Celsius:"
var tempF = celsiusToFahrenheit(tempC)

Print ""
Print tempC, "°C =", tempF, "°F"

Print ""

var tempF2 = Input "Enter temperature in Fahrenheit:"
var tempC2 = fahrenheitToCelsius(tempF2)

Print ""
Print tempF2, "°F =", tempC2, "°C"

Endalgorithm
```

---

### Example 2: Circle Calculator

```pseudo
Algorithm CircleCalculator

Constant PI = 3.14159

Function calculateCircleArea(radius)
    Return PI * radius * radius
Endfunction

Function calculateCircleCircumference(radius)
    Return 2 * PI * radius
Endfunction

Function calculateCircleDiameter(radius)
    Return 2 * radius
Endfunction

# Main program
Print "=== Circle Calculator ==="
Print ""

var radius = Input "Enter circle radius:"

var area = calculateCircleArea(radius)
var circumference = calculateCircleCircumference(radius)
var diameter = calculateCircleDiameter(radius)

Print ""
Print "Radius:", radius
Print "Diameter:", diameter
Print "Circumference:", circumference
Print "Area:", area

Endalgorithm
```

---

### Example 3: Prime Number Functions

```pseudo
Algorithm PrimeNumberTools

Function isPrime(number)
    If number < 2 Then
        Return false
    Endif
    
    For i = 2 To number - 1
        If number mod i == 0 Then
            Return false
        Endif
    Endfor
    
    Return true
Endfunction

Function countPrimes(start, end)
    var count = 0
    
    For i = start To end
        If isPrime(i) == true Then
            count = count + 1
        Endif
    Endfor
    
    Return count
Endfunction

Function printPrimes(start, end)
    Print "Prime numbers from", start, "to", end + ":"
    
    For i = start To end
        If isPrime(i) == true Then
            Print i
        Endif
    Endfor
Endfunction

# Main program
Print "=== Prime Number Tools ==="
Print ""

var rangeStart = Input "Start of range:"
var rangeEnd = Input "End of range:"

Print ""

printPrimes(rangeStart, rangeEnd)

Print ""

var primeCount = countPrimes(rangeStart, rangeEnd)
Print "Total primes found:", primeCount

Endalgorithm
```

---

## 🔄 Function Composition

Using functions together:

```pseudo
Algorithm FunctionComposition

Function square(x)
    Return x * x
Endfunction

Function cube(x)
    Return x * x * x
Endfunction

Function sumOfSquares(a, b)
    Return square(a) + square(b)
Endfunction

Function sumOfCubes(a, b)
    Return cube(a) + cube(b)
Endfunction

# Main program
var num1 = 3
var num2 = 4

Print "Numbers:", num1, "and", num2
Print ""
Print "Sum of squares:", sumOfSquares(num1, num2)
Print "Sum of cubes:", sumOfCubes(num1, num2)

# Nested function calls
Print "Square of sum:", square(num1 + num2)

Endalgorithm
```

**Output:**
```
Numbers: 3 and 4

Sum of squares: 25
Sum of cubes: 91
Square of sum: 49
```

---

## 📋 Quick Reference

### Function Definition
```pseudo
Function name(param1, param2)
    # function body
    Return value
Endfunction
```

### Function Call
```pseudo
functionName(arg1, arg2)
var result = functionName(arg1, arg2)
```

### With Types
```pseudo
Function name(param As Type)
    Declare result As Type
    # code
    Return result
Endfunction
```

---

## ⚠️ Common Mistakes

### Mistake 1: Forgetting Endfunction
```pseudo
# ❌ Wrong
Function test()
    Print "Hello"
# Missing Endfunction!

# ✅ Correct
Function test()
    Print "Hello"
Endfunction
```

### Mistake 2: Not Returning Value
```pseudo
# ❌ Wrong
Function double(x)
    var result = x * 2
    # Missing Return!
Endfunction

# ✅ Correct
Function double(x)
    var result = x * 2
    Return result
Endfunction
```

### Mistake 3: Using Function Before Definition
```pseudo
# ❌ Wrong (in some languages)
Algorithm Test
    sayHello()  # Called before defined
    
    Function sayHello()
        Print "Hello"
    Endfunction
Endalgorithm

# ✅ Better: Define functions first
Algorithm Test
    Function sayHello()
        Print "Hello"
    Endfunction
    
    sayHello()  # Called after defined
Endalgorithm
```

---

## 💡 Pro Tips

### Tip 1: Document Your Functions

```pseudo
Function calculateBMI(weight, height)
    # Calculate Body Mass Index
    # Parameters:
    #   weight - weight in kilograms
    #   height - height in meters
    # Returns: BMI value
    
    Return weight / (height * height)
Endfunction
```

### Tip 2: Use Return Early

```pseudo
Function isValidScore(score)
    # Return early for invalid cases
    If score < 0 Then
        Return false
    Endif
    
    If score > 100 Then
        Return false
    Endif
    
    # If we reach here, score is valid
    Return true
Endfunction
```

### Tip 3: Keep Parameters Minimal

```pseudo
# ✅ Good: Few parameters
Function calculateArea(length, width)
    Return length * width
Endfunction

# ❌ Bad: Too many parameters
Function processData(a, b, c, d, e, f, g)
    # Hard to remember parameter order!
Endfunction
```

---

## 🎓 Practice Exercises

### Exercise 1: Average Function
Create a function that calculates the average of three numbers.

### Exercise 2: Even or Odd
Create a function that returns true if a number is even, false otherwise.

### Exercise 3: String Reverser
Create a function that reverses a string (conceptual exercise).

### Exercise 4: Grade System
Build a complete grade calculation system using multiple functions.

---

**Next:** Learn about **[Arrays](12-Arrays.md)** to work with collections →

---

*Build better programs with reusable functions!* 🔧✨

