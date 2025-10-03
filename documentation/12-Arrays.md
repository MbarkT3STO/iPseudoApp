# 📊 Arrays in iPseudo

Master working with collections of data using arrays!

---

## 🎯 What are Arrays?

Arrays are **ordered collections** of values stored under a single variable name. Think of them as:
- A list of items
- Multiple boxes with numbered labels
- A collection organized by index

---

## 📐 Array Declaration

### Basic Syntax

```pseudo
var arrayName[size]
```

### Example

```pseudo
Algorithm SimpleArray

# Declare array with 5 elements
var numbers[5]

# Arrays use 0-based indexing
numbers[0] = 10
numbers[1] = 20
numbers[2] = 30
numbers[3] = 40
numbers[4] = 50

# Access array elements
Print "First element:", numbers[0]
Print "Third element:", numbers[2]
Print "Last element:", numbers[4]

Endalgorithm
```

**Output:**
```
First element: 10
Third element: 30
Last element: 50
```

---

## 🔢 Array Initialization

### Initialize with Values

```pseudo
Algorithm ArrayInitialization

# Initialize array with values
var scores[5]
scores[0] = 95
scores[1] = 87
scores[2] = 92
scores[3] = 78
scores[4] = 88

Print "=== Student Scores ==="

For i = 0 To 4
    Print "Student", i + 1, ":", scores[i]
Endfor

Endalgorithm
```

**Output:**
```
=== Student Scores ===
Student 1 : 95
Student 2 : 87
Student 3 : 92
Student 4 : 78
Student 5 : 88
```

---

## 🔄 Iterating Through Arrays

### Using FOR Loop

```pseudo
Algorithm IterateArray

var fruits[4]
fruits[0] = "Apple"
fruits[1] = "Banana"
fruits[2] = "Orange"
fruits[3] = "Grape"

Print "=== Fruit List ==="

For i = 0 To 3
    Print i + 1, ".", fruits[i]
Endfor

Endalgorithm
```

**Output:**
```
=== Fruit List ===
1 . Apple
2 . Banana
3 . Orange
4 . Grape
```

---

### Dynamic Size with Variable

```pseudo
Algorithm DynamicArraySize

var size = Input "How many numbers?"

var numbers[size]

Print "Enter", size, "numbers:"

# Fill array
For i = 0 To size - 1
    numbers[i] = Input "Number " + (i + 1) + ":"
Endfor

Print ""
Print "=== Your Numbers ==="

# Display array
For i = 0 To size - 1
    Print "Position", i, ":", numbers[i]
Endfor

Endalgorithm
```

---

## 🎯 Common Array Operations

### Finding Maximum

```pseudo
Algorithm FindMaxInArray

var numbers[5]
numbers[0] = 45
numbers[1] = 67
numbers[2] = 23
numbers[3] = 89
numbers[4] = 56

# Find maximum
var max = numbers[0]  # Start with first element

For i = 1 To 4
    If numbers[i] > max Then
        max = numbers[i]
    Endif
Endfor

Print "Numbers:", numbers[0], numbers[1], numbers[2], numbers[3], numbers[4]
Print "Maximum value:", max

Endalgorithm
```

**Output:**
```
Numbers: 45 67 23 89 56
Maximum value: 89
```

---

### Finding Minimum

```pseudo
Algorithm FindMinInArray

var temperatures[7]  # Week temperatures
temperatures[0] = 72
temperatures[1] = 68
temperatures[2] = 75
temperatures[3] = 71
temperatures[4] = 69
temperatures[5] = 74
temperatures[6] = 70

var min = temperatures[0]

For i = 1 To 6
    If temperatures[i] < min Then
        min = temperatures[i]
    Endif
Endfor

Print "=== Weekly Temperatures ==="
Print "Lowest temperature:", min, "°F"

Endalgorithm
```

---

### Calculating Sum and Average

```pseudo
Algorithm SumAndAverage

var scores[6]
scores[0] = 85
scores[1] = 92
scores[2] = 78
scores[3] = 95
scores[4] = 88
scores[5] = 91

var sum = 0

# Calculate sum
For i = 0 To 5
    sum = sum + scores[i]
Endfor

# Calculate average
var average = sum / 6

Print "=== Test Scores ==="
Print "Total scores:", 6
Print "Sum:", sum
Print "Average:", average

Endalgorithm
```

**Output:**
```
=== Test Scores ===
Total scores: 6
Sum: 529
Average: 88.16666666666667
```

---

### Searching in Arrays

```pseudo
Algorithm SearchArray

var names[5]
names[0] = "Alice"
names[1] = "Bob"
names[2] = "Charlie"
names[3] = "David"
names[4] = "Eve"

var searchName = Input "Enter name to search:"

var found = false
var position = -1

For i = 0 To 4
    If names[i] == searchName Then
        found = true
        position = i
    Endif
Endfor

Print ""

If found == true Then
    Print "✅ Found", searchName, "at position", position
Else
    Print "❌ Name not found"
Endif

Endalgorithm
```

---

### Counting Elements

```pseudo
Algorithm CountElements

var grades[10]
grades[0] = "A"
grades[1] = "B"
grades[2] = "A"
grades[3] = "C"
grades[4] = "A"
grades[5] = "B"
grades[6] = "D"
grades[7] = "A"
grades[8] = "B"
grades[9] = "C"

var countA = 0
var countB = 0
var countC = 0
var countD = 0

For i = 0 To 9
    If grades[i] == "A" Then
        countA = countA + 1
    Else
        If grades[i] == "B" Then
            countB = countB + 1
        Else
            If grades[i] == "C" Then
                countC = countC + 1
            Else
                If grades[i] == "D" Then
                    countD = countD + 1
                Endif
            Endif
        Endif
    Endif
Endfor

Print "=== Grade Distribution ==="
Print "A's:", countA
Print "B's:", countB
Print "C's:", countC
Print "D's:", countD

Endalgorithm
```

---

## 🎨 Array with Functions

Combine arrays and functions for powerful programs:

```pseudo
Algorithm ArrayFunctions

Function sumArray(arr, size)
    var total = 0
    
    For i = 0 To size - 1
        total = total + arr[i]
    Endfor
    
    Return total
Endfunction

Function averageArray(arr, size)
    var sum = sumArray(arr, size)
    Return sum / size
Endfunction

Function maxArray(arr, size)
    var maximum = arr[0]
    
    For i = 1 To size - 1
        If arr[i] > maximum Then
            maximum = arr[i]
        Endif
    Endfor
    
    Return maximum
Endfunction

# Main program
var scores[5]
scores[0] = 85
scores[1] = 92
scores[2] = 78
scores[3] = 95
scores[4] = 88

Print "=== Array Statistics ==="
Print "Sum:", sumArray(scores, 5)
Print "Average:", averageArray(scores, 5)
Print "Maximum:", maxArray(scores, 5)

Endalgorithm
```

**Output:**
```
=== Array Statistics ===
Sum: 438
Average: 87.6
Maximum: 95
```

---

## 🎯 Real-World Examples

### Example 1: Grade Book

```pseudo
Algorithm GradeBook

Constant CLASS_SIZE = 5

var studentNames[CLASS_SIZE]
var studentScores[CLASS_SIZE]

Print "=== Enter Student Data ==="
Print ""

# Input data
For i = 0 To CLASS_SIZE - 1
    Print "Student", i + 1, ":"
    studentNames[i] = Input "  Name:"
    studentScores[i] = Input "  Score:"
Endfor

# Display report
Print ""
Print "=== Grade Report ==="
Print ""

For i = 0 To CLASS_SIZE - 1
    Print studentNames[i], "-", studentScores[i]
Endfor

# Calculate class average
var sum = 0
For i = 0 To CLASS_SIZE - 1
    sum = sum + studentScores[i]
Endfor

var classAverage = sum / CLASS_SIZE
Print ""
Print "Class Average:", classAverage

Endalgorithm
```

---

### Example 2: Shopping List

```pseudo
Algorithm ShoppingList

var items[10]
var prices[10]
var quantities[10]
var itemCount = 0

Print "=== Shopping List Manager ==="
Print ""

# Add items (simplified for 3 items)
For i = 0 To 2
    Print "Item", i + 1, ":"
    items[i] = Input "  Name:"
    prices[i] = Input "  Price:"
    quantities[i] = Input "  Quantity:"
    itemCount = itemCount + 1
    Print ""
Endfor

# Display shopping list
Print "=== Your Shopping List ==="
Print ""

var grandTotal = 0

For i = 0 To itemCount - 1
    var itemTotal = prices[i] * quantities[i]
    grandTotal = grandTotal + itemTotal
    
    Print items[i]
    Print "  $", prices[i], "x", quantities[i], "= $", itemTotal
    Print ""
Endfor

Print "───────────────────"
Print "Grand Total: $", grandTotal

Endalgorithm
```

---

### Example 3: Sorting (Bubble Sort)

```pseudo
Algorithm BubbleSort

var numbers[5]
numbers[0] = 64
numbers[1] = 34
numbers[2] = 25
numbers[3] = 12
numbers[4] = 22

Print "Original array:"
For i = 0 To 4
    Print numbers[i]
Endfor

Print ""

# Bubble sort
For i = 0 To 3
    For j = 0 To 3 - i
        If numbers[j] > numbers[j + 1] Then
            # Swap
            var temp = numbers[j]
            numbers[j] = numbers[j + 1]
            numbers[j + 1] = temp
        Endif
    Endfor
Endfor

Print "Sorted array:"
For i = 0 To 4
    Print numbers[i]
Endfor

Endalgorithm
```

**Output:**
```
Original array:
64
34
25
12
22

Sorted array:
12
22
25
34
64
```

---

## 📋 Quick Reference

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
    # Use arrayName[i]
Endfor

# Common operations
var max = arrayName[0]
For i = 1 To size - 1
    If arrayName[i] > max Then
        max = arrayName[i]
    Endif
Endfor
```

---

## ⚠️ Common Mistakes

### Mistake 1: Index Out of Bounds
```pseudo
# ❌ Wrong
var arr[5]  # Indices: 0, 1, 2, 3, 4
arr[5] = 100  # Error! Index 5 doesn't exist

# ✅ Correct
var arr[5]
arr[4] = 100  # Last valid index
```

### Mistake 2: Forgetting 0-Based Indexing
```pseudo
var arr[5]

# ❌ Wrong loop (misses last element)
For i = 1 To 5
    Print arr[i]  # Skips arr[0], tries arr[5]!
Endfor

# ✅ Correct
For i = 0 To 4
    Print arr[i]
Endfor
```

---

## 💡 Best Practices

1. **Use meaningful names**: `studentScores` not `arr1`
2. **Use constants** for array sizes
3. **Always check bounds** before accessing
4. **Initialize arrays** before using
5. **Document** what each array stores
6. **Use loops** to process arrays

---

## 🎓 Practice Exercises

### Exercise 1: Reverse Array
Create a program that reverses an array of numbers.

### Exercise 2: Find Duplicates
Find duplicate values in an array.

### Exercise 3: Array Statistics
Calculate min, max, sum, and average of an array.

---

**Next:** Learn about **[Advanced Features](14-Advanced-Syntax.md)** →

---

*Organize data efficiently with arrays!* 📊✨

