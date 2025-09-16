export const dsQueues = {
    title: "Queues (FIFO)",
    category: "Stage 3: Linear Data Structures",
    content: [
        { type: 'h2', text: 'First-In, First-Out (FIFO)' },
        { type: 'p', text: 'A queue is a data structure that works on the "First-In, First-Out" principle. It\'s just like a real-world queue or line: the first person to get in line is the first person to be served.' },
        { type: 'h2', text: 'Core Operations' },
        { type: 'li', text: '<strong>Enqueue:</strong> Adds an element to the back (end) of the queue.' },
        { type: 'li', text: '<strong>Dequeue:</strong> Removes an element from the front of the queue.' },
        { type: 'li', text: '<strong>Peek (or Front):</strong> Views the element at the front of the queue without removing it.'},
        { type: 'h2', text: 'Dynamic vs. Static Queues' },
        { type: 'p', text: '<strong>Dynamic Queues:</strong> Typically implemented using a doubly linked list to ensure O(1) enqueue and dequeue operations. <strong>Static Queues (Circular Queues):</strong> Implemented with a static array and two pointers (front and rear). When the array is full, the pointers wrap around to the beginning, hence the name "circular".' },
        { type: 'h2', text: 'Syntax and Example' },
        { type: 'code', text: 'from collections import deque\n\nqueue = deque()\n\n# Enqueue operations\nqueue.append(10)\nqueue.append(20)\nqueue.append(30)\n\n# Peek operation\nfront_element = queue[0] # 10\n\n# Dequeue operation\nremoved_element = queue.popleft() # 10' },
        { type: 'h2', text: 'Implementation Considerations' },
        { type: 'p', text: 'Implementing a queue with a standard dynamic array can be inefficient. While adding to the back (`enqueue`) is an O(1) operation, removing from the front (`dequeue`) is an O(n) operation because all subsequent elements must be shifted. For this reason, queues are often implemented with a doubly linked list or a specialized data structure called a <strong>deque</strong> (double-ended queue), which provides O(1) performance for both operations.'},
        { type: 'h2', text: 'Real-World Use Cases' },
        { type: 'li', text: '<strong>Task Scheduling:</strong> Managing tasks in the order they were received, such as print jobs, or handling requests to a web server.'},
        { type: 'li', text: '<strong>Breadth-First Search (BFS):</strong> A fundamental graph traversal algorithm that uses a queue to explore all the neighbors of a node before moving on to the next level.'},
        { type: 'li', text: '<strong>Buffering Data:</strong> In streaming applications, data is often read into a buffer (a queue) and then processed in the order it was received.' }
    ]
};