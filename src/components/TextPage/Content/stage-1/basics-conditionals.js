export const basicsConditionals = {
    title: "Conditional Statements (If/Else)",
    category: "Stage 1: Foundational Concepts",
    content: [
        { type: 'h2', text: 'Making Decisions in Code' },
        { type: 'p', text: 'Conditional statements are the bedrock of logic in programming. They allow a program to execute specific blocks of code only when certain conditions are met, enabling it to respond dynamically to different inputs and states.' },
        { type: 'h2', text: 'The `if`, `elif`, and `else` Structure' },
        { type: 'p', text: 'This structure creates a chain of conditional checks. The program evaluates them in order and executes the code block for the *first* condition that evaluates to `True`. If no conditions are met, the `else` block is executed.' },
        { type: 'li', text: '<strong>if:</strong> The entry point of the conditional chain. Its block runs if the condition is `True`.' },
        { type: 'li', text: '<strong>elif (else if):</strong> Allows for checking multiple, mutually exclusive conditions in sequence.' },
        { type: 'li', text: '<strong>else:</strong> The optional fallback. Its block runs if and only if all preceding `if` and `elif` conditions were `False`.' },
        { type: 'h2', text: 'Example: Grading a Score' },
        { type: 'p', text: 'This classic example demonstrates the conditional chain. The program checks from the highest grade downwards and stops at the first true condition.' },
        { type: 'code', text: 'score = 85\n\nif score >= 90:\n  grade = "A"\nelif score >= 80:\n  grade = "B"  # This condition is met first, so this block runs\nelif score >= 70:\n  grade = "C"\nelse:\n  grade = "D"\n\nprint(f"The grade is: {grade}") # Output: The grade is: B' },
        { type: 'h2', text: 'Nested Conditionals' },
        { type: 'p', text: 'You can place conditional statements inside one another to handle more complex logic. However, it\'s important to use nesting judiciously, as deeply nested code can become difficult to read and maintain.' },
        { type: 'code', text: 'age = 25\nhas_license = True\n\nif age >= 18:\n  print("Person is an adult.")\n  if has_license:\n    print("Eligible to drive.")\n  else:\n    print("Not eligible to drive (needs a license).")\nelse:\n  print("Person is not an adult.")' },
        { type: 'h2', text: 'Truthy and Falsy Values' },
        { type: 'p', text: 'In many languages, it\'s not just the boolean `True` that an `if` statement considers true. Other values can also be treated as true or false in a boolean context. This is a powerful feature for writing concise code.' },
        { type: 'li', text: '<strong>Truthy:</strong> Any non-empty string, any non-zero number, and any non-empty collection (like a list or dictionary).' },
        { type: 'li', text: '<strong>Falsy:</strong> The number `0`, an empty string `""`, and empty collections (`[]`, `{}`). The special value `None` is also falsy.' },
        { type: 'code', text: 'user_name = "Alice"\nmy_list = []\n\n# The condition is true because the string is not empty\nif user_name:\n  print(f"Welcome, {user_name}!")\n\n# The condition is false because the list is empty\nif not my_list:\n  print("The list is empty.")' },
    ]
};