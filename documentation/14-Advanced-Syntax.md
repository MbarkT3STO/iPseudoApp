# 🌟 Advanced Syntax Features

Master modern iPseudo features for professional pseudocode!

---

## 🎯 Overview

iPseudo supports advanced syntax features that make your code more expressive and professional.

---

## 📝 Variable Declaration Styles

### Three Ways to Declare Variables

iPseudo gives you flexibility in how you declare variables:

#### **1. Traditional Style**

```pseudo
Algorithm TraditionalStyle

var count = 0
var name = "Alice"
var price = 19.99
var isActive = true

Print count, name, price, isActive

Endalgorithm
```

**Best for:**
- Quick prototyping
- Short programs
- Familiar syntax

---

#### **2. Variable Keyword**

```pseudo
Algorithm VariableKeywordStyle

Variable count = 0
Variable name = "Alice"
Variable price = 19.99
Variable isActive = true

Print count, name, price, isActive

Endalgorithm
```

**Best for:**
- Explicit declarations
- Self-documenting code
- Educational purposes

---

#### **3. Declare As Type**

```pseudo
Algorithm DeclareAsTypeStyle

Declare count As Integer
Declare name As String
Declare price As Float
Declare isActive As Boolean

# Initialize separately
Set 0 To count
Set "Alice" To name
Set 19.99 To price
Set true To isActive

Print count, name, price, isActive

Endalgorithm
```

**Best for:**
- Type-safe code
- Professional algorithms
- Clear documentation
- Complex programs

---

## 🔄 Assignment Syntax Styles

### Two Ways to Assign Values

#### **1. Assignment Operator**

```pseudo
Algorithm AssignmentOperator

var total = 0
total = 100
total = total + 50

Print "Total:", total

Endalgorithm
```

---

#### **2. Set To Syntax**

```pseudo
Algorithm SetToSyntax

Variable total = 0
Set 100 To total
Set total + 50 To total

Print "Total:", total

Endalgorithm
```

**Natural language style:**
- "Set 100 to total" reads like English
- Clear intent
- Educational value

---

## 🎨 Combining Syntax Styles

### Mix and Match

You can combine different styles in the same program:

```pseudo
Algorithm MixedSyntaxStyle

# Traditional variable
var counter = 0

# Variable keyword
Variable userName = "System"

# Typed declaration
Declare totalScore As Float
Set 0.0 To totalScore

# Traditional assignment
counter = counter + 1

# Set To assignment
Set totalScore + 10.5 To totalScore

# All styles work together!
Print "Counter:", counter
Print "User:", userName
Print "Score:", totalScore

Endalgorithm
```

**Output:**
```
Counter: 1
User: System
Score: 10.5
```

---

## 💎 Constants

Declare values that never change:

### Constant Syntax

```pseudo
Constant NAME = value
```

### Example

```pseudo
Algorithm ConstantsExample

Constant PI = 3.14159
Constant TAX_RATE = 0.08
Constant MAX_USERS = 100
Constant COMPANY_NAME = "TechCorp"

# Constants cannot be changed
# PI = 3.14  # This would cause an error!

var radius = 5
var area = PI * radius * radius

Print "Circle area:", area

var price = 100
var tax = price * TAX_RATE
var total = price + tax

Print "Total with tax: $", total

Endalgorithm
```

**When to use constants:**
- Mathematical values (PI, E)
- Configuration values
- Maximum limits
- Fixed rates or percentages
- Application names

---

## 🎯 Advanced Type System

### All Supported Types

```pseudo
Algorithm CompleteTypeSystem

# Numeric types
Declare wholeNumber As Integer
Declare decimalNumber As Float
Declare anyNumber As Number

# Text types
Declare fullText As String
Declare singleChar As Char

# Boolean type
Declare trueOrFalse As Boolean

# Initialize
Set 42 To wholeNumber
Set 3.14 To decimalNumber
Set 100 To anyNumber

Set "Hello, World!" To fullText
Set 'A' To singleChar

Set true To trueOrFalse

# Display types
Print "Integer:", wholeNumber
Print "Float:", decimalNumber
Print "Number:", anyNumber
Print "String:", fullText
Print "Char:", singleChar
Print "Boolean:", trueOrFalse

Endalgorithm
```

---

## 🔧 Advanced Function Syntax

### Typed Functions

```pseudo
Algorithm TypedFunctions

Function calculateDiscount(price As Float, percent As Float)
    Declare discount As Float
    Set price * (percent / 100) To discount
    Return discount
Endfunction

Function isEligible(age As Integer, income As Float)
    Declare result As Boolean
    Set age >= 21 and income >= 30000 To result
    Return result
Endfunction

Function formatCurrency(amount As Float)
    Declare formatted As String
    Set "$" + amount To formatted
    Return formatted
Endfunction

# Main program
Declare originalPrice As Float
Set 100.00 To originalPrice

var discountAmount = calculateDiscount(originalPrice, 20.0)
var finalPrice = originalPrice - discountAmount

Print "Original:", formatCurrency(originalPrice)
Print "Discount:", formatCurrency(discountAmount)
Print "Final:", formatCurrency(finalPrice)

Endalgorithm
```

---

## 🎨 Advanced Patterns

### Pattern 1: Builder Pattern

```pseudo
Algorithm BuilderPattern

# Use Set To for step-by-step construction
Declare personName As String
Declare personAge As Integer
Declare personEmail As String
Declare personPhone As String

# Build person object step by step
Set "" To personName
Set 0 To personAge
Set "" To personEmail
Set "" To personPhone

# Set values
Set "Alice Johnson" To personName
Set 28 To personAge
Set "alice@email.com" To personEmail
Set "555-0123" To personPhone

# Display
Print "═══ Person Profile ═══"
Print "Name:", personName
Print "Age:", personAge
Print "Email:", personEmail
Print "Phone:", personPhone

Endalgorithm
```

---

### Pattern 2: Configuration with Constants

```pseudo
Algorithm ConfigurationPattern

# Application configuration
Constant APP_NAME = "Task Manager"
Constant APP_VERSION = "2.0"
Constant MAX_TASKS = 50
Constant AUTO_SAVE = true
Constant THEME = "dark"

# Database configuration
Constant DB_HOST = "localhost"
Constant DB_PORT = 5432
Constant DB_NAME = "tasks_db"

# Display configuration
Constant ITEMS_PER_PAGE = 10
Constant SHOW_TIMESTAMPS = true

Print "╔════════════════════════════════╗"
Print "║", APP_NAME, "v" + APP_VERSION
Print "╚════════════════════════════════╝"
Print ""
Print "Configuration:"
Print "- Max Tasks:", MAX_TASKS
Print "- Auto-save:", AUTO_SAVE
Print "- Theme:", THEME
Print "- Items/Page:", ITEMS_PER_PAGE

Endalgorithm
```

---

### Pattern 3: Type-Safe Data Processing

```pseudo
Algorithm TypeSafeProcessing

Function processOrder(orderId As Integer, amount As Float, customer As String)
    Declare tax As Float
    Declare total As Float
    Declare status As String
    
    Constant TAX_RATE = 0.08
    
    Set amount * TAX_RATE To tax
    Set amount + tax To total
    
    If total >= 100.00 Then
        Set "Premium" To status
    Else
        Set "Standard" To status
    Endif
    
    Print "═══ Order #", orderId, "═══"
    Print "Customer:", customer
    Print "Amount: $", amount
    Print "Tax: $", tax
    Print "Total: $", total
    Print "Status:", status
    Print ""
Endfunction

# Main program
Declare orderNumber As Integer
Declare orderAmount As Float
Declare customerName As String

Set 1001 To orderNumber
Set 125.50 To orderAmount
Set "John Smith" To customerName

processOrder(orderNumber, orderAmount, customerName)

Endalgorithm
```

---

## 🎯 Real-World Advanced Example

### Complete Inventory System

```pseudo
Algorithm AdvancedInventorySystem

# Configuration
Constant MAX_ITEMS = 100
Constant LOW_STOCK_THRESHOLD = 10
Constant REORDER_QUANTITY = 50

# Data arrays
var itemCodes[MAX_ITEMS]
var itemNames[MAX_ITEMS]
var itemQuantities[MAX_ITEMS]
var itemPrices[MAX_ITEMS]
var itemCount = 0

Function addItem(code As Integer, name As String, quantity As Integer, price As Float)
    If itemCount < MAX_ITEMS Then
        itemCodes[itemCount] = code
        itemNames[itemCount] = name
        itemQuantities[itemCount] = quantity
        itemPrices[itemCount] = price
        itemCount = itemCount + 1
        
        Print "✅ Added:", name
    Else
        Print "❌ Inventory full!"
    Endif
Endfunction

Function checkLowStock()
    Declare lowStockCount As Integer
    Set 0 To lowStockCount
    
    Print ""
    Print "═══ Low Stock Alert ═══"
    
    For i = 0 To itemCount - 1
        If itemQuantities[i] <= LOW_STOCK_THRESHOLD Then
            Print "⚠️", itemNames[i], "- Only", itemQuantities[i], "left"
            lowStockCount = lowStockCount + 1
        Endif
    Endfor
    
    If lowStockCount == 0 Then
        Print "✅ All items well stocked"
    Endif
    
    Return lowStockCount
Endfunction

Function calculateInventoryValue()
    Declare totalValue As Float
    Set 0.0 To totalValue
    
    For i = 0 To itemCount - 1
        Declare itemValue As Float
        Set itemQuantities[i] * itemPrices[i] To itemValue
        Set totalValue + itemValue To totalValue
    Endfor
    
    Return totalValue
Endfunction

Function displayInventory()
    Print ""
    Print "╔════════════════════════════════════════════════╗"
    Print "║             INVENTORY REPORT                   ║"
    Print "╚════════════════════════════════════════════════╝"
    Print ""
    
    For i = 0 To itemCount - 1
        Print "Code:", itemCodes[i]
        Print "Item:", itemNames[i]
        Print "Qty:", itemQuantities[i], "@ $", itemPrices[i], "each"
        
        Declare itemTotal As Float
        Set itemQuantities[i] * itemPrices[i] To itemTotal
        Print "Value: $", itemTotal
        Print ""
    Endfor
    
    var totalValue = calculateInventoryValue()
    Print "─────────────────────────────"
    Print "Total Inventory Value: $", totalValue
Endfunction

# Main program
Print "╔════════════════════════════════╗"
Print "║   INVENTORY MANAGEMENT SYSTEM  ║"
Print "╚════════════════════════════════╝"
Print ""

# Add initial inventory
addItem(1001, "Laptop", 15, 899.99)
addItem(1002, "Mouse", 45, 24.99)
addItem(1003, "Keyboard", 8, 79.99)
addItem(1004, "Monitor", 12, 299.99)
addItem(1005, "Headphones", 5, 149.99)

# Display inventory
displayInventory()

# Check for low stock
checkLowStock()

Print ""
Print "System ready! ✨"

Endalgorithm
```

---

## 📋 Syntax Style Guide

### When to Use Each Style

| Feature | Traditional | Variable | Declare As |
|---------|------------|----------|------------|
| **Quick prototypes** | ✅ `var x = 5` | ⭕ | ❌ |
| **Educational code** | ⭕ | ✅ `Variable x = 5` | ⭕ |
| **Type-safe code** | ❌ | ❌ | ✅ `Declare x As Integer` |
| **Professional** | ⭕ | ⭕ | ✅ |
| **Mixing styles** | ✅ | ✅ | ✅ |

---

## 💡 Pro Tips

### Tip 1: Choose Style by Context
```pseudo
# Quick script - use var
var temp = 42

# Educational - use Variable
Variable studentCount = 25

# Professional system - use Declare As
Declare accountBalance As Float
```

### Tip 2: Use Constants for Fixed Values
```pseudo
# ✅ Good
Constant MAX_ATTEMPTS = 3

# ❌ Bad
var MAX_ATTEMPTS = 3  # Might be changed accidentally
```

### Tip 3: Type Declarations for Complex Systems
```pseudo
# For simple scripts
var x = 10

# For complex systems
Declare transactionAmount As Float
Declare transactionId As Integer
Declare transactionStatus As String
```

---

## 🎓 Practice Exercises

### Exercise 1: Style Conversion
Convert a program using `var` to use `Declare As` syntax.

### Exercise 2: Constants Challenge
Identify values in a program that should be constants.

### Exercise 3: Mixed Style Program
Create a program that appropriately uses all three declaration styles.

---

**Explore more:** [Best Practices](17-Coding-Standards.md) →

---

*Use advanced syntax for professional code!* 🌟✨

