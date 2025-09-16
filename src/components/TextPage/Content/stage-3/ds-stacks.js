export const dsStacks = {
    title: "Stacks (LIFO)",
    category: "Stage 3: Linear Data Structures",
    content: [
        { type: 'h2', text: 'Last-In, First-Out (LIFO)' },
        { type: 'p', text: 'A stack is a data structure that works on the "Last-In, First-Out" principle. The last item you add to a stack is the first item you take out. A real-world analogy is a stack of plates: you add a new plate to the top, and you can only remove the topmost plate.' },
        { type: 'h2', text: 'Core Operations' },
        { type: 'li', text: '<strong>Push:</strong> Adds an element to the top of the stack.' },
        { type: 'li', text: '<strong>Pop:</strong> Removes the element from the top of the stack.' },
        { type: 'li', text: '<strong>Peek (or Top):</strong> Views the top element of the stack without removing it.'},
        { type: 'p', text: 'All three core operations are extremely efficient O(1) operations when a stack is implemented with a dynamic array or a linked list.' },
        { type: 'h2', text: 'Dynamic vs. Static Stacks' },
        { type: 'p', text: '<strong>Dynamic Stacks:</strong> Implemented with a dynamic array or linked list, these stacks can grow or shrink as needed. This is the most common type of stack. <strong>Static Stacks:</strong> Implemented with a static array, these stacks have a fixed size. Pushing to a full stack causes a "stack overflow" error.' },
        { type: 'h2', text: 'Syntax and Example' },
        { type: 'code', text: 'stack = []\n\n# Push operations\nstack.append(10)\nstack.append(20)\nstack.append(30)\n\n# Peek operation\ntop_element = stack[-1] # 30\n\n# Pop operation\nremoved_element = stack.pop() # 30' },
        { type: 'h2', text: 'The Call Stack' },
        { type: 'p', text: 'One of the most important applications of stacks in computer science is the <strong>call stack</strong>. When you call a function, it gets "pushed" onto the call stack. If that function calls another function, the new function is pushed on top. When a function returns, it gets "popped" off the stack, and control returns to the function below it. This is how your program keeps track of where it is.'},
        { type: 'h2', text: 'Real-World Use Cases' },
        { type: 'li', text: '<strong>Undo/Redo Functionality:</strong> Each action a user takes is pushed onto a stack. "Undo" pops the last action and "Redo" pushes it back on.'},
        { type: 'li', text: '<strong>Expression Evaluation:</strong> Stacks are used to convert expressions (like `5 * (2 + 3)`) from human-readable infix notation to postfix notation, which is easier for a computer to evaluate.'},
        { type: 'li', text: '<strong>Browser History:</strong> The back button in a web browser can be implemented using a stack. Each time you visit a new page, it is pushed onto the stack. When you press the back button, the current page is popped off the stack.' }
    ]
};