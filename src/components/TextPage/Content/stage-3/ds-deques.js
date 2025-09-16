export const dsDeques = {
    title: "Deques (Double-Ended Queues)",
    category: "Stage 3: Linear Data Structures",
    content: [
        { type: 'h2', text: 'The Best of Both Worlds' },
        { type: 'p', text: 'A deque (pronounced "deck") is a double-ended queue. It is a powerful and flexible data structure that combines the functionalities of both a stack (LIFO) and a queue (FIFO). You can add and remove elements from either the front or the back.' },
        { type: 'h2', text: 'Core Operations' },
        { type: 'li', text: '<strong>Add Front:</strong> Adds an element to the beginning of the deque.' },
        { type: 'li', text: '<strong>Add Back:</strong> Adds an element to the end of the deque.' },
        { type: 'li', text: '<strong>Remove Front:</strong> Removes an element from the beginning of the deque.' },
        { type: 'li', text: '<strong>Remove Back:</strong> Removes an element from the end of the deque.' },
        { type: 'p', text: 'When implemented with a doubly linked list, all these operations are O(1).' },
        { type: 'h2', text: 'Syntax and Example' },
        { type: 'code', text: 'from collections import deque\n\ndeque_obj = deque([10, 20, 30])\n\n# Add to the back (like a queue)\ndeque_obj.append(40) # [10, 20, 30, 40]\n\n# Add to the front\ndeque_obj.appendleft(5) # [5, 10, 20, 30, 40]\n\n# Remove from the back (like a stack)\ndeque_obj.pop() # 40 is removed\n\n# Remove from the front (like a queue)\ndeque_obj.popleft() # 5 is removed' },
        { type: 'h2', text: 'Real-World Use Cases' },
        { type: 'li', text: '<strong>Sliding Window Algorithms:</strong> Deques are ideal for efficiently tracking minimum or maximum values in a sliding window over a sequence of data.' },
        { type: 'li', text: '<strong>Job Schedulers:</strong> A scheduler might use a deque to add high-priority jobs to the front and normal jobs to the back.' },
        { type: 'li', text: '<strong>Storing a history of recent items:</strong> You can add new items to one end and remove old items from the other to maintain a list of a fixed size.' }
    ]
};