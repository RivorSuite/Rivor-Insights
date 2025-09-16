export const basicsWhileLoops = {
    title: "While Loops",
    category: "Stage 2: Loops & Functions",
    content: [
        { type: 'h2', text: 'Condition-Based Repetition' },
        { type: 'p', text: 'Unlike a `for` loop that runs for a set number of times, a `while` loop runs as long as a certain condition remains `True`. It keeps checking the condition before each iteration, and stops as soon as the condition becomes `False`.' },
        
        { type: 'h2', text: 'The Structure of a `while` Loop' },
        { type: 'p', text: 'A `while` loop requires careful setup. You typically need a variable that the condition checks, and you must ensure that something inside the loop changes that variable so the loop can eventually end.' },
        { type: 'p', text: '<strong>Warning:</strong> If the condition never becomes false, you will create an infinite loop, which can crash your program!' },
        { type: 'code', text: 'count = 0  # 1. Initialize a counter variable\n\n' + 'while count < 5:  # 2. Set the condition\n' + '  print("Count is:", count)\n' + '  count = count + 1  # 3. IMPORTANT: Change the variable to work towards the exit condition' },

        { type: 'h2', text: 'When to Use `while` vs. `for`' },
        { type: 'li', text: 'Use a <strong>`for` loop</strong> when you know how many times you want to loop (e.g., for every item in a list, or for 10 repetitions).' },
        { type: 'li', text: 'Use a <strong>`while` loop</strong> when you want to loop until a specific condition is met (e.g., until the user enters "quit", or until a value reaches a certain threshold).' },
    ]
};