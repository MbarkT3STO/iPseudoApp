// Quiz Data for all lessons
const quizData = {
    // Lesson 1: Introduction to Pseudocode
    1: {
        title: "Introduction to Pseudocode",
        description: "Test your understanding of pseudocode basics",
        level: "beginner",
        lessonUrl: "../01-introduction-to-pseudocode.html",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                question: "What is pseudocode?",
                options: [
                    "A programming language",
                    "A plain language description of algorithm steps",
                    "A type of compiler",
                    "An error in code"
                ],
                correct: 1,
                explanation: "Pseudocode is a plain language description of the steps in an algorithm, not an actual programming language."
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "Why do we use pseudocode?",
                options: [
                    "To confuse beginners",
                    "To plan algorithms before writing code",
                    "To replace real programming",
                    "Only for documentation"
                ],
                correct: 1,
                explanation: "Pseudocode helps us plan and design algorithms before implementing them in actual code."
            },
            {
                id: 3,
                type: "true-false",
                question: "Pseudocode must follow strict syntax rules like programming languages.",
                options: ["True", "False"],
                correct: 1,
                explanation: "False. Pseudocode doesn't follow strict syntax rules - it's meant to be readable and understandable."
            },
            {
                id: 4,
                type: "multiple-choice",
                question: "Which of these is a benefit of pseudocode?",
                options: [
                    "Language independence",
                    "Faster execution",
                    "Better graphics",
                    "Automatic debugging"
                ],
                correct: 0,
                explanation: "Pseudocode is language-independent, meaning it can be translated to any programming language."
            },
            {
                id: 5,
                type: "multiple-choice",
                question: "Pseudocode is best described as:",
                options: [
                    "Low-level machine code",
                    "High-level algorithm description",
                    "Compiled binary",
                    "Database query"
                ],
                correct: 1,
                explanation: "Pseudocode is a high-level description of algorithms using natural language."
            }
        ]
    },

    // Lesson 2: Getting Started
    2: {
        title: "Getting Started with iPseudo",
        description: "Test your knowledge of iPseudo basics",
        level: "beginner",
        lessonUrl: "../02-getting-started.html",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                question: "Every iPseudo program must start with which keyword?",
                options: ["Start", "Algorithm", "Begin", "Program"],
                correct: 1,
                explanation: "Every iPseudo program starts with the 'Algorithm' keyword followed by a name."
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "How do you end an iPseudo algorithm?",
                options: ["End", "Stop", "Endalgorithm", "Finish"],
                correct: 2,
                explanation: "iPseudo algorithms end with the 'Endalgorithm' keyword."
            },
            {
                id: 3,
                type: "code-completion",
                question: "Complete the basic iPseudo program structure:",
                code: "Algorithm HelloWorld\n___\n  Print \"Hello World\"\n___",
                options: [
                    "Begin / End",
                    "Start / Stop",
                    "{ / }",
                    "No additional keywords needed"
                ],
                correct: 3,
                explanation: "In iPseudo, you only need 'Algorithm' at the start and 'Endalgorithm' at the end. No additional keywords are needed."
            },
            {
                id: 4,
                type: "true-false",
                question: "The algorithm name must start with a capital letter in iPseudo.",
                options: ["True", "False"],
                correct: 1,
                explanation: "False. While it's a good practice, iPseudo doesn't strictly enforce capitalization of algorithm names."
            },
            {
                id: 5,
                type: "multiple-choice",
                question: "What does the Print statement do?",
                options: [
                    "Saves data to file",
                    "Displays output to the user",
                    "Prints on paper",
                    "Creates a variable"
                ],
                correct: 1,
                explanation: "The Print statement displays output to the user on the screen."
            }
        ]
    },

    // Lesson 3: Variables and Data Types
    3: {
        title: "Variables and Data Types",
        description: "Master variables and data types concepts",
        level: "beginner",
        lessonUrl: "../03-variables-and-data-types.html",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                question: "Which keyword is used to declare a variable in iPseudo?",
                options: ["Let", "Var", "Declare", "Both Var and Declare"],
                correct: 3,
                explanation: "Both 'Var' and 'Declare' can be used to declare variables in iPseudo."
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "What is the correct way to declare an integer variable 'age'?",
                options: [
                    "Var age Integer",
                    "Var age = 0",
                    "Declare age As Integer",
                    "Both B and C"
                ],
                correct: 3,
                explanation: "Both 'Var age = 0' and 'Declare age As Integer' are valid ways to declare an integer."
            },
            {
                id: 3,
                type: "multiple-choice",
                question: "Which data type would you use to store 3.14?",
                options: ["Integer", "String", "Float", "Boolean"],
                correct: 2,
                explanation: "Float is used to store decimal numbers like 3.14."
            },
            {
                id: 4,
                type: "code-completion",
                question: "What will be the value of x after this code?",
                code: "Var x = 10\nVar y = 20\nx = y",
                options: ["10", "20", "30", "Error"],
                correct: 1,
                explanation: "x will be 20 because we assigned the value of y (which is 20) to x."
            },
            {
                id: 5,
                type: "true-false",
                question: "A Boolean variable can store only True or False values.",
                options: ["True", "False"],
                correct: 0,
                explanation: "True. Boolean variables can only hold True or False values."
            }
        ]
    },

    // Lesson 5: Operators
    5: {
        title: "Operators",
        description: "Test your knowledge of arithmetic, comparison, and logical operators",
        level: "beginner",
        lessonUrl: "../05-operators.html",
        questions: [
            {
                id: 1,
                type: "code-completion",
                question: "What is the result of: 17 mod 5",
                code: "Var result = 17 mod 5\nPrint result",
                options: ["3", "2", "5", "17"],
                correct: 1,
                explanation: "The mod operator returns the remainder. 17 ÷ 5 = 3 remainder 2, so 17 mod 5 = 2."
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "Which operator checks if two values are equal?",
                options: ["=", "==", "!=", "==="],
                correct: 1,
                explanation: "The == operator checks for equality, while = is for assignment."
            },
            {
                id: 3,
                type: "code-completion",
                question: "What does this expression evaluate to?",
                code: "(5 > 3) and (10 < 20)",
                options: ["True", "False", "Error", "5"],
                correct: 0,
                explanation: "Both conditions are true (5 > 3 is true, 10 < 20 is true), so 'and' returns True."
            },
            {
                id: 4,
                type: "multiple-choice",
                question: "What is the order of operations in: 2 + 3 * 4",
                options: ["20", "14", "9", "12"],
                correct: 1,
                explanation: "Multiplication happens first: 3 * 4 = 12, then 2 + 12 = 14."
            },
            {
                id: 5,
                type: "true-false",
                question: "The 'not' operator inverts a Boolean value.",
                options: ["True", "False"],
                correct: 0,
                explanation: "True. 'not True' becomes False, and 'not False' becomes True."
            }
        ]
    },

    // Lesson 7: Conditional Statements
    7: {
        title: "Conditional Statements",
        description: "Master If, Else, and decision making",
        level: "intermediate",
        lessonUrl: "../07-conditional-statements.html",
        questions: [
            {
                id: 1,
                type: "code-completion",
                question: "What will this code print?",
                code: "Var x = 15\nIf x > 10 Then\n  Print \"Large\"\nElse\n  Print \"Small\"\nEndif",
                options: ["Large", "Small", "15", "Nothing"],
                correct: 0,
                explanation: "Since 15 > 10 is true, the If block executes and prints 'Large'."
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "Which keyword ends an If statement in iPseudo?",
                options: ["End", "Endif", "Fi", "Close"],
                correct: 1,
                explanation: "If statements in iPseudo end with 'Endif'."
            },
            {
                id: 3,
                type: "code-completion",
                question: "What will this code print if score = 75?",
                code: "If score >= 90 Then\n  Print \"A\"\nElseif score >= 80 Then\n  Print \"B\"\nElseif score >= 70 Then\n  Print \"C\"\nElse\n  Print \"F\"\nEndif",
                options: ["A", "B", "C", "F"],
                correct: 2,
                explanation: "Score 75 satisfies the condition score >= 70, so it prints 'C'."
            },
            {
                id: 4,
                type: "true-false",
                question: "You can have multiple Elseif blocks in a single If statement.",
                options: ["True", "False"],
                correct: 0,
                explanation: "True. You can chain multiple Elseif conditions to test different cases."
            },
            {
                id: 5,
                type: "multiple-choice",
                question: "What is nested If?",
                options: [
                    "Multiple If statements on same level",
                    "An If statement inside another If statement",
                    "If without Endif",
                    "If with multiple conditions"
                ],
                correct: 1,
                explanation: "Nested If means placing an If statement inside another If statement's body."
            }
        ]
    },

    // Lesson 8: Loops
    8: {
        title: "Loops",
        description: "Test your understanding of For, While, and Repeat loops",
        level: "intermediate",
        lessonUrl: "../08-loops.html",
        questions: [
            {
                id: 1,
                type: "code-completion",
                question: "How many times will this loop execute?",
                code: "For i = 1 To 5\n  Print i\nEndfor",
                options: ["4", "5", "6", "Infinite"],
                correct: 1,
                explanation: "The loop runs from 1 to 5 inclusive, so it executes 5 times."
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "What does 'Step' do in a For loop?",
                options: [
                    "Stops the loop",
                    "Sets the increment value",
                    "Skips iterations",
                    "Counts backwards"
                ],
                correct: 1,
                explanation: "Step sets how much to increment the counter each iteration (default is 1)."
            },
            {
                id: 3,
                type: "code-completion",
                question: "What will this While loop print?",
                code: "Var x = 1\nWhile x <= 3\n  Print x\n  x = x + 1\nEndwhile",
                options: ["1 2 3", "1 2", "1 2 3 4", "Infinite loop"],
                correct: 0,
                explanation: "The loop prints 1, 2, 3 then stops when x becomes 4 (4 <= 3 is false)."
            },
            {
                id: 4,
                type: "true-false",
                question: "A Repeat-Until loop always executes at least once.",
                options: ["True", "False"],
                correct: 0,
                explanation: "True. Repeat-Until checks the condition at the end, so it runs at least once."
            },
            {
                id: 5,
                type: "multiple-choice",
                question: "What's the difference between While and Repeat-Until?",
                options: [
                    "No difference",
                    "While checks condition first, Repeat checks after",
                    "While is faster",
                    "Repeat can't use variables"
                ],
                correct: 1,
                explanation: "While checks the condition before executing, Repeat-Until checks after."
            }
        ]
    },

    // Lesson 10: Functions
    10: {
        title: "Functions",
        description: "Master functions and return values",
        level: "intermediate",
        lessonUrl: "../10-functions.html",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                question: "What keyword is used to define a function in iPseudo?",
                options: ["Def", "Function", "Func", "Method"],
                correct: 1,
                explanation: "Functions are defined using the 'Function' keyword in iPseudo."
            },
            {
                id: 2,
                type: "code-completion",
                question: "What does this function return?",
                code: "Function Double(x)\n  Return x * 2\nEndfunction\n\nVar result = Double(5)",
                options: ["5", "10", "2", "Error"],
                correct: 1,
                explanation: "The function multiplies x by 2, so Double(5) returns 10."
            },
            {
                id: 3,
                type: "true-false",
                question: "A function must always have a return statement.",
                options: ["True", "False"],
                correct: 1,
                explanation: "False. Procedures (functions without return values) don't need return statements."
            },
            {
                id: 4,
                type: "multiple-choice",
                question: "What are function parameters?",
                options: [
                    "Return values",
                    "Input values passed to function",
                    "Function names",
                    "Loop variables"
                ],
                correct: 1,
                explanation: "Parameters are input values passed to a function when calling it."
            },
            {
                id: 5,
                type: "code-completion",
                question: "How many parameters does this function have?",
                code: "Function Add(a, b, c)\n  Return a + b + c\nEndfunction",
                options: ["1", "2", "3", "None"],
                correct: 2,
                explanation: "The function has 3 parameters: a, b, and c."
            }
        ]
    },

    // Lesson 12: Arrays
    12: {
        title: "Arrays",
        description: "Test your array knowledge",
        level: "intermediate",
        lessonUrl: "../12-arrays.html",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                question: "How do you declare an array in iPseudo?",
                options: [
                    "Var arr[]",
                    "Var arr = Array()",
                    "Var arr = [1, 2, 3]",
                    "All of the above"
                ],
                correct: 2,
                explanation: "Arrays in iPseudo are declared using square brackets: Var arr = [1, 2, 3]"
            },
            {
                id: 2,
                type: "code-completion",
                question: "What is arr[1] in this array?",
                code: "Var arr = [10, 20, 30, 40]",
                options: ["10", "20", "30", "Error"],
                correct: 1,
                explanation: "Array indexing starts at 0, so arr[1] is the second element: 20."
            },
            {
                id: 3,
                type: "multiple-choice",
                question: "How do you get the length of an array?",
                options: ["arr.length", "Size(arr)", "Length(arr)", "arr.size()"],
                correct: 1,
                explanation: "Use the Size() function to get array length: Size(arr)"
            },
            {
                id: 4,
                type: "true-false",
                question: "Array indices in iPseudo start at 1.",
                options: ["True", "False"],
                correct: 1,
                explanation: "False. Array indices start at 0, like most programming languages."
            },
            {
                id: 5,
                type: "code-completion",
                question: "What will this code print?",
                code: "Var numbers = [5, 10, 15]\nPrint numbers[2]",
                options: ["5", "10", "15", "Error"],
                correct: 2,
                explanation: "numbers[2] accesses the third element (index 2), which is 15."
            }
        ]
    },

    // Lesson 15: Recursion
    15: {
        title: "Recursion",
        description: "Master recursive functions",
        level: "advanced",
        lessonUrl: "../15-recursion.html",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                question: "What is recursion?",
                options: [
                    "A loop structure",
                    "A function calling itself",
                    "An array operation",
                    "A variable type"
                ],
                correct: 1,
                explanation: "Recursion is when a function calls itself to solve a problem."
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "What is essential for every recursive function?",
                options: [
                    "Loop",
                    "Array",
                    "Base case",
                    "Print statement"
                ],
                correct: 2,
                explanation: "A base case is essential to stop recursion and prevent infinite loops."
            },
            {
                id: 3,
                type: "code-completion",
                question: "What does Factorial(4) return?",
                code: "Function Factorial(n)\n  If n <= 1 Then\n    Return 1\n  Else\n    Return n * Factorial(n-1)\n  Endif\nEndfunction",
                options: ["4", "10", "24", "120"],
                correct: 2,
                explanation: "Factorial(4) = 4 * 3 * 2 * 1 = 24"
            },
            {
                id: 4,
                type: "true-false",
                question: "Recursion is always more efficient than iteration.",
                options: ["True", "False"],
                correct: 1,
                explanation: "False. Recursion can be less efficient due to function call overhead."
            },
            {
                id: 5,
                type: "multiple-choice",
                question: "What happens without a base case?",
                options: [
                    "Code runs faster",
                    "Stack overflow / infinite recursion",
                    "Syntax error",
                    "Nothing"
                ],
                correct: 1,
                explanation: "Without a base case, recursion continues infinitely, causing stack overflow."
            }
        ]
    },

    // Lesson 16: Sorting Algorithms
    16: {
        title: "Sorting Algorithms",
        description: "Test your sorting algorithm knowledge",
        level: "advanced",
        lessonUrl: "../16-sorting-algorithms.html",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                question: "Which sorting algorithm compares adjacent elements?",
                options: ["Bubble Sort", "Binary Search", "Quick Sort", "Merge Sort"],
                correct: 0,
                explanation: "Bubble Sort repeatedly compares and swaps adjacent elements."
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "What is the main idea of Selection Sort?",
                options: [
                    "Divide array in half",
                    "Find minimum and place it at beginning",
                    "Compare adjacent pairs",
                    "Use recursion"
                ],
                correct: 1,
                explanation: "Selection Sort finds the minimum element and places it at the correct position."
            },
            {
                id: 3,
                type: "true-false",
                question: "Bubble Sort is the most efficient sorting algorithm.",
                options: ["True", "False"],
                correct: 1,
                explanation: "False. Bubble Sort is one of the least efficient, with O(n²) complexity."
            },
            {
                id: 4,
                type: "multiple-choice",
                question: "Which algorithm works by building a sorted portion element by element?",
                options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"],
                correct: 2,
                explanation: "Insertion Sort builds a sorted array one element at a time."
            },
            {
                id: 5,
                type: "code-completion",
                question: "After one pass of Bubble Sort on [5,2,8,1], what's the result?",
                code: "Array: [5, 2, 8, 1]\nAfter first pass:",
                options: ["[1,2,5,8]", "[2,5,1,8]", "[2,1,5,8]", "[5,2,1,8]"],
                correct: 1,
                explanation: "Bubble sort compares pairs: [5,2] swap → [2,5,8,1], [5,8] no swap, [8,1] swap → [2,5,1,8]"
            }
        ]
    }
};

// Quiz metadata for the index page
const quizMetadata = {
    1: { questions: 5, duration: "5 min", level: "beginner" },
    2: { questions: 5, duration: "5 min", level: "beginner" },
    3: { questions: 5, duration: "7 min", level: "beginner" },
    5: { questions: 5, duration: "7 min", level: "beginner" },
    7: { questions: 5, duration: "8 min", level: "intermediate" },
    8: { questions: 5, duration: "10 min", level: "intermediate" },
    10: { questions: 5, duration: "8 min", level: "intermediate" },
    12: { questions: 5, duration: "10 min", level: "intermediate" },
    15: { questions: 5, duration: "12 min", level: "advanced" },
    16: { questions: 5, duration: "12 min", level: "advanced" }
};

