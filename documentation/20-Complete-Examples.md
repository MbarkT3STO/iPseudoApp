# 🎯 Complete Program Examples

Full, real-world pseudocode programs demonstrating all features!

---

## 🏦 Example 1: Banking System

A complete banking system with accounts, deposits, and withdrawals:

```pseudo
Algorithm BankingSystem

Print "╔═══════════════════════════════╗"
Print "║   SIMPLE BANKING SYSTEM       ║"
Print "╚═══════════════════════════════╝"
Print ""

# Account data
Declare accountBalance As Float
Declare accountHolder As String
Declare transactionCount As Integer

Set 1000.00 To accountBalance
Set "John Doe" To accountHolder
Set 0 To transactionCount

# Main menu loop
Variable running = true

While running == true Do
    Print ""
    Print "═══ Account:", accountHolder, "═══"
    Print "Balance: $", accountBalance
    Print ""
    Print "1. Deposit"
    Print "2. Withdraw"
    Print "3. View Statement"
    Print "4. Exit"
    Print ""
    
    var choice = Input "Select option (1-4):"
    Print ""
    
    If choice == 1 Then
        var depositAmount = Input "Enter deposit amount: $"
        
        If depositAmount > 0 Then
            accountBalance = accountBalance + depositAmount
            transactionCount = transactionCount + 1
            Print "✅ Deposited $", depositAmount
            Print "New balance: $", accountBalance
        Else
            Print "❌ Invalid amount!"
        Endif
        
    Else
        If choice == 2 Then
            var withdrawAmount = Input "Enter withdrawal amount: $"
            
            If withdrawAmount > 0 and withdrawAmount <= accountBalance Then
                accountBalance = accountBalance - withdrawAmount
                transactionCount = transactionCount + 1
                Print "✅ Withdrew $", withdrawAmount
                Print "New balance: $", accountBalance
            Else
                If withdrawAmount > accountBalance Then
                    Print "❌ Insufficient funds!"
                Else
                    Print "❌ Invalid amount!"
                Endif
            Endif
            
        Else
            If choice == 3 Then
                Print "═══ Account Statement ═══"
                Print "Account Holder:", accountHolder
                Print "Current Balance: $", accountBalance
                Print "Total Transactions:", transactionCount
                
            Else
                If choice == 4 Then
                    running = false
                    Print "Thank you for using our bank!"
                    Print "Goodbye,", accountHolder
                Else
                    Print "❌ Invalid choice!"
                Endif
            Endif
        Endif
    Endif
Endwhile

Endalgorithm
```

---

## 🎮 Example 2: Game Scoreboard

Track multiple players and their scores:

```pseudo
Algorithm GameScoreboard

Constant MAX_PLAYERS = 5

var playerNames[MAX_PLAYERS]
var playerScores[MAX_PLAYERS]
var playerCount = 0

Print "╔═══════════════════════════════╗"
Print "║   GAME SCOREBOARD SYSTEM      ║"
Print "╚═══════════════════════════════╝"
Print ""

# Get number of players
var numPlayers = Input "How many players (1-5)?"

If numPlayers >= 1 and numPlayers <= MAX_PLAYERS Then
    playerCount = numPlayers
    
    # Initialize players
    Print ""
    Print "=== Enter Player Names ==="
    For i = 0 To playerCount - 1
        playerNames[i] = Input "Player " + (i + 1) + " name:"
        playerScores[i] = 0
    Endfor
    
    # Game rounds
    Print ""
    Print "=== Playing 3 Rounds ==="
    
    For round = 1 To 3
        Print ""
        Print "--- Round", round, "---"
        
        For player = 0 To playerCount - 1
            var points = Input playerNames[player] + " scored:"
            playerScores[player] = playerScores[player] + points
        Endfor
        
        # Show current standings
        Print ""
        Print "Current Standings:"
        For player = 0 To playerCount - 1
            Print "  ", playerNames[player], ":", playerScores[player], "pts"
        Endfor
    Endfor
    
    # Final results
    Print ""
    Print "╔═══════════════════════════════╗"
    Print "║   FINAL SCOREBOARD            ║"
    Print "╚═══════════════════════════════╝"
    Print ""
    
    # Find winner
    var winnerIndex = 0
    var highScore = playerScores[0]
    
    For i = 1 To playerCount - 1
        If playerScores[i] > highScore Then
            highScore = playerScores[i]
            winnerIndex = i
        Endif
    Endfor
    
    # Display all players
    For i = 0 To playerCount - 1
        If i == winnerIndex Then
            Print "🏆", playerNames[i], ":", playerScores[i], "pts (WINNER!)"
        Else
            Print "  ", playerNames[i], ":", playerScores[i], "pts"
        Endif
    Endfor
    
    Print ""
    Print "Congratulations,", playerNames[winnerIndex] + "!"
    
Else
    Print "❌ Invalid number of players!"
Endif

Endalgorithm
```

---

## 📚 Example 3: Library Management System

Manage books with borrowing functionality:

```pseudo
Algorithm LibrarySystem

Constant MAX_BOOKS = 10

var bookTitles[MAX_BOOKS]
var bookAuthors[MAX_BOOKS]
var bookAvailable[MAX_BOOKS]
var bookCount = 0

Function addBook(title, author)
    If bookCount < MAX_BOOKS Then
        bookTitles[bookCount] = title
        bookAuthors[bookCount] = author
        bookAvailable[bookCount] = true
        bookCount = bookCount + 1
        Print "✅ Book added successfully!"
    Else
        Print "❌ Library is full!"
    Endif
Endfunction

Function displayBooks()
    Print ""
    Print "═══ Library Catalog ═══"
    
    If bookCount == 0 Then
        Print "No books in library"
    Else
        For i = 0 To bookCount - 1
            var status = "Available"
            If bookAvailable[i] == false Then
                status = "Borrowed"
            Endif
            
            Print i + 1, ".", bookTitles[i]
            Print "   By:", bookAuthors[i]
            Print "   Status:", status
            Print ""
        Endfor
    Endif
Endfunction

Function borrowBook(bookIndex)
    If bookIndex >= 0 and bookIndex < bookCount Then
        If bookAvailable[bookIndex] == true Then
            bookAvailable[bookIndex] = false
            Print "✅ You borrowed:", bookTitles[bookIndex]
        Else
            Print "❌ Book already borrowed!"
        Endif
    Else
        Print "❌ Invalid book number!"
    Endif
Endfunction

Function returnBook(bookIndex)
    If bookIndex >= 0 and bookIndex < bookCount Then
        If bookAvailable[bookIndex] == false Then
            bookAvailable[bookIndex] = true
            Print "✅ Book returned:", bookTitles[bookIndex]
        Else
            Print "❌ Book wasn't borrowed!"
        Endif
    Else
        Print "❌ Invalid book number!"
    Endif
Endfunction

# Main program
Print "╔═══════════════════════════════╗"
Print "║   LIBRARY MANAGEMENT SYSTEM   ║"
Print "╚═══════════════════════════════╝"

# Add initial books
addBook("1984", "George Orwell")
addBook("To Kill a Mockingbird", "Harper Lee")
addBook("The Great Gatsby", "F. Scott Fitzgerald")
addBook("Pride and Prejudice", "Jane Austen")

# Main menu
var continue = true

While continue == true Do
    Print ""
    Print "1. View Books"
    Print "2. Borrow Book"
    Print "3. Return Book"
    Print "4. Add Book"
    Print "5. Exit"
    Print ""
    
    var choice = Input "Select option:"
    Print ""
    
    If choice == 1 Then
        displayBooks()
    Else
        If choice == 2 Then
            displayBooks()
            var bookNum = Input "Enter book number to borrow:"
            borrowBook(bookNum - 1)
        Else
            If choice == 3 Then
                displayBooks()
                var bookNum = Input "Enter book number to return:"
                returnBook(bookNum - 1)
            Else
                If choice == 4 Then
                    var title = Input "Book title:"
                    var author = Input "Book author:"
                    addBook(title, author)
                Else
                    If choice == 5 Then
                        continue = false
                        Print "Thank you for using the library system!"
                    Else
                        Print "❌ Invalid option!"
                    Endif
                Endif
            Endif
        Endif
    Endif
Endwhile

Endalgorithm
```

---

## 🎓 Example 4: Student Management System

Complete system with functions and arrays:

```pseudo
Algorithm StudentManagementSystem

Constant MAX_STUDENTS = 20

# Arrays for student data
var studentIDs[MAX_STUDENTS]
var studentNames[MAX_STUDENTS]
var mathScores[MAX_STUDENTS]
var scienceScores[MAX_STUDENTS]
var englishScores[MAX_STUDENTS]
var studentCount = 0

Function calculateGPA(math, science, english)
    var average = (math + science + english) / 3
    
    If average >= 90 Then
        Return 4.0
    Else
        If average >= 80 Then
            Return 3.0
        Else
            If average >= 70 Then
                Return 2.0
            Else
                If average >= 60 Then
                    Return 1.0
                Else
                    Return 0.0
                Endif
            Endif
        Endif
    Endif
Endfunction

Function addStudent(id, name, mathScore, sciScore, engScore)
    If studentCount < MAX_STUDENTS Then
        studentIDs[studentCount] = id
        studentNames[studentCount] = name
        mathScores[studentCount] = mathScore
        scienceScores[studentCount] = sciScore
        englishScores[studentCount] = engScore
        studentCount = studentCount + 1
        Print "✅ Student added successfully!"
    Else
        Print "❌ Student limit reached!"
    Endif
Endfunction

Function displayAllStudents()
    Print ""
    Print "═══ Student Records ═══"
    
    If studentCount == 0 Then
        Print "No students registered"
    Else
        For i = 0 To studentCount - 1
            var gpa = calculateGPA(mathScores[i], scienceScores[i], englishScores[i])
            
            Print ""
            Print "Student #", studentIDs[i]
            Print "Name:", studentNames[i]
            Print "Math:", mathScores[i], "| Science:", scienceScores[i], "| English:", englishScores[i]
            Print "GPA:", gpa
        Endfor
    Endif
Endfunction

Function findTopStudent()
    If studentCount == 0 Then
        Print "No students to analyze"
        Return
    Endif
    
    var topIndex = 0
    var topGPA = calculateGPA(mathScores[0], scienceScores[0], englishScores[0])
    
    For i = 1 To studentCount - 1
        var currentGPA = calculateGPA(mathScores[i], scienceScores[i], englishScores[i])
        
        If currentGPA > topGPA Then
            topGPA = currentGPA
            topIndex = i
        Endif
    Endfor
    
    Print ""
    Print "🏆 Top Student:", studentNames[topIndex]
    Print "GPA:", topGPA
Endfunction

# Main program
Print "╔════════════════════════════════════╗"
Print "║   STUDENT MANAGEMENT SYSTEM        ║"
Print "╚════════════════════════════════════╝"
Print ""

# Add sample students
addStudent(101, "Alice Johnson", 95, 92, 88)
addStudent(102, "Bob Smith", 78, 85, 82)
addStudent(103, "Charlie Brown", 92, 88, 95)

# Menu system
var running = true

While running == true Do
    Print ""
    Print "1. View All Students"
    Print "2. Add Student"
    Print "3. Find Top Student"
    Print "4. Exit"
    Print ""
    
    var choice = Input "Select option:"
    
    If choice == 1 Then
        displayAllStudents()
    Else
        If choice == 2 Then
            Print ""
            Print "=== Add New Student ==="
            var id = Input "Student ID:"
            var name = Input "Student Name:"
            var math = Input "Math Score:"
            var science = Input "Science Score:"
            var english = Input "English Score:"
            
            addStudent(id, name, math, science, english)
        Else
            If choice == 3 Then
                findTopStudent()
            Else
                If choice == 4 Then
                    running = false
                    Print ""
                    Print "Goodbye! 👋"
                Else
                    Print "❌ Invalid choice!"
                Endif
            Endif
        Endif
    Endif
Endwhile

Endalgorithm
```

---

## 🛒 Example 2: E-Commerce Order System

```pseudo
Algorithm ECommerceSystem

Constant TAX_RATE = 0.08
Constant SHIPPING_THRESHOLD = 50.00
Constant SHIPPING_COST = 9.99

Function calculateSubtotal(price, quantity)
    Return price * quantity
Endfunction

Function calculateTax(subtotal)
    Return subtotal * TAX_RATE
Endfunction

Function calculateShipping(subtotal)
    If subtotal >= SHIPPING_THRESHOLD Then
        Return 0.00
    Else
        Return SHIPPING_COST
    Endif
Endfunction

Function applyDiscount(subtotal, discountCode)
    If discountCode == "SAVE10" Then
        Return subtotal * 0.10
    Else
        If discountCode == "SAVE20" Then
            Return subtotal * 0.20
        Else
            Return 0.00
        Endif
    Endif
Endfunction

# Main program
Print "╔════════════════════════════════╗"
Print "║   E-COMMERCE CHECKOUT          ║"
Print "╚════════════════════════════════╝"
Print ""

# Product selection
var productName = Input "Product name:"
var productPrice = Input "Product price: $"
var quantity = Input "Quantity:"

Print ""

# Discount code
var hasDiscount = Input "Have a discount code? (yes/no):"
var discountCode = ""
var discountAmount = 0.00

If hasDiscount == "yes" Then
    discountCode = Input "Enter discount code:"
Endif

Print ""
Print "═══ Order Summary ═══"
Print ""
Print "Product:", productName
Print "Price: $", productPrice
Print "Quantity:", quantity
Print ""

# Calculate costs
var subtotal = calculateSubtotal(productPrice, quantity)
Print "Subtotal: $", subtotal

If discountCode != "" Then
    discountAmount = applyDiscount(subtotal, discountCode)
    If discountAmount > 0 Then
        subtotal = subtotal - discountAmount
        Print "Discount: -$", discountAmount
        Print "After Discount: $", subtotal
    Else
        Print "Invalid discount code"
    Endif
Endif

var tax = calculateTax(subtotal)
var shipping = calculateShipping(subtotal)
var total = subtotal + tax + shipping

Print "Tax (8%): $", tax
Print "Shipping: $", shipping

If shipping == 0 Then
    Print "  (FREE - Order over $50!)"
Endif

Print "─────────────────────"
Print "TOTAL: $", total
Print ""

If total >= 100 Then
    Print "🎉 Big spender! Thanks for your order!"
Else
    Print "✅ Order confirmed!"
Endif

Endalgorithm
```

---

## 📊 Example 3: Statistical Analysis Tool

```pseudo
Algorithm StatisticalAnalysis

Function calculateMean(data, size)
    var sum = 0
    
    For i = 0 To size - 1
        sum = sum + data[i]
    Endfor
    
    Return sum / size
Endfunction

Function calculateMedian(data, size)
    # Simplified: assumes sorted data
    If size mod 2 == 0 Then
        var mid1 = data[size / 2 - 1]
        var mid2 = data[size / 2]
        Return (mid1 + mid2) / 2
    Else
        Return data[size / 2]
    Endif
Endfunction

Function findMode(data, size)
    # Find most frequent value (simplified)
    var maxCount = 0
    var mode = data[0]
    
    For i = 0 To size - 1
        var count = 0
        
        For j = 0 To size - 1
            If data[j] == data[i] Then
                count = count + 1
            Endif
        Endfor
        
        If count > maxCount Then
            maxCount = count
            mode = data[i]
        Endif
    Endfor
    
    Return mode
Endfunction

Function calculateRange(data, size)
    var min = data[0]
    var max = data[0]
    
    For i = 1 To size - 1
        If data[i] < min Then
            min = data[i]
        Endif
        
        If data[i] > max Then
            max = data[i]
        Endif
    Endfor
    
    Return max - min
Endfunction

# Main program
Print "╔════════════════════════════════╗"
Print "║   STATISTICAL ANALYSIS TOOL    ║"
Print "╚════════════════════════════════╝"
Print ""

var dataSize = Input "How many data points (max 20)?"

If dataSize > 0 and dataSize <= 20 Then
    var dataset[dataSize]
    
    Print ""
    Print "Enter", dataSize, "values:"
    
    For i = 0 To dataSize - 1
        dataset[i] = Input "Value " + (i + 1) + ":"
    Endfor
    
    # Calculate statistics
    var mean = calculateMean(dataset, dataSize)
    var median = calculateMedian(dataset, dataSize)
    var mode = findMode(dataset, dataSize)
    var range = calculateRange(dataset, dataSize)
    
    # Display results
    Print ""
    Print "╔════════════════════════════════╗"
    Print "║   STATISTICAL RESULTS          ║"
    Print "╚════════════════════════════════╝"
    Print ""
    Print "Dataset:"
    For i = 0 To dataSize - 1
        Print "  ", dataset[i]
    Endfor
    Print ""
    Print "Mean (Average):", mean
    Print "Median:", median
    Print "Mode:", mode
    Print "Range:", range
    Print ""
    
    # Interpretation
    If mean > median Then
        Print "📊 Data is right-skewed"
    Else
        If mean < median Then
            Print "📊 Data is left-skewed"
        Else
            Print "📊 Data is symmetric"
        Endif
    Endif
Else
    Print "❌ Invalid data size!"
Endif

Endalgorithm
```

---

## 🎲 Example 4: Dice Game Simulator

```pseudo
Algorithm DiceGameSimulator

Constant WINNING_SCORE = 100

var player1Score = 0
var player2Score = 0
var currentPlayer = 1

Function rollDice()
    # Simulated random dice roll (1-6)
    # In real implementation, this would be random
    var roll = Input "Enter dice roll (1-6):"
    Return roll
Endfunction

Function takeTurn(playerNumber, currentScore)
    Print ""
    Print "─── Player", playerNumber, "Turn ───"
    Print "Current score:", currentScore
    
    var turnScore = 0
    var rolling = true
    
    While rolling == true Do
        Print ""
        var decision = Input "Roll dice or Hold? (roll/hold):"
        
        If decision == "roll" Then
            var dice = rollDice()
            Print "🎲 Rolled:", dice
            
            If dice == 1 Then
                Print "💔 Rolled a 1! Turn over, no points"
                turnScore = 0
                rolling = false
            Else
                turnScore = turnScore + dice
                Print "Turn score so far:", turnScore
                Print "Total if you hold:", currentScore + turnScore
            Endif
        Else
            If decision == "hold" Then
                rolling = false
                Print "✋ Holding with", turnScore, "points"
            Endif
        Endif
    Endwhile
    
    Return turnScore
Endfunction

# Main program
Print "╔════════════════════════════════╗"
Print "║   DICE GAME - Race to 100!     ║"
Print "╚════════════════════════════════╝"
Print ""
Print "Rules:"
Print "- Roll dice to accumulate points"
Print "- Hold to bank points"
Print "- Roll a 1 and lose turn points!"
Print "- First to 100 wins!"

While player1Score < WINNING_SCORE and player2Score < WINNING_SCORE Do
    # Player 1's turn
    var p1Points = takeTurn(1, player1Score)
    player1Score = player1Score + p1Points
    
    Print ""
    Print "═══ Scores ═══"
    Print "Player 1:", player1Score
    Print "Player 2:", player2Score
    
    If player1Score >= WINNING_SCORE Then
        Print ""
        Print "🏆 Player 1 WINS!"
    Else
        # Player 2's turn
        var p2Points = takeTurn(2, player2Score)
        player2Score = player2Score + p2Points
        
        Print ""
        Print "═══ Scores ═══"
        Print "Player 1:", player1Score
        Print "Player 2:", player2Score
        
        If player2Score >= WINNING_SCORE Then
            Print ""
            Print "🏆 Player 2 WINS!"
        Endif
    Endif
Endwhile

Print ""
Print "Game Over!"
Print "Final Scores: P1:", player1Score, "| P2:", player2Score

Endalgorithm
```

---

## 📝 Example 5: To-Do List Manager

```pseudo
Algorithm TodoListManager

Constant MAX_TASKS = 15

var tasks[MAX_TASKS]
var taskCompleted[MAX_TASKS]
var taskCount = 0

Function addTask(description)
    If taskCount < MAX_TASKS Then
        tasks[taskCount] = description
        taskCompleted[taskCount] = false
        taskCount = taskCount + 1
        Print "✅ Task added!"
    Else
        Print "❌ Task list is full!"
    Endif
Endfunction

Function displayTasks()
    Print ""
    Print "═══ Your To-Do List ═══"
    
    If taskCount == 0 Then
        Print "No tasks yet!"
    Else
        For i = 0 To taskCount - 1
            var status = "⬜"
            If taskCompleted[i] == true Then
                status = "✅"
            Endif
            
            Print i + 1, ".", status, tasks[i]
        Endfor
    Endif
    
    # Show statistics
    var completed = 0
    For i = 0 To taskCount - 1
        If taskCompleted[i] == true Then
            completed = completed + 1
        Endif
    Endfor
    
    Print ""
    Print "Progress:", completed, "/", taskCount, "tasks completed"
Endfunction

Function completeTask(taskNumber)
    var index = taskNumber - 1
    
    If index >= 0 and index < taskCount Then
        If taskCompleted[index] == false Then
            taskCompleted[index] = true
            Print "✅ Marked as complete:", tasks[index]
        Else
            Print "⚠️ Task already completed!"
        Endif
    Else
        Print "❌ Invalid task number!"
    Endif
Endfunction

# Main program
Print "╔════════════════════════════════╗"
Print "║   TO-DO LIST MANAGER           ║"
Print "╚════════════════════════════════╝"

var running = true

While running == true Do
    Print ""
    Print "1. View Tasks"
    Print "2. Add Task"
    Print "3. Complete Task"
    Print "4. Exit"
    Print ""
    
    var choice = Input "Select option:"
    
    If choice == 1 Then
        displayTasks()
    Else
        If choice == 2 Then
            var taskDesc = Input "Enter task description:"
            addTask(taskDesc)
        Else
            If choice == 3 Then
                displayTasks()
                var taskNum = Input "Enter task number to complete:"
                completeTask(taskNum)
            Else
                If choice == 4 Then
                    running = false
                    Print ""
                    Print "✨ Stay productive!"
                Else
                    Print "❌ Invalid choice!"
                Endif
            Endif
        Endif
    Endif
Endwhile

Endalgorithm
```

---

## 🎯 Key Takeaways

These complete examples demonstrate:

✅ **Program Structure** - Proper organization  
✅ **Functions** - Reusable, modular code  
✅ **Arrays** - Managing collections  
✅ **Loops** - Processing data  
✅ **Conditions** - Decision making  
✅ **Input/Output** - User interaction  
✅ **Constants** - Fixed values  
✅ **Type System** - Declaring types  

---

## 💡 Learning Path

1. **Start simple** - Begin with one feature
2. **Add complexity** - Combine multiple features
3. **Create systems** - Build complete programs
4. **Refactor** - Improve and organize code
5. **Document** - Add comments and structure

---

## 🎓 Practice Challenges

### Challenge 1: Contact Manager
Create a system to store and manage contacts (name, phone, email).

### Challenge 2: Inventory System
Build an inventory tracker with add, remove, and search functions.

### Challenge 3: Quiz Game
Design a quiz game with questions, answers, and scoring.

### Challenge 4: Budget Tracker
Create a personal budget tracker with income and expenses.

---

*Build complete, professional algorithms!* 🎯✨

