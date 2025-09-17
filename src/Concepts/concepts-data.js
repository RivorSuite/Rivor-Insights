export const conceptsInfo = {
    'variables': {
        title: 'Variables',
        category: 'Foundations',
        description: 'Learn to store and manage data.',
        icon: 'VariableIcon',
        about: {
            title: "About Variables & Data Types",
            description: "A variable is a symbolic name that refers to a location in computer memory. It's a container for storing data values. Understanding how to declare, assign, and use variables is the most fundamental skill in programming.",
            details: [
                { title: "Naming Rules (Must Follow)", complexity: "Syntax", note: "Names must start with a letter or underscore (_), can contain numbers, but cannot have spaces or special characters." },
                { title: "Case-Sensitivity", complexity: "Rule", note: "Variable names are case-sensitive, meaning 'score' and 'Score' are two different variables." },
                { title: "Reserved Keywords", complexity: "Rule", note: "Names cannot be a word that is part of the language's syntax, like 'if', 'for', or 'while'." },
                { title: "Naming Conventions (Should Follow)", complexity: "Best Practice", note: "Use descriptive names in snake_case (e.g., 'user_score') or camelCase (e.g., 'userScore') for readability." },
                { title: "Data Types", complexity: "Concept", note: "Variables hold different types of data, such as integers (whole numbers), floats (decimals), strings (text), and booleans (True/False)." },
            ]
        }
    },
    
    'operators': {
        title: 'Operators',
        category: 'Foundations',
        description: 'Perform calculations and comparisons.',
        icon: 'OperatorIcon',
        about: {
            title: "About Operators & Expressions",
            description: "Operators are special symbols that perform operations on values and variables. They are the building blocks of expressions, which are combinations of values, variables, and operators that a programming language interprets to produce another value.",
            details: [
                { title: "Arithmetic", complexity: "e.g., +, -, *", note: "Used for standard mathematical calculations like addition, subtraction, multiplication, etc." },
                { title: "Comparison", complexity: "e.g., ==, >, <", note: "Used to compare two values, resulting in a Boolean (True/False) outcome." },
                { title: "Logical", complexity: "e.g., and, or, not", note: "Used to combine or invert boolean expressions, crucial for complex decision-making." },
                { title: "Assignment", complexity: "e.g., =, +=", note: "Used to assign values to variables, including shorthand for operations like incrementing." },
                { title: "Precedence", complexity: "Concept", note: "The specific order in which operators are evaluated in a complex expression, similar to PEMDAS in math." },
            ]
        }
    },

    'conditionals': {
        title: 'If/Elif/Else',
        category: 'Control Flow',
        description: 'Make decisions in your code.',
        icon: 'ConditionalIcon',
        about: {
            title: "About Conditional Statements",
            description: "Conditional statements (if, elif, else) are the core of decision-making in programming. They allow a program to execute specific blocks of code only if certain conditions are true, enabling dynamic and responsive behavior.",
            details: [
                { title: "If", complexity: "Core", note: "The starting point. Executes its code block if its condition is true." },
                { title: "Elif (Else If)", complexity: "Chain", note: "Checks a new condition only if the preceding 'if' or 'elif' was false. You can have multiple 'elif' statements." },
                { title: "Else", complexity: "Fallback", note: "Optional. Executes its code block only if all preceding conditions in the chain were false." },
                { title: "Evaluation Order", complexity: "Rule", note: "The chain is evaluated from top to bottom. Only the code block for the *first* true condition is executed." },
                { title: "Boolean Logic", complexity: "Concept", note: "Conditions evaluate to a Boolean (True/False) value, often using comparison (e.g., score > 90) and logical (e.g., and, or) operators." },
            ]
        }
    },

    'loops': {
        title: 'Loops (For/While)',
        category: 'Control Flow',
        description: 'Repeat actions with conditions.',
        icon: 'LoopIcon',
        about: {
            title: "About Loops",
            description: "Loops are a fundamental construct that allow you to execute a block of code multiple times. They are essential for iterating over data and performing repetitive tasks without rewriting code.",
            details: [
                { title: "For Loops", complexity: "Iterative", note: "Best when you know how many times you need to loop, like for every item in a list or a set range of numbers." },
                { title: "While Loops", complexity: "Conditional", note: "Best when you want to loop as long as a condition is true, and you don't know the exact number of iterations beforehand." },
                { title: "Infinite Loops", complexity: "Warning", note: "A critical error where a loop's exit condition is never met, causing the program to hang." },
                { title: "Break & Continue", complexity: "Control", note: "'break' immediately exits the loop. 'continue' skips to the next iteration." },
            ]
        }
    },
};