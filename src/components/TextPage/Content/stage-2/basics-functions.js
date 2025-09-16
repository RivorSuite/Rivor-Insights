export const basicsFunctions = {
    title: "Functions & Scope",
    category: "Stage 2: Loops & Functions",
    content: [
        { type: 'h2', text: 'Reusable Blocks of Code' },
        { type: 'p', text: 'Functions are reusable blocks of code that perform a specific task. They help organize your code, prevent repetition, and make your programs more modular. You define a function once and can then "call" it (run it) as many times as you need.' },
        { type: 'h2', text: 'Defining and Calling a Function' },
        { type: 'p', text: 'You use the `def` keyword to define a function. Functions can take inputs, called <strong>parameters</strong> (or arguments), and can send a value back using the <strong>`return`</strong> keyword.' },
        { type: 'code', text: '# Defines a function named "add" that takes two parameters\ndef add(a, b):\n  result = a + b\n  return result\n\n# Calls the function and stores its return value\nsum_value = add(10, 5)\nprint(sum_value)  # Output: 15' },
        { type: 'h2', text: 'Understanding Scope' },
        { type: 'p', text: 'Scope refers to the region of the code where a variable is accessible. A variable created inside a function (`local scope`) is only available within that function. A variable created outside all functions (`global scope`) can be accessed anywhere.' },
        { type: 'code', text: 'global_var = "I am outside!"\n\ndef my_function():\n  local_var = "I am inside!"\n  print(local_var)\n  print(global_var) # Can access global variables\n\nmy_function()\n# print(local_var) # This would cause an error!' }
    ]
};