export const basicsVariables = {
    title: "Variables & Data Types",
    category: "Stage 1: Foundational Concepts",
    content: [
        { type: 'h2', text: 'Variables: Named References to Memory' },
        { type: 'p', text: 'At its core, a variable is a symbolic name that refers to a location in computer memory. When you assign a value to a variable, you are instructing the program to store that value in a specific memory address and associate it with your chosen name. This abstraction allows you to work with data without needing to know the physical memory addresses.' },
        { type: 'code', text: '# The value 30 is stored in memory, and "age" becomes its label.\nage = 30\n\n# The value can be updated. The label "age" now points to a new value.\nage = 31' },

        { type: 'h2', text: 'Rules and Conventions for Naming' },
        { type: 'p', text: 'Proper naming is critical for writing clean, maintainable code. Languages enforce strict rules, and communities establish conventions.' },
        { type: 'li', text: '<strong>Rules (Must be followed):</strong> Most languages require variable names to start with a letter or an underscore (`_`). They can contain letters, numbers, and underscores, but cannot contain spaces or special characters like `!` or `@`. Names are also case-sensitive, meaning `age` and `Age` are two different variables.' },
        { type: 'li', text: '<strong>Conventions (Should be followed):</strong> In Python and JavaScript, the convention is `snake_case` (e.g., `user_name`). In Java and C#, it\'s `camelCase` (e.g., `userName`). Adhering to these conventions makes your code more readable to others in the community.' },
        { type: 'li', text: '<strong>Reserved Keywords:</strong> You cannot use words that are part of the language\'s syntax (e.g., `if`, `for`, `class`) as variable names.' },

        { type: 'h2', text: 'Primitive vs. Composite Data Types' },
        { type: 'p', text: 'Data types can be broadly categorized into two groups:' },
        { type: 'li', text: '<strong>Primitive Types:</strong> These are the most basic types that represent a single value. They are immutable in many languages. This includes <strong>integers</strong> (e.g., `42`), <strong>floats</strong> (e.g., `3.14`), <strong>strings</strong> (e.g., `"hello"`), and <strong>booleans</strong> (`True`/`False`).' },
        { type: 'li', text: '<strong>Composite (or Reference) Types:</strong> These are more complex structures that can hold collections of values. This includes data structures like <strong>arrays/lists</strong>, <strong>objects/dictionaries</strong>, and <strong>tuples</strong>. A variable holding a composite type stores a reference (or pointer) to the memory location where the collection is stored.' },
        
        { type: 'h2', text: 'The Concept of `null` or `None`' },
        { type: 'p', text: 'Most languages have a special type to represent the intentional absence of a value. In Python, this is `None`; in JavaScript, it\'s `null`. This is distinct from zero or an empty string. It signifies that a variable has been declared but has no value assigned to it yet.' },

        { type: 'h2', text: 'Type Systems: The Safety Net' },
        { type: 'p', text: 'The way a language handles data types has a profound impact on development.' },
        { type: 'li', text: '<strong>Dynamic Typing (e.g., Python):</strong> The type of a variable is checked at runtime. This offers flexibility but can lead to unexpected errors if, for example, you try to perform a mathematical operation on a string.' },
        { type: 'li', text: '<strong>Static Typing (e.g., Java, Rust, TypeScript):</strong> The type of a variable is declared and checked at compile-time. This catches type-mismatch errors early in the development process, leading to more robust and predictable code, especially in large-scale applications.' },

        { type: 'h2', text: 'Type Casting and Coercion' },
        { type: 'p', text: 'This refers to the conversion of data from one type to another.' },
        { type: 'li', text: '<strong>Explicit Casting:</strong> The programmer intentionally converts a type, for example, by calling `int("101")` to convert a string to an integer.' },
        { type: 'p', text: '<strong>Implicit Coercion:</strong> The language automatically converts a type. For instance, in some languages, ` "Result: " + 42 ` might automatically convert the integer `42` to a string to perform the concatenation.' },
        { type: 'code', text: '# Explicit casting\nstring_number = "101"\ninteger_number = int(string_number)\n\n# Implicit coercion (in a language like JavaScript)\n# The number 10 is automatically converted to a string.\nresult = "The answer is " + 10' },
    ]
};