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
            { 
                name: 'Add to Front', 
                snippet: `# O(n) - All elements must be shifted to the right\ndef add_to_front(arr, value):\n  arr.insert(0, value)\n  return arr\n\n# --- Example ---\nmy_array = [10, 20, 30]\nprint(f"Original: {my_array}")\nadd_to_front(my_array, 5)\nprint(f"Modified: {my_array}")` 
            },
            { 
                name: 'Add to Back', 
                snippet: `# O(1) - Amortized constant time\ndef add_to_back(arr, value):\n  arr.append(value)\n  return arr\n\n# --- Example ---\nmy_array = [10, 20, 30]\nprint(f"Original: {my_array}")\nadd_to_back(my_array, 40)\nprint(f"Modified: {my_array}")` 
            },
            { 
                name: 'Add at Index', 
                snippet: `# O(n) - Elements from the index onward must be shifted\ndef add_at_index(arr, index, value):\n  if 0 <= index <= len(arr):\n    arr.insert(index, value)\n  return arr\n\n# --- Example ---\nmy_array = [10, 20, 40, 50]\nprint(f"Original: {my_array}")\nadd_at_index(my_array, 2, 30)\nprint(f"Modified: {my_array}")` 
            },
            { 
                name: 'Remove from Front', 
                snippet: `# O(n) - All elements must be shifted to the left\ndef remove_from_front(arr):\n  if len(arr) > 0:\n    arr.pop(0)\n  return arr\n\n# --- Example ---\nmy_array = [10, 20, 30]\nprint(f"Original: {my_array}")\nremove_from_front(my_array)\nprint(f"Modified: {my_array}")` 
            },
            { 
                name: 'Remove from Back', 
                snippet: `# O(1) - Constant time operation\ndef remove_from_back(arr):\n  if len(arr) > 0:\n    arr.pop()\n  return arr\n\n# --- Example ---\nmy_array = [10, 20, 30]\nprint(f"Original: {my_array}")\nremove_from_back(my_array)\nprint(f"Modified: {my_array}")` 
            },
            { 
                name: 'Remove at Index', 
                snippet: `# O(n) - Elements after the index must be shifted\ndef remove_at_index(arr, index):\n  if 0 <= index < len(arr):\n    arr.pop(index)\n  return arr\n\n# --- Example ---\nmy_array = [10, 20, 99, 30]\nprint(f"Original: {my_array}")\nremove_at_index(my_array, 2)\nprint(f"Modified: {my_array}")` 
            },
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
            {
                name: 'Add to Head',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass LinkedList:\n  def __init__(self):\n    self.head = None\n\n  def add_to_head(self, value):\n    new_node = Node(value)\n    new_node.next = self.head\n    self.head = new_node\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" -> ".join(res) + " -> None")\n\n# --- Example ---\nll = LinkedList()\nll.add_to_head(20)\nll.add_to_head(10)\nll.print_list() # Output: 10 -> 20 -> None'
            },
            {
                name: 'Add to Tail',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass LinkedList:\n  def __init__(self):\n    self.head = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.head is None:\n      self.head = new_node\n      return\n    last = self.head\n    while last.next:\n      last = last.next\n    last.next = new_node\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" -> ".join(res) + " -> None")\n\n# --- Example ---\nll = LinkedList()\nll.add_to_tail(10)\nll.add_to_tail(20)\nll.print_list() # Output: 10 -> 20 -> None'
            },
            {
                name: 'Add at Index',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass LinkedList:\n  def __init__(self):\n    self.head = None\n\n  def add_to_head(self, value):\n    new_node = Node(value)\n    new_node.next = self.head\n    self.head = new_node\n\n  def add_at_index(self, index, value):\n    if index == 0:\n      self.add_to_head(value)\n      return\n    current = self.head\n    count = 0\n    while current and count < index - 1:\n      current = current.next\n      count += 1\n    if current is None:\n      print("Index out of bounds")\n      return\n    new_node = Node(value)\n    new_node.next = current.next\n    current.next = new_node\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" -> ".join(res) + " -> None")\n\n# --- Example ---\nll = LinkedList()\nll.add_to_head(30)\nll.add_to_head(10)\nll.add_at_index(1, 20)\nll.print_list() # Output: 10 -> 20 -> 30 -> None'
            },
            {
                name: 'Remove from Head',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass LinkedList:\n  def __init__(self):\n    self.head = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.head is None:\n      self.head = new_node\n      return\n    last = self.head\n    while last.next:\n      last = last.next\n    last.next = new_node\n\n  def remove_from_head(self):\n    if self.head is not None:\n      self.head = self.head.next\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" -> ".join(res) + " -> None")\n\n# --- Example ---\nll = LinkedList()\nll.add_to_tail(10)\nll.add_to_tail(20)\nll.remove_from_head()\nll.print_list() # Output: 20 -> None'
            },
            {
                name: 'Remove from Tail',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass LinkedList:\n  def __init__(self):\n    self.head = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.head is None:\n      self.head = new_node\n      return\n    last = self.head\n    while last.next:\n      last = last.next\n    last.next = new_node\n\n  def remove_from_tail(self):\n    if self.head is None or self.head.next is None:\n      self.head = None\n      return\n    second_last = self.head\n    while second_last.next.next:\n      second_last = second_last.next\n    second_last.next = None\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" -> ".join(res) + " -> None")\n\n# --- Example ---\nll = LinkedList()\nll.add_to_tail(10)\nll.add_to_tail(20)\nll.remove_from_tail()\nll.print_list() # Output: 10 -> None'
            },
            {
                name: 'Remove at Index',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass LinkedList:\n  def __init__(self):\n    self.head = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.head is None:\n      self.head = new_node\n      return\n    last = self.head\n    while last.next:\n      last = last.next\n    last.next = new_node\n\n  def remove_at_index(self, index):\n    if self.head is None or index < 0:\n      return\n    if index == 0:\n      self.head = self.head.next\n      return\n    current = self.head\n    count = 0\n    while current and count < index - 1:\n      current = current.next\n      count += 1\n    if current is None or current.next is None:\n      print("Index out of bounds")\n      return\n    current.next = current.next.next\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" -> ".join(res) + " -> None")\n\n# --- Example ---\nll = LinkedList()\nll.add_to_tail(10)\nll.add_to_tail(99)\nll.add_to_tail(20)\nll.remove_at_index(1)\nll.print_list() # Output: 10 -> 20 -> None'
            },
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
            {
                name: 'Add to Head',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n    self.prev = None\n\nclass DoublyLinkedList:\n  def __init__(self):\n    self.head = None\n    self.tail = None\n\n  def add_to_head(self, value):\n    new_node = Node(value)\n    new_node.next = self.head\n    if self.head:\n      self.head.prev = new_node\n    self.head = new_node\n    if self.tail is None:\n      self.tail = new_node\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" <-> ".join(res))\n\n# --- Example ---\ndll = DoublyLinkedList()\ndll.add_to_head(20)\ndll.add_to_head(10)\ndll.print_list() # Output: 10 <-> 20'
            },
            {
                name: 'Add to Tail',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n    self.prev = None\n\nclass DoublyLinkedList:\n  def __init__(self):\n    self.head = None\n    self.tail = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      self.head = new_node\n      self.tail = new_node\n      return\n    self.tail.next = new_node\n    new_node.prev = self.tail\n    self.tail = new_node\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" <-> ".join(res))\n\n# --- Example ---\ndll = DoublyLinkedList()\ndll.add_to_tail(10)\ndll.add_to_tail(20)\ndll.print_list() # Output: 10 <-> 20'
            },
            {
                name: 'Add at Index',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n    self.prev = None\n\nclass DoublyLinkedList:\n  def __init__(self):\n    self.head = None\n    self.tail = None\n\n  def add_to_head(self, value):\n    new_node = Node(value)\n    new_node.next = self.head\n    if self.head:\n      self.head.prev = new_node\n    self.head = new_node\n    if self.tail is None:\n      self.tail = new_node\n\n  def add_at_index(self, index, value):\n    if index == 0:\n      self.add_to_head(value)\n      return\n    current = self.head\n    for _ in range(index - 1):\n      if current is None:\n        print("Index out of bounds")\n        return\n      current = current.next\n    if current is None:\n      print("Index out of bounds")\n      return\n    new_node = Node(value)\n    new_node.next = current.next\n    if current.next:\n      current.next.prev = new_node\n    else: # If we are inserting at the end\n      self.tail = new_node\n    current.next = new_node\n    new_node.prev = current\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" <-> ".join(res))\n\n# --- Example ---\ndll = DoublyLinkedList()\ndll.add_to_head(30)\ndll.add_to_head(10)\ndll.add_at_index(1, 20)\ndll.print_list() # Output: 10 <-> 20 <-> 30'
            },
            {
                name: 'Remove from Head',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n    self.prev = None\n\nclass DoublyLinkedList:\n  def __init__(self):\n    self.head = None\n    self.tail = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      self.head = new_node\n      self.tail = new_node\n      return\n    self.tail.next = new_node\n    new_node.prev = self.tail\n    self.tail = new_node\n\n  def remove_from_head(self):\n    if self.head is None:\n      return\n    self.head = self.head.next\n    if self.head:\n      self.head.prev = None\n    else:\n      self.tail = None\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" <-> ".join(res))\n\n# --- Example ---\ndll = DoublyLinkedList()\ndll.add_to_tail(10)\ndll.add_to_tail(20)\ndll.remove_from_head()\ndll.print_list() # Output: 20'
            },
            {
                name: 'Remove from Tail',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n    self.prev = None\n\nclass DoublyLinkedList:\n  def __init__(self):\n    self.head = None\n    self.tail = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      self.head = new_node\n      self.tail = new_node\n      return\n    self.tail.next = new_node\n    new_node.prev = self.tail\n    self.tail = new_node\n\n  def remove_from_tail(self):\n    if self.tail is None:\n      return\n    self.tail = self.tail.prev\n    if self.tail:\n      self.tail.next = None\n    else:\n      self.head = None\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" <-> ".join(res))\n\n# --- Example ---\ndll = DoublyLinkedList()\ndll.add_to_tail(10)\ndll.add_to_tail(20)\ndll.remove_from_tail()\ndll.print_list() # Output: 10'
            },
            {
                name: 'Remove at Index',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n    self.prev = None\n\nclass DoublyLinkedList:\n  def __init__(self):\n    self.head = None\n    self.tail = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      self.head = new_node\n      self.tail = new_node\n      return\n    self.tail.next = new_node\n    new_node.prev = self.tail\n    self.tail = new_node\n\n  def remove_at_index(self, index):\n    if self.head is None or index < 0:\n      return\n    current = self.head\n    count = 0\n    while current and count < index:\n      current = current.next\n      count += 1\n    if current is None:\n      print("Index out of bounds")\n      return\n    if current.prev:\n      current.prev.next = current.next\n    else: # Removing the head\n      self.head = current.next\n    if current.next:\n      current.next.prev = current.prev\n    else: # Removing the tail\n      self.tail = current.prev\n\n  def print_list(self):\n    temp = self.head\n    res = []\n    while temp:\n      res.append(str(temp.data))\n      temp = temp.next\n    print(" <-> ".join(res))\n\n# --- Example ---\ndll = DoublyLinkedList()\ndll.add_to_tail(10)\ndll.add_to_tail(99)\ndll.add_to_tail(20)\ndll.remove_at_index(1)\ndll.print_list() # Output: 10 <-> 20'
            }
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
            {
                name: 'Add to Head',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass CircularLinkedList:\n  def __init__(self):\n    self.tail = None\n\n  def add_to_head(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      new_node.next = new_node\n      self.tail = new_node\n    else:\n      new_node.next = self.tail.next\n      self.tail.next = new_node\n\n  def print_list(self):\n    if self.tail is None:\n      print("List is empty")\n      return\n    res = []\n    current = self.tail.next\n    while True:\n      res.append(str(current.data))\n      current = current.next\n      if current == self.tail.next:\n        break\n    print(" -> ".join(res) + " -> (Head)")\n\n# --- Example ---\ncll = CircularLinkedList()\ncll.add_to_head(20)\ncll.add_to_head(10)\ncll.print_list() # Output: 10 -> 20 -> (Head)'
            },
            {
                name: 'Add to Tail',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass CircularLinkedList:\n  def __init__(self):\n    self.tail = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      new_node.next = new_node\n      self.tail = new_node\n    else:\n      new_node.next = self.tail.next\n      self.tail.next = new_node\n      self.tail = new_node\n\n  def print_list(self):\n    if self.tail is None:\n      print("List is empty")\n      return\n    res = []\n    current = self.tail.next\n    while True:\n      res.append(str(current.data))\n      current = current.next\n      if current == self.tail.next:\n        break\n    print(" -> ".join(res) + " -> (Head)")\n\n# --- Example ---\ncll = CircularLinkedList()\ncll.add_to_tail(10)\ncll.add_to_tail(20)\ncll.print_list() # Output: 10 -> 20 -> (Head)'
            },
            {
                name: 'Add at Index',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass CircularLinkedList:\n  def __init__(self):\n    self.tail = None\n\n  def add_to_head(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      new_node.next = new_node\n      self.tail = new_node\n    else:\n      new_node.next = self.tail.next\n      self.tail.next = new_node\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      new_node.next = new_node\n      self.tail = new_node\n    else:\n      new_node.next = self.tail.next\n      self.tail.next = new_node\n      self.tail = new_node\n\n  def add_at_index(self, index, value):\n    if self.tail is None or index <= 0:\n      self.add_to_head(value)\n      return\n    new_node = Node(value)\n    current = self.tail.next # Head\n    count = 0\n    while count < index - 1:\n      current = current.next\n      count += 1\n      if current == self.tail.next:\n        print("Index out of bounds, adding to tail.")\n        self.add_to_tail(value)\n        return\n    new_node.next = current.next\n    current.next = new_node\n    if current == self.tail:\n      self.tail = new_node\n\n  def print_list(self):\n    if self.tail is None:\n      print("List is empty")\n      return\n    res = []\n    current = self.tail.next\n    while True:\n      res.append(str(current.data))\n      current = current.next\n      if current == self.tail.next:\n        break\n    print(" -> ".join(res) + " -> (Head)")\n\n# --- Example ---\ncll = CircularLinkedList()\ncll.add_to_tail(10)\ncll.add_to_tail(30)\ncll.add_at_index(1, 20)\ncll.print_list() # Output: 10 -> 20 -> 30 -> (Head)'
            },
            {
                name: 'Remove from Head',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass CircularLinkedList:\n  def __init__(self):\n    self.tail = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      new_node.next = new_node\n      self.tail = new_node\n    else:\n      new_node.next = self.tail.next\n      self.tail.next = new_node\n      self.tail = new_node\n\n  def remove_from_head(self):\n    if self.tail is None:\n      return\n    if self.tail.next == self.tail:\n      self.tail = None\n    else:\n      self.tail.next = self.tail.next.next\n\n  def print_list(self):\n    if self.tail is None:\n      print("List is empty")\n      return\n    res = []\n    current = self.tail.next\n    while True:\n      res.append(str(current.data))\n      current = current.next\n      if current == self.tail.next:\n        break\n    print(" -> ".join(res) + " -> (Head)")\n\n# --- Example ---\ncll = CircularLinkedList()\ncll.add_to_tail(10)\ncll.add_to_tail(20)\ncll.remove_from_head()\ncll.print_list() # Output: 20 -> (Head)'
            },
            {
                name: 'Remove from Tail',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass CircularLinkedList:\n  def __init__(self):\n    self.tail = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      new_node.next = new_node\n      self.tail = new_node\n    else:\n      new_node.next = self.tail.next\n      self.tail.next = new_node\n      self.tail = new_node\n\n  def remove_from_tail(self):\n    if self.tail is None:\n      return\n    if self.tail.next == self.tail:\n      self.tail = None\n      return\n    current = self.tail.next\n    while current.next != self.tail:\n      current = current.next\n    current.next = self.tail.next\n    self.tail = current\n\n  def print_list(self):\n    if self.tail is None:\n      print("List is empty")\n      return\n    res = []\n    current = self.tail.next\n    while True:\n      res.append(str(current.data))\n      current = current.next\n      if current == self.tail.next:\n        break\n    print(" -> ".join(res) + " -> (Head)")\n\n# --- Example ---\ncll = CircularLinkedList()\ncll.add_to_tail(10)\ncll.add_to_tail(20)\ncll.remove_from_tail()\ncll.print_list() # Output: 10 -> (Head)'
            },
            {
                name: 'Remove at Index',
                snippet: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass CircularLinkedList:\n  def __init__(self):\n    self.tail = None\n\n  def add_to_tail(self, value):\n    new_node = Node(value)\n    if self.tail is None:\n      new_node.next = new_node\n      self.tail = new_node\n    else:\n      new_node.next = self.tail.next\n      self.tail.next = new_node\n      self.tail = new_node\n\n  def remove_from_head(self):\n    if self.tail is None:\n      return\n    if self.tail.next == self.tail:\n      self.tail = None\n    else:\n      self.tail.next = self.tail.next.next\n\n  def remove_at_index(self, index):\n    if self.tail is None or index < 0:\n      return\n    if index == 0:\n      self.remove_from_head()\n      return\n    prev = self.tail.next\n    for _ in range(index - 1):\n      prev = prev.next\n      if prev == self.tail.next:\n        print("Index out of bounds")\n        return\n    if prev.next == self.tail:\n      self.tail = prev\n    prev.next = prev.next.next\n\n  def print_list(self):\n    if self.tail is None:\n      print("List is empty")\n      return\n    res = []\n    current = self.tail.next\n    while True:\n      res.append(str(current.data))\n      current = current.next\n      if current == self.tail.next:\n        break\n    print(" -> ".join(res) + " -> (Head)")\n\n# --- Example ---\ncll = CircularLinkedList()\ncll.add_to_tail(10)\ncll.add_to_tail(99)\ncll.add_to_tail(20)\ncll.remove_at_index(1)\ncll.print_list() # Output: 10 -> 20 -> (Head)'
            }
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
            {
                name: 'Push Operation',
                snippet: 'class Stack:\n  def __init__(self):\n    self.items = []\n\n  def push(self, item):\n    self.items.append(item)\n\n  def print_stack(self):\n    print("Stack Top ->", self.items[::-1])\n\n# --- Example ---\ns = Stack()\ns.push(10)\ns.push(20)\ns.print_stack() # Output: Stack Top -> [20, 10]'
            },
            {
                name: 'Pop Operation',
                snippet: 'class Stack:\n  def __init__(self):\n    self.items = []\n\n  def push(self, item):\n    self.items.append(item)\n\n  def pop(self):\n    if not self.is_empty():\n      return self.items.pop()\n    print("Stack is empty")\n    return None\n\n  def is_empty(self):\n    return len(self.items) == 0\n\n  def print_stack(self):\n    print("Stack Top ->", self.items[::-1])\n\n# --- Example ---\ns = Stack()\ns.push(10)\ns.push(20)\npopped_item = s.pop()\nprint(f"Popped: {popped_item}") # Popped: 20\ns.print_stack() # Output: Stack Top -> [10]'
            },
            {
                name: 'Peek/Top Operation',
                snippet: 'class Stack:\n  def __init__(self):\n    self.items = []\n\n  def push(self, item):\n    self.items.append(item)\n\n  def peek(self):\n    if not self.is_empty():\n      return self.items[-1]\n    return None\n\n  def is_empty(self):\n    return len(self.items) == 0\n\n# --- Example ---\ns = Stack()\ns.push(10)\ns.push(20)\ntop_item = s.peek()\nprint(f"Top item: {top_item}") # Top item: 20'
            },
            {
                name: 'Check if Empty',
                snippet: 'class Stack:\n  def __init__(self):\n    self.items = []\n\n  def is_empty(self):\n    return len(self.items) == 0\n\n# --- Example ---\ns = Stack()\nprint(f"Is stack empty? {s.is_empty()}") # Is stack empty? True\ns.items.append(10)\nprint(f"Is stack empty? {s.is_empty()}") # Is stack empty? False'
            },
            {
                name: 'Check if Full',
                snippet: 'class Stack:\n  def __init__(self, capacity):\n    self.items = []\n    self.capacity = capacity\n\n  def is_full(self):\n    return len(self.items) == self.capacity\n\n# --- Example ---\ns = Stack(capacity=2)\ns.items.append(10)\nprint(f"Is stack full? {s.is_full()}") # Is stack full? False\ns.items.append(20)\nprint(f"Is stack full? {s.is_full()}") # Is stack full? True'
            },
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
            {
                name: 'Enqueue Operation',
                snippet: 'from collections import deque\n\nclass Queue:\n  def __init__(self):\n    self.items = deque()\n\n  def enqueue(self, item):\n    self.items.append(item)\n\n  def print_queue(self):\n    print("Front -> " + " -> ".join(map(str, self.items)) + " -> Back")\n\n# --- Example ---\nq = Queue()\nq.enqueue(10)\nq.enqueue(20)\nq.print_queue() # Output: Front -> 10 -> 20 -> Back'
            },
            {
                name: 'Dequeue Operation',
                snippet: 'from collections import deque\n\nclass Queue:\n  def __init__(self):\n    self.items = deque()\n\n  def enqueue(self, item):\n    self.items.append(item)\n\n  def dequeue(self):\n    if self.items:\n      return self.items.popleft()\n    print("Queue is empty")\n    return None\n\n  def print_queue(self):\n    print("Front -> " + " -> ".join(map(str, self.items)) + " -> Back")\n\n# --- Example ---\nq = Queue()\nq.enqueue(10)\nq.enqueue(20)\ndequeued_item = q.dequeue()\nprint(f"Dequeued: {dequeued_item}") # Dequeued: 10\nq.print_queue() # Output: Front -> 20 -> Back'
            },
            {
                name: 'Peek/Front Operation',
                snippet: 'from collections import deque\n\nclass Queue:\n  def __init__(self):\n    self.items = deque()\n\n  def enqueue(self, item):\n    self.items.append(item)\n\n  def peek(self):\n    if self.items:\n      return self.items[0]\n    return None\n\n# --- Example ---\nq = Queue()\nq.enqueue(10)\nq.enqueue(20)\nfront_item = q.peek()\nprint(f"Front item: {front_item}") # Front item: 10'
            },
            {
                name: 'Check if Empty',
                snippet: 'from collections import deque\n\nclass Queue:\n  def __init__(self):\n    self.items = deque()\n\n  def is_empty(self):\n    return len(self.items) == 0\n\n# --- Example ---\nq = Queue()\nprint(f"Is queue empty? {q.is_empty()}") # Is queue empty? True\nq.items.append(10)\nprint(f"Is queue empty? {q.is_empty()}") # Is queue empty? False'
            },
            {
                name: 'Check if Full',
                snippet: 'from collections import deque\n\nclass Queue:\n  def __init__(self, capacity):\n    self.items = deque()\n    self.capacity = capacity\n\n  def is_full(self):\n    return len(self.items) == self.capacity\n\n# --- Example ---\nq = Queue(capacity=2)\nq.items.append(10)\nprint(f"Is queue full? {q.is_full()}") # Is queue full? False\nq.items.append(20)\nprint(f"Is queue full? {q.is_full()}") # Is queue full? True'
            },
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
            {
                name: 'Add to Front',
                snippet: 'from collections import deque\n\nclass Deque:\n  def __init__(self):\n    self.items = deque()\n\n  def add_front(self, item):\n    self.items.appendleft(item)\n\n  def print_deque(self):\n    print("Front -> " + " <-> ".join(map(str, self.items)) + " <- Back")\n\n# --- Example ---\nd = Deque()\nd.add_front(10)\nd.add_front(5)\nd.print_deque() # Output: Front -> 5 <-> 10 <- Back'
            },
            {
                name: 'Add to Back',
                snippet: 'from collections import deque\n\nclass Deque:\n  def __init__(self):\n    self.items = deque()\n\n  def add_back(self, item):\n    self.items.append(item)\n\n  def print_deque(self):\n    print("Front -> " + " <-> ".join(map(str, self.items)) + " <- Back")\n\n# --- Example ---\nd = Deque()\nd.add_back(10)\nd.add_back(20)\nd.print_deque() # Output: Front -> 10 <-> 20 <- Back'
            },
            {
                name: 'Remove from Front',
                snippet: 'from collections import deque\n\nclass Deque:\n  def __init__(self):\n    self.items = deque()\n\n  def add_back(self, item):\n    self.items.append(item)\n\n  def remove_front(self):\n    if self.items:\n      return self.items.popleft()\n    print("Deque is empty")\n    return None\n\n  def print_deque(self):\n    print("Front -> " + " <-> ".join(map(str, self.items)) + " <- Back")\n\n# --- Example ---\nd = Deque()\nd.add_back(10)\nd.add_back(20)\nremoved = d.remove_front()\nprint(f"Removed: {removed}") # Removed: 10\nd.print_deque() # Output: Front -> 20 <- Back'
            },
            {
                name: 'Remove from Back',
                snippet: 'from collections import deque\n\nclass Deque:\n  def __init__(self):\n    self.items = deque()\n\n  def add_back(self, item):\n    self.items.append(item)\n\n  def remove_back(self):\n    if self.items:\n      return self.items.pop()\n    print("Deque is empty")\n    return None\n\n  def print_deque(self):\n    print("Front -> " + " <-> ".join(map(str, self.items)) + " <- Back")\n\n# --- Example ---\nd = Deque()\nd.add_back(10)\nd.add_back(20)\nremoved = d.remove_back()\nprint(f"Removed: {removed}") # Removed: 20\nd.print_deque() # Output: Front -> 10 <- Back'
            },
            {
                name: 'Peek Front',
                snippet: 'from collections import deque\n\nclass Deque:\n  def __init__(self):\n    self.items = deque()\n\n  def add_back(self, item):\n    self.items.append(item)\n\n  def peek_front(self):\n    if self.items:\n      return self.items[0]\n    return None\n\n# --- Example ---\nd = Deque()\nd.add_back(10)\nd.add_back(20)\nprint(f"Front item: {d.peek_front()}") # Front item: 10'
            },
            {
                name: 'Peek Back',
                snippet: 'from collections import deque\n\nclass Deque:\n  def __init__(self):\n    self.items = deque()\n\n  def add_back(self, item):\n    self.items.append(item)\n\n  def peek_back(self):\n    if self.items:\n      return self.items[-1]\n    return None\n\n# --- Example ---\nd = Deque()\nd.add_back(10)\nd.add_back(20)\nprint(f"Back item: {d.peek_back()}") # Back item: 20'
            },
            {
                name: 'Check if Empty',
                snippet: 'from collections import deque\n\nclass Deque:\n  def __init__(self):\n    self.items = deque()\n\n  def is_empty(self):\n    return len(self.items) == 0\n\n# --- Example ---\nd = Deque()\nprint(f"Is deque empty? {d.is_empty()}") # Is deque empty? True\nd.items.append(10)\nprint(f"Is deque empty? {d.is_empty()}") # Is deque empty? False'
            },
            {
                name: 'Check if Full',
                snippet: 'from collections import deque\n\nclass Deque:\n  def __init__(self, capacity):\n    self.items = deque()\n    self.capacity = capacity\n\n  def is_full(self):\n    return len(self.items) == self.capacity\n\n# --- Example ---\nd = Deque(capacity=2)\nd.items.append(10)\nprint(f"Is deque full? {d.is_full()}") # Is deque full? False\nd.items.append(20)\nprint(f"Is deque full? {d.is_full()}") # Is deque full? True'
            }
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
            {
                name: 'Insert Operation',
                snippet: 'class Node:\n  def __init__(self, value):\n    self.value = value\n    self.left = None\n    self.right = None\n\nclass BST:\n  def __init__(self):\n    self.root = None\n\n  def insert(self, value):\n    if self.root is None:\n      self.root = Node(value)\n      return\n    current = self.root\n    while True:\n      if value < current.value:\n        if current.left is None:\n          current.left = Node(value)\n          break\n        current = current.left\n      elif value > current.value:\n        if current.right is None:\n          current.right = Node(value)\n          break\n        current = current.right\n      else:\n        break # Value already exists\n\n# --- Example ---\ntree = BST()\ntree.insert(10)\ntree.insert(5)\ntree.insert(15)\n# To see the result, you would need a traversal method.'
            },
            {
                name: 'Find Operation',
                snippet: 'class Node:\n  def __init__(self, value):\n    self.value = value\n    self.left = None\n    self.right = None\n\nclass BST:\n  def __init__(self):\n    self.root = None\n\n  def insert(self, value):\n    if self.root is None: self.root = Node(value); return\n    current = self.root\n    while True:\n      if value < current.value:\n        if current.left is None: current.left = Node(value); break\n        current = current.left\n      elif value > current.value:\n        if current.right is None: current.right = Node(value); break\n        current = current.right\n      else: break\n\n  def find(self, value):\n    current = self.root\n    while current is not None:\n      if value == current.value:\n        return True\n      elif value < current.value:\n        current = current.left\n      else:\n        current = current.right\n    return False\n\n# --- Example ---\ntree = BST()\ntree.insert(10)\ntree.insert(5)\nprint(f"Found 15? {tree.find(15)}") # Found 15? False\ntree.insert(15)\nprint(f"Found 15? {tree.find(15)}") # Found 15? True'
            },
            {
                name: 'Delete Operation',
                snippet: 'class Node:\n  def __init__(self, value):\n    self.value = value\n    self.left = None\n    self.right = None\n\nclass BST:\n  def __init__(self):\n    self.root = None\n\n  def insert(self, value):\n    if self.root is None: self.root = Node(value); return\n    current = self.root\n    while True:\n      if value < current.value:\n        if current.left is None: current.left = Node(value); break\n        current = current.left\n      elif value > current.value:\n        if current.right is None: current.right = Node(value); break\n        current = current.right\n      else: break\n\n  def delete(self, value):\n    self.root = self._delete_recursive(self.root, value)\n\n  def _delete_recursive(self, current, value):\n    if current is None: return current\n    if value < current.value:\n      current.left = self._delete_recursive(current.left, value)\n    elif value > current.value:\n      current.right = self._delete_recursive(current.right, value)\n    else: # Node to be deleted is found\n      if current.left is None: return current.right\n      if current.right is None: return current.left\n      # Node with two children: Get inorder successor\n      temp = self._get_min_value_node(current.right)\n      current.value = temp.value\n      current.right = self._delete_recursive(current.right, temp.value)\n    return current\n\n  def _get_min_value_node(self, node):\n    current = node\n    while current.left is not None:\n      current = current.left\n    return current\n\n# --- Example ---\ntree = BST()\ntree.insert(10)\ntree.insert(5)\ntree.insert(15)\ntree.delete(5) # Deletes a leaf node'
            },
            {
                name: 'In-order Traversal',
                snippet: 'class Node:\n  def __init__(self, value):\n    self.value = value\n    self.left = None\n    self.right = None\n\nclass BST:\n  def __init__(self):\n    self.root = None\n\n  def insert(self, value):\n    if self.root is None: self.root = Node(value); return\n    current = self.root\n    while True:\n      if value < current.value:\n        if current.left is None: current.left = Node(value); break\n        current = current.left\n      elif value > current.value:\n        if current.right is None: current.right = Node(value); break\n        current = current.right\n      else: break\n\n  def inorder_traversal(self):\n    result = []\n    self._inorder_recursive(self.root, result)\n    return result\n\n  def _inorder_recursive(self, node, result):\n    if node:\n      self._inorder_recursive(node.left, result)\n      result.append(node.value)\n      self._inorder_recursive(node.right, result)\n\n# --- Example ---\ntree = BST()\ntree.insert(10)\ntree.insert(5)\ntree.insert(15)\nprint(tree.inorder_traversal()) # Output: [5, 10, 15]'
            },
            {
                name: 'Pre-order Traversal',
                snippet: 'class Node:\n  def __init__(self, value):\n    self.value = value\n    self.left = None\n    self.right = None\n\nclass BST:\n  def __init__(self):\n    self.root = None\n\n  def insert(self, value):\n    if self.root is None: self.root = Node(value); return\n    current = self.root\n    while True:\n      if value < current.value:\n        if current.left is None: current.left = Node(value); break\n        current = current.left\n      elif value > current.value:\n        if current.right is None: current.right = Node(value); break\n        current = current.right\n      else: break\n\n  def preorder_traversal(self):\n    result = []\n    self._preorder_recursive(self.root, result)\n    return result\n\n  def _preorder_recursive(self, node, result):\n    if node:\n      result.append(node.value)\n      self._preorder_recursive(node.left, result)\n      self._preorder_recursive(node.right, result)\n\n# --- Example ---\ntree = BST()\ntree.insert(10)\ntree.insert(5)\ntree.insert(15)\nprint(tree.preorder_traversal()) # Output: [10, 5, 15]'
            },
            {
                name: 'Post-order Traversal',
                snippet: 'class Node:\n  def __init__(self, value):\n    self.value = value\n    self.left = None\n    self.right = None\n\nclass BST:\n  def __init__(self):\n    self.root = None\n\n  def insert(self, value):\n    if self.root is None: self.root = Node(value); return\n    current = self.root\n    while True:\n      if value < current.value:\n        if current.left is None: current.left = Node(value); break\n        current = current.left\n      elif value > current.value:\n        if current.right is None: current.right = Node(value); break\n        current = current.right\n      else: break\n\n  def postorder_traversal(self):\n    result = []\n    self._postorder_recursive(self.root, result)\n    return result\n\n  def _postorder_recursive(self, node, result):\n    if node:\n      self._postorder_recursive(node.left, result)\n      self._postorder_recursive(node.right, result)\n      result.append(node.value)\n\n# --- Example ---\ntree = BST()\ntree.insert(10)\ntree.insert(5)\ntree.insert(15)\nprint(tree.postorder_traversal()) # Output: [5, 15, 10]'
            }
        ],
        bigO: {
            'Access': { best: 'O(log n)', worst: 'O(n)' },
            'Search': { best: 'O(log n)', worst: 'O(n)' },
            'Insertion': { best: 'O(log n)', worst: 'O(n)' },
            'Deletion': { best: 'O(log n)', worst: 'O(n)' },
        }
    },
};