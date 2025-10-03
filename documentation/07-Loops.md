# 🔁 Loops in iPseudo

Master repetition and iteration with FOR, WHILE, and REPEAT loops!

---

## 🎯 What are Loops?

Loops let you **repeat code** multiple times without writing it over and over. They're essential for:
- Processing lists of data
- Repeating tasks
- Iterating through ranges
- Continuing until a condition is met

---

## 🔄 FOR Loop

Repeat code a **specific number of times**:

### Syntax

```pseudo
For variable = start To end
    # Code to repeat
Endfor
```

### Simple Example

```pseudo
Algorithm SimpleForLoop

Print "Counting from 1 to 5:"

For i = 1 To 5
    Print "Number:", i
Endfor

Print "Done!"

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
Done!
```

---

### FOR Loop with Step

```pseudo
Algorithm ForLoopWithStep

Print "Even numbers from 2 to 10:"

For i = 2 To 10 Step 2
    Print i
Endfor

Print ""
Print "Countdown from 10:"

For i = 10 To 1 Step -1
    Print i
Endfor

Print "Blast off!"

Endalgorithm
```

**Output:**
```
Even numbers from 2 to 10:
2
4
6
8
10

Countdown from 10:
10
9
8
7
6
5
4
3
2
1
Blast off!
```

---

### FOR Loop with Calculations

```pseudo
Algorithm ForLoopCalculations

var sum = 0

Print "Calculating sum of 1 to 10..."

For i = 1 To 10
    sum = sum + i
    Print "After adding", i, "sum is", sum
Endfor

Print ""
Print "Final sum:", sum

Endalgorithm
```

**Output:**
```
Calculating sum of 1 to 10...
After adding 1 sum is 1
After adding 2 sum is 3
After adding 3 sum is 6
After adding 4 sum is 10
After adding 5 sum is 15
After adding 6 sum is 21
After adding 7 sum is 28
After adding 8 sum is 36
After adding 9 sum is 45
After adding 10 sum is 55

Final sum: 55
```

---

## 🌀 WHILE Loop

Repeat code **while a condition is true**:

### Syntax

```pseudo
While condition Do
    # Code to repeat
    # Must update condition eventually!
Endwhile
```

### Simple Example

```pseudo
Algorithm SimpleWhileLoop

var count = 1

Print "Counting with WHILE loop:"

While count <= 5 Do
    Print "Count:", count
    count = count + 1
Endwhile

Print "Done! Final count:", count

Endalgorithm
```

**Output:**
```
Counting with WHILE loop:
Count: 1
Count: 2
Count: 3
Count: 4
Count: 5
Done! Final count: 6
```

---

### WHILE Loop with User Control

```pseudo
Algorithm WhileWithInput

var total = 0
var count = 0
var continue = true

Print "=== Number Summer ==="
Print "(Enter 0 to stop)"
Print ""

While continue == true Do
    var number = Input "Enter a number:"
    
    If number == 0 Then
        continue = false
    Else
        total = total + number
        count = count + 1
        Print "Running total:", total
    Endif
Endwhile

Print ""
Print "=== Results ==="
Print "Numbers entered:", count
Print "Total sum:", total

If count > 0 Then
    var average = total / count
    Print "Average:", average
Endif

Endalgorithm
```

---

## 🔁 REPEAT-UNTIL Loop

Repeat code **until a condition becomes true** (executes at least once):

### Syntax

```pseudo
Repeat
    # Code to repeat
    # Executes at least once!
Until condition
```

### Example

```pseudo
Algorithm RepeatUntilLoop

var number = 0

Print "Enter a number between 1 and 10:"

Repeat
    number = Input "Your guess:"
    
    If number < 1 or number > 10 Then
        Print "❌ Out of range! Try again."
    Endif
    
Until number >= 1 and number <= 10

Print "✅ Valid number:", number

Endalgorithm
```

---

## 🎯 Choosing the Right Loop

### Use FOR when:
- ✅ You know how many times to repeat
- ✅ You're iterating through a range
- ✅ You're processing array indices

```pseudo
For i = 1 To 10
    # Repeat exactly 10 times
Endfor
```

---

### Use WHILE when:
- ✅ You don't know how many iterations needed
- ✅ Condition is checked before each iteration
- ✅ Loop might not execute at all

```pseudo
While userWantsToContinue == true Do
    # Might not execute if condition is false initially
Endwhile
```

---

### Use REPEAT-UNTIL when:
- ✅ Loop must execute at least once
- ✅ Condition is checked after iteration
- ✅ Input validation scenarios

```pseudo
Repeat
    # Always executes at least once
Until validInput == true
```

---

## 🎨 Nested Loops

Loops inside loops for multi-dimensional processing:

### Example 1: Multiplication Table

```pseudo
Algorithm MultiplicationTable

var size = Input "Enter table size:"

Print ""
Print "=== Multiplication Table ==="
Print ""

For row = 1 To size
    For col = 1 To size
        var product = row * col
        Print row, "x", col, "=", product
    Endfor
    Print ""  # Blank line between rows
Endfor

Endalgorithm
```

---

### Example 2: Pattern Printing

```pseudo
Algorithm StarPattern

Print "=== Star Triangle ==="
Print ""

For row = 1 To 5
    For col = 1 To row
        Print "*",
    Endfor
    Print ""  # New line after each row
Endfor

Endalgorithm
```

**Output:**
```
=== Star Triangle ===

*
**
***
****
*****
```

---

### Example 3: Nested Countdown

```pseudo
Algorithm NestedCountdown

For outer = 3 To 1 Step -1
    Print "Outer loop:", outer
    
    For inner = 3 To 1 Step -1
        Print "  Inner:", inner
    Endfor
    
    Print ""
Endfor

Print "All done!"

Endalgorithm
```

---

## 🎯 Common Loop Patterns

### Pattern 1: Accumulator

```pseudo
Algorithm AccumulatorPattern

var total = 0

For i = 1 To 100
    total = total + i
Endfor

Print "Sum of 1 to 100:", total

Endalgorithm
```

---

### Pattern 2: Counter

```pseudo
Algorithm CounterPattern

var positiveCount = 0
var negativeCount = 0
var zeroCount = 0

For i = 1 To 10
    var number = Input "Enter a number:"
    
    If number > 0 Then
        positiveCount = positiveCount + 1
    Else
        If number < 0 Then
            negativeCount = negativeCount + 1
        Else
            zeroCount = zeroCount + 1
        Endif
    Endif
Endfor

Print ""
Print "Positive numbers:", positiveCount
Print "Negative numbers:", negativeCount
Print "Zeros:", zeroCount

Endalgorithm
```

---

### Pattern 3: Find Maximum

```pseudo
Algorithm FindMaximum

var max = 0
var count = 5

Print "Enter", count, "numbers:"

For i = 1 To count
    var number = Input "Number:"
    
    If i == 1 Then
        max = number  # First number is max initially
    Else
        If number > max Then
            max = number
        Endif
    Endif
Endfor

Print ""
Print "Maximum value:", max

Endalgorithm
```

---

### Pattern 4: Sentinel Loop

```pseudo
Algorithm SentinelLoop

Print "=== Number Averager ==="
Print "(Enter -1 to finish)"
Print ""

var sum = 0
var count = 0
var number = 0

While number != -1 Do
    number = Input "Enter number:"
    
    If number != -1 Then
        sum = sum + number
        count = count + 1
    Endif
Endwhile

Print ""

If count > 0 Then
    var average = sum / count
    Print "Count:", count
    Print "Sum:", sum
    Print "Average:", average
Else
    Print "No numbers entered"
Endif

Endalgorithm
```

---

## 🎮 Real-World Examples

### Example 1: Factorial Calculator

```pseudo
Algorithm FactorialCalculator

var n = Input "Enter a number:"
var factorial = 1

Print ""
Print "Calculating", n, "! ..."
Print ""

For i = 1 To n
    factorial = factorial * i
    Print i, "! =", factorial
Endfor

Print ""
Print "Final result:", n, "! =", factorial

Endalgorithm
```

---

### Example 2: Fibonacci Sequence

```pseudo
Algorithm FibonacciSequence

var count = Input "How many Fibonacci numbers?"

Print ""
Print "Fibonacci Sequence:"

var a = 0
var b = 1

For i = 1 To count
    Print a
    
    var next = a + b
    a = b
    b = next
Endfor

Endalgorithm
```

**Example Output (count = 10):**
```
Fibonacci Sequence:
0
1
1
2
3
5
8
13
21
34
```

---

### Example 3: Prime Number Checker

```pseudo
Algorithm PrimeChecker

var number = Input "Enter a number to check if prime:"

Print ""

If number < 2 Then
    Print number, "is not prime"
Else
    var isPrime = true
    var divisor = 2
    
    While divisor < number Do
        If number mod divisor == 0 Then
            isPrime = false
        Endif
        divisor = divisor + 1
    Endwhile
    
    If isPrime == true Then
        Print number, "is PRIME ✅"
    Else
        Print number, "is NOT prime ❌"
    Endif
Endif

Endalgorithm
```

---

### Example 4: Guessing Game

```pseudo
Algorithm GuessingGame

Constant SECRET_NUMBER = 42
Constant MAX_TRIES = 5

Print "=== Number Guessing Game ==="
Print "I'm thinking of a number between 1 and 100"
Print "You have", MAX_TRIES, "tries"
Print ""

var tries = 0
var won = false

While tries < MAX_TRIES and won == false Do
    tries = tries + 1
    
    var guess = Input "Guess #" + tries + ":"
    
    If guess == SECRET_NUMBER Then
        won = true
        Print "🎉 Correct! You won in", tries, "tries!"
    Else
        If guess < SECRET_NUMBER Then
            Print "📈 Too low!"
        Else
            Print "📉 Too high!"
        Endif
        
        var remaining = MAX_TRIES - tries
        If remaining > 0 Then
            Print "Tries remaining:", remaining
        Endif
    Endif
    
    Print ""
Endwhile

If won == false Then
    Print "💔 Game Over! The number was", SECRET_NUMBER
Endif

Endalgorithm
```

---

## 🧮 Loop Control Patterns

### Pattern 1: Early Exit Simulation

```pseudo
Algorithm EarlyExitPattern

var found = false

For i = 1 To 100
    If i * i == 64 Then
        Print "Found! Square root of 64 is", i
        found = true
    Endif
Endfor

If found == false Then
    Print "Not found"
Endif

Endalgorithm
```

---

### Pattern 2: Skip Items

```pseudo
Algorithm SkipPattern

Print "Odd numbers from 1 to 10:"

For i = 1 To 10
    # Skip even numbers
    If i mod 2 == 0 Then
        # Don't print even numbers
    Else
        Print i
    Endif
Endfor

Endalgorithm
```

**Output:**
```
Odd numbers from 1 to 10:
1
3
5
7
9
```

---

## 📊 Performance Considerations

### Avoid Infinite Loops!

```pseudo
# ❌ Infinite loop - never ends!
var x = 1
While x > 0 Do
    Print x
    x = x + 1  # x will never be <= 0!
Endwhile

# ✅ Finite loop - will end
var x = 10
While x > 0 Do
    Print x
    x = x - 1  # x will eventually reach 0
Endwhile
```

---

## 📋 Quick Reference

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
    # Update condition!
Endwhile
```

### REPEAT-UNTIL Loop
```pseudo
Repeat
    # code (runs at least once)
Until condition
```

---

## ⚠️ Common Mistakes

### Mistake 1: Forgetting Endfor/Endwhile
```pseudo
# ❌ Wrong
For i = 1 To 5
    Print i
# Missing Endfor!

# ✅ Correct
For i = 1 To 5
    Print i
Endfor
```

### Mistake 2: Not Updating Loop Variable in WHILE
```pseudo
# ❌ Infinite loop!
var i = 1
While i <= 5 Do
    Print i
    # Missing: i = i + 1
Endwhile

# ✅ Correct
var i = 1
While i <= 5 Do
    Print i
    i = i + 1
Endwhile
```

### Mistake 3: Off-by-One Errors
```pseudo
# Counts 1,2,3,4,5 (5 numbers)
For i = 1 To 5
    Print i
Endfor

# Counts 0,1,2,3,4 (5 numbers)
For i = 0 To 4
    Print i
Endfor
```

---

## 💡 Best Practices

1. **Use FOR** when you know the iteration count
2. **Use WHILE** for condition-based loops
3. **Always update** the loop variable in WHILE loops
4. **Indent loop body** for readability
5. **Add comments** for complex loops
6. **Avoid modifying** FOR loop variables inside the loop
7. **Test for** off-by-one errors

---

## 🎓 Practice Exercises

### Exercise 1: Sum Calculator
Calculate the sum of all even numbers from 1 to 100.

### Exercise 2: Multiplication Table
Generate a complete multiplication table for any number.

### Exercise 3: Reverse Counter
Print numbers in reverse from N to 1.

### Exercise 4: Pattern Printer
Create a pyramid pattern using nested loops.

---

**Next:** Learn about **[Functions](09-Functions.md)** to create reusable code →

---

*Loop through success with repetition!* 🔁✨

