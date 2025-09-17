export const dsInfo = {
    arrays: {
        about: {
            title: "About Arrays",
            description: "An array is a fundamental data structure consisting of a collection of elements, each identified by an index. In most languages, arrays are stored in a single, contiguous block of memory. This structure is what gives arrays their signature performance characteristic: lightning-fast access to any element by its index.",
            details: [
                { title: "Static vs. Dynamic", complexity: "Implementation Detail", note: "Static arrays have a fixed size determined at compile time, while dynamic arrays (like Python lists) can resize themselves automatically." },
                { title: "Strengths", complexity: "O(1) Access", note: "Excellent for situations where you need to quickly read or update elements at a known position." },
                { title: "Weaknesses", complexity: "O(n) Insert/Delete", note: "Slow for operations that require shifting elements, such as adding to the front or removing from the middle." },
                { title: "Use Cases", complexity: "Real-World Apps", note: "Used everywhere, from storing a list of items in a shopping cart to representing pixels on a screen or rows in a spreadsheet." },
            ]
        },
        code: [
            { name: 'Add to Front', snippet: `def add_to_front(arr, value):\n  # This is an O(n) operation as all elements must shift right\n  arr.insert(0, value)\n  return arr` },
            { name: 'Add to Back', snippet: `def add_to_back(arr, value):\n  # In Python, this is an efficient O(1) operation\n  arr.append(value)\n  return arr` },
            { name: 'Add at Index', snippet: `def add_at_index(arr, index, value):\n  # Elements from the index onward must be shifted\n  arr.insert(index, value)\n  return arr` },
            { name: 'Remove from Front', snippet: `def remove_from_front(arr):\n  # An O(n) operation as all elements must shift left\n  if len(arr) > 0:\n    arr.pop(0)\n  return arr` },
            { name: 'Remove from Back', snippet: `def remove_from_back(arr):\n  # An efficient O(1) operation\n  if len(arr) > 0:\n    arr.pop()\n  return arr` },
            { name: 'Remove at Index', snippet: `def remove_at_index(arr, index):\n  # Elements after the index must be shifted\n  if len(arr) > index:\n    arr.pop(index)\n  return arr` },
        ],
        bigO: {
            'Access': { best: 'O(1)', worst: 'O(1)' },
            'Search': { best: 'O(1)', worst: 'O(n)' },
            'Insertion': { best: 'O(1)', worst: 'O(n)' },
            'Deletion': { best: 'O(1)', worst: 'O(n)' },
        }
    },

    singlyLinkedLists: {
        about: {
            title: "About Singly Linked Lists",
            description: "A linked list is a linear data structure where elements are not stored at contiguous memory locations. The elements are linked using pointers. Each element, called a 'node', consists of two parts: the data and a reference (or pointer) to the next node in the sequence.",
            details: [
                { title: "Node-Based", complexity: "Core Concept", note: "The structure is composed of individual node objects, each holding data and a 'next' pointer." },
                { title: "Strengths", complexity: "O(1) Insert/Delete at Head", note: "Adding or removing from the front is very efficient as it only requires a pointer update." },
                { title: "Weaknesses", complexity: "O(n) Access/Search", note: "To find an element, you must traverse the list from the head, which can be slow." },
                { title: "Use Cases", complexity: "Real-World Apps", note: "Ideal for managing dynamic lists where frequent insertions/deletions occur, like a music playlist or a task queue." },
            ]
        },
        code: [
            { name: 'Add to Head', snippet: `def add_to_head(self, value):\n  new_node = Node(value)\n  new_node.next = self.head\n  self.head = new_node` },
            { name: 'Add to Tail', snippet: `def add_to_tail(self, value):\n  new_node = Node(value)\n  if self.head is None:\n    self.head = new_node\n    return\n  last = self.head\n  while last.next:\n    last = last.next\n  last.next = new_node` },
            { name: 'Add at Index', snippet: `def add_at_index(self, index, value):\n  if index == 0:\n    self.add_to_head(value)\n    return\n  current = self.head\n  count = 0\n  while current and count < index - 1:\n    current = current.next\n    count += 1\n  if current is None:\n    return # Index out of bounds\n  new_node = Node(value)\n  new_node.next = current.next\n  current.next = new_node` },
            { name: 'Remove from Head', snippet: `def remove_from_head(self):\n  if self.head is None:\n    return\n  self.head = self.head.next` },
            { name: 'Remove from Tail', snippet: `def remove_from_tail(self):\n  if self.head is None or self.head.next is None:\n    self.head = None\n    return\n  second_last = self.head\n  while second_last.next.next:\n    second_last = second_last.next\n  second_last.next = None` },
            { name: 'Remove at Index', snippet: `def remove_at_index(self, index):\n  if self.head is None or index < 0:\n    return\n  if index == 0:\n    self.head = self.head.next\n    return\n  current = self.head\n  count = 0\n  while current and count < index - 1:\n    current = current.next\n    count += 1\n  if current is None or current.next is None:\n    return # Index out of bounds\n  current.next = current.next.next` },
        ],
        bigO: {
            'Access': { best: 'O(1)', worst: 'O(n)' },
            'Search': { best: 'O(1)', worst: 'O(n)' },
            'Insertion': { best: 'O(1)', worst: 'O(1)' },
            'Deletion': { best: 'O(1)', worst: 'O(n)' },
        }
    },

    doublyLinkedLists: {
        about: {
            title: "About Doubly Linked Lists",
            description: "A Doubly Linked List is an advanced version of a Singly Linked List. Each node contains a data part and two pointers: one pointing to the next node ('next') and another pointing to the previous node ('prev'). This bidirectional linkage allows for more flexible traversal.",
            details: [
                { title: "Bidirectional", complexity: "Core Concept", note: "The key feature is the 'prev' pointer, allowing traversal in both forward and backward directions." },
                { title: "Strengths", complexity: "O(1) Tail Operations", note: "Unlike SLL, adding or removing from the tail is O(1) if you maintain a tail pointer." },
                { title: "Weaknesses", complexity: "More Memory", note: "Each node requires extra memory to store the 'prev' pointer, making it slightly less space-efficient." },
                { title: "Use Cases", complexity: "Real-World Apps", note: "Perfect for implementing undo/redo functionality in editors, browser history (back/forward), or certain types of caches." },
            ]
        },
        code: [
            { name: 'Add to Head', snippet: `def add_to_head(self, value):\n  new_node = Node(value)\n  new_node.next = self.head\n  if self.head:\n    self.head.prev = new_node\n  self.head = new_node\n  if self.tail is None:\n    self.tail = new_node` },
            { name: 'Add to Tail', snippet: `def add_to_tail(self, value):\n  new_node = Node(value)\n  if self.tail is None:\n    self.head = new_node\n    self.tail = new_node\n    return\n  self.tail.next = new_node\n  new_node.prev = self.tail\n  self.tail = new_node` },
            { name: 'Remove from Head', snippet: `def remove_from_head(self):\n  if self.head is None:\n    return\n  self.head = self.head.next\n  if self.head:\n    self.head.prev = None\n  else:\n    self.tail = None` },
            { name: 'Remove from Tail', snippet: `def remove_from_tail(self):\n  if self.tail is None:\n    return\n  self.tail = self.tail.prev\n  if self.tail:\n    self.tail.next = None\n  else:\n    self.head = None` },
        ],
        bigO: {
            'Access': { best: 'O(1)', worst: 'O(n)' },
            'Search': { best: 'O(1)', worst: 'O(n)' },
            'Insertion': { best: 'O(1)', worst: 'O(1)' },
            'Deletion': { best: 'O(1)', worst: 'O(1)' },
        }
    },

    circularLinkedLists: {
        about: {
            title: "About Circular Linked Lists",
            description: "A Circular Linked List is a variation of a linked list where the last node points back to the first node, forming a circle. The standard efficient implementation keeps a single pointer to the 'tail' of the list. From the tail, the head is always accessible in one step (tail.next), allowing for O(1) insertion at both the head and the tail.",
            details: [
                { title: "Tail Pointer", complexity: "Core Optimization", note: "Only the 'tail' (or 'last') node is stored. The head is always found at 'tail.next'." },
                { title: "O(1) Insertion", complexity: "Key Feature", note: "Adding to the head or tail involves rearranging a few pointers and takes constant time." },
                { title: "Endless Traversal", complexity: "Key Trait", note: "You can traverse the list indefinitely, which requires careful loop conditions to avoid infinite loops." },
                { title: "Use Cases", complexity: "Real-World Apps", note: "Ideal for round-robin schedulers, managing streaming data buffers, and applications where items must be cycled through." },
            ]
        },
        code: [
            { name: 'Add to Tail', snippet: `def add_to_tail(self, value):\n  new_node = Node(value)\n  if self.tail is None:\n    new_node.next = new_node\n    self.tail = new_node\n  else:\n    new_node.next = self.tail.next # New node points to head\n    self.tail.next = new_node      # Old tail points to new node\n    self.tail = new_node           # Update tail pointer` },
            { name: 'Add to Head', snippet: `def add_to_head(self, value):\n  new_node = Node(value)\n  if self.tail is None:\n    new_node.next = new_node\n    self.tail = new_node\n  else:\n    new_node.next = self.tail.next\n    self.tail.next = new_node` },
            { name: 'Add at Index', snippet: `def add_at_index(self, index, value):\n  if index == 0:\n    self.add_to_head(value)\n    return\n  current = self.tail.next # Start at head\n  for _ in range(index - 1):\n    current = current.next\n  new_node = Node(value)\n  new_node.next = current.next\n  current.next = new_node\n  if current == self.tail:\n    self.tail = new_node` },
            { name: 'Remove from Head', snippet: `def remove_from_head(self):\n  if self.tail is None:\n    return\n  if self.tail.next == self.tail: # Only one node\n    self.tail = None\n  else:\n    self.tail.next = self.tail.next.next` },
            { name: 'Remove from Tail', snippet: `def remove_from_tail(self):\n  if self.tail is None:\n    return\n  if self.tail.next == self.tail: # Only one node\n    self.tail = None\n    return\n  # Traverse to find the new tail\n  current = self.tail.next # Start at head\n  while current.next != self.tail:\n    current = current.next\n  # current is now the new tail\n  current.next = self.tail.next # New tail points to head\n  self.tail = current` },
            { name: 'Remove from Index', snippet: `def remove_at_index(self, index):\n  if self.tail is None or index < 0:\n    return\n  if index == 0:\n    self.remove_from_head()\n    return\n  prev = self.tail.next # Start at head\n  for _ in range(index - 1):\n    prev = prev.next\n  if prev.next == self.tail:\n    self.tail = prev\n  prev.next = prev.next.next` },
        ],
        bigO: {
            'Access': { best: 'O(1)', worst: 'O(n)' },
            'Search': { best: 'O(1)', worst: 'O(n)' },
            'Insertion': { best: 'O(1)', worst: 'O(n)' },
            'Deletion': { best: 'O(1)', worst: 'O(n)' },
        }
    },

    stacks: {
        about: {
            title: "About Stacks",
            description: "A Stack is a linear data structure that follows a particular order in which the operations are performed. The order is Last-In, First-Out (LIFO). An excellent real-life analogy is a stack of plates; you can only add a new plate to the top or remove the topmost plate.",
            details: [
                { title: "LIFO Principle", complexity: "Core Concept", note: "The last element added to the stack will be the first one to be removed." },
                { title: "Key Operations", complexity: "Push & Pop", note: "Push adds an item to the top. Pop removes the item from the top. Both are O(1) operations." },
                { title: "Overflow/Underflow", complexity: "Edge Cases", note: "Overflow occurs when pushing to a full fixed-size stack. Underflow occurs when popping from an empty stack." },
                { title: "Use Cases", complexity: "Real-World Apps", note: "Used for managing function calls (the call stack), undo/redo functionality, and parsing expressions." },
            ]
        },
        code: [
            { name: 'Push Operation', snippet: `def push(self, item):\n  # Adds an item to the top of the stack\n  self.items.append(item)` },
            { name: 'Pop Operation', snippet: `def pop(self):\n  # Removes and returns the top item\n  if not self.is_empty():\n    return self.items.pop()\n  return None # Or raise an error` },
            { name: 'Peek/Top Operation', snippet: `def peek(self):\n  # Returns the top item without removing it\n  if not self.is_empty():\n    return self.items[-1]\n  return None` },
            { name: 'Check if Empty', snippet: `def is_empty(self):\n  return len(self.items) == 0` },
        ],
        bigO: {
            'Access (Peek)': { best: 'O(1)', worst: 'O(1)' },
            'Search': { best: 'O(n)', worst: 'O(n)' },
            'Insertion (Push)': { best: 'O(1)', worst: 'O(1)' },
            'Deletion (Pop)': { best: 'O(1)', worst: 'O(1)' },
        }
    },

    queues: {
        about: {
            title: "About Queues",
            description: "A Queue is a linear data structure that follows the First-In, First-Out (FIFO) principle. This is just like a real-world queue or line: the first person to get in line is the first person to be served. New elements are added to the back (enqueue) and removed from the front (dequeue).",
            details: [
                { title: "FIFO Principle", complexity: "Core Concept", note: "The first element added to the queue will be the first one to be removed." },
                { title: "Key Operations", complexity: "Enqueue & Dequeue", note: "Enqueue adds an item to the back. Dequeue removes the item from the front. Both are O(1) in an optimized queue." },
                { title: "Implementation", complexity: "Array vs. Linked List", note: "Using a standard array for a queue is inefficient for dequeuing (O(n)). Linked lists or specialized circular arrays are preferred." },
                { title: "Use Cases", complexity: "Real-World Apps", note: "Used for task scheduling (like a print queue), handling requests on a web server, and in Breadth-First Search (BFS) algorithms for graphs." },
            ]
        },
        code: [
            { name: 'Enqueue Operation', snippet: `def enqueue(self, item):\n  # Adds an item to the back of the queue\n  self.items.append(item)` },
            { name: 'Dequeue Operation', snippet: `def dequeue(self):\n  # Removes and returns the front item\n  if not self.is_empty():\n    return self.items.pop(0) # Inefficient O(n)\n  return None` },
            { name: 'Peek/Front Operation', snippet: `def peek(self):\n  # Returns the front item without removing it\n  if not self.is_empty():\n    return self.items[0]\n  return None` },
            { name: 'Check if Empty', snippet: `def is_empty(self):\n  return len(self.items) == 0` },
        ],
        bigO: {
            'Access (Peek)': { best: 'O(1)', worst: 'O(1)' },
            'Search': { best: 'O(n)', worst: 'O(n)' },
            'Insertion (Enqueue)': { best: 'O(1)', worst: 'O(1)' },
            'Deletion (Dequeue)': { best: 'O(n)', worst: 'O(n)' }, // Note: O(1) with a linked list or deque
        }
    },

    deques: {
        about: {
            title: "About Deques",
            description: "A Deque (Double-Ended Queue) is a versatile data structure that allows adding and removing elements from both the front and the back. It combines the functionalities of both a stack (LIFO) and a queue (FIFO), making it a more general and powerful linear structure.",
            details: [
                { title: "Hybrid Structure", complexity: "Core Concept", note: "Acts like a queue when you use add-back/remove-front. Acts like a stack when you use add-back/remove-back." },
                { title: "Implementation", complexity: "Doubly Linked List", note: "To achieve fast O(1) performance for all operations, deques are typically implemented with a doubly linked list." },
                { title: "Flexibility", complexity: "Key Feature", note: "Its ability to operate on both ends makes it suitable for a wide range of problems." },
                { title: "Use Cases", complexity: "Real-World Apps", note: "Perfect for managing undo/redo histories, task schedulers that handle priority items, and implementing sliding window algorithms." },
            ]
        },
        code: [
            { name: 'Add to Front', snippet: `def add_front(self, item):\n  # Using Python's collections.deque for O(1) speed\n  self.items.appendleft(item)` },
            { name: 'Add to Back', snippet: `def add_back(self, item):\n  self.items.append(item)` },
            { name: 'Remove from Front', snippet: `def remove_front(self):\n  if self.items:\n    return self.items.popleft()` },
            { name: 'Remove from Back', snippet: `def remove_back(self):\n  if self.items:\n    return self.items.pop()` },
        ],
        bigO: {
            'Access': { best: 'O(1)', worst: 'O(n)' },
            'Search': { best: 'O(n)', worst: 'O(n)' },
            'Insertion': { best: 'O(1)', worst: 'O(1)' },
            'Deletion': { best: 'O(1)', worst: 'O(1)' },
        }
    },

    bst: {
        about: {
            title: "About Binary Search Trees",
            description: "A Binary Search Tree (BST) is a node-based binary tree data structure which has the following properties: the left subtree of a node contains only nodes with values lesser than the node’s value, the right subtree of a node contains only nodes with values greater than the node's value, and the left and right subtree each must also be a binary search tree.",
            details: [
                { title: "Search Property", complexity: "Core Concept", note: "Values in the left subtree are smaller; values in the right subtree are larger. This allows for fast searching." },
                { title: "Efficiency", complexity: "O(log n)", note: "In a balanced tree, operations like search, insert, and delete are very efficient, as they eliminate half the remaining nodes at each step." },
                { title: "Unbalanced Trees", complexity: "Worst Case: O(n)", note: "If data is inserted in sorted order, the tree degenerates into a linked list, making operations slow." },
                { title: "Use Cases", complexity: "Real-World Apps", note: "Used for implementing dictionaries and lookup tables, database indexing, and symbol tables in compilers." },
            ]
        },
        code: [
            { name: 'Insert Operation', snippet: `def insert(self, value):\n  if self.root is None:\n    self.root = Node(value)\n    return\n  current = self.root\n  while True:\n    if value < current.value:\n      if current.left is None:\n        current.left = Node(value)\n        break\n      current = current.left\n    else:\n      if current.right is None:\n        current.right = Node(value)\n        break\n      current = current.right` },
            { name: 'Find Operation', snippet: `def find(self, value):\n  current = self.root\n  while current is not None:\n    if value == current.value:\n      return True # Found\n    elif value < current.value:\n      current = current.left\n    else:\n      current = current.right\n  return False # Not found` },
        ],
        bigO: {
            'Access': { best: 'O(log n)', worst: 'O(n)' },
            'Search': { best: 'O(log n)', worst: 'O(n)' },
            'Insertion': { best: 'O(log n)', worst: 'O(n)' },
            'Deletion': { best: 'O(log n)', worst: 'O(n)' },
        }
    },
};