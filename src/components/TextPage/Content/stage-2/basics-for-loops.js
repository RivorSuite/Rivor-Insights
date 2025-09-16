export const basicsForLoops = {
    title: "For Loops",
    category: "Stage 2: Loops & Functions",
    content: [
        { type: 'h2', text: 'Repeating Actions with `for` Loops' },
        { type: 'p', text: 'Loops are a fundamental concept in programming that allow you to execute a block of code multiple times. A `for` loop is used for iterating over a sequence (that is either a list, a tuple, a dictionary, a set, or a string).' },
        
        { type: 'h2', text: 'Using `range()`' },
        { type: 'p', text: 'The most common way to write a `for` loop is with the built-in `range()` function. It generates a sequence of numbers, which the loop then iterates through. The loop will run up to, but not including, the number you specify.' },
        { type: 'code', text: '# This loop will run 5 times, for i = 0, 1, 2, 3, 4\n' + 'for i in range(5):\n' + '  print("Current number:", i)' },

        { type: 'h2', text: 'Looping Over a List' },
        { type: 'p', text: 'You can also iterate directly over the items of a list or other collection. The loop variable will take on the value of each item in the sequence, one by one.' },
        { type: 'code', text: 'fruits = ["Apple", "Banana", "Cherry"]\n\n' + 'for fruit in fruits:\n' + '  print("I have a", fruit)' },
    ]
};