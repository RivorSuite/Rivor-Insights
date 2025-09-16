export const dsCircularLinkedList = {
    title: "Circular Linked Lists",
    category: "Stage 3: Linear Data Structures",
    content: [
        { type: 'h2', text: 'A List Without an End' },
        { type: 'p', text: 'A circular linked list is a variation of a linked list where the last node points back to the first node, forming a circle. There is no `null` at the end. This structure allows for continuous looping and has some unique advantages.' },
        { type: 'h2', text: 'The Tail Pointer Optimization' },
        { type: 'p', text: 'Instead of storing a pointer to the `head` of the list, a common and efficient implementation of a circular linked list stores a single pointer to the `tail`. Why? Because from the tail, the head is always just one step away (`tail.next`). This clever trick allows for O(1) insertion at both the head and the tail.' },
        { type: 'h2', text: 'Core Operations' },
        { type: 'li', text: '<strong>Add to Head:</strong> Adds a new node after the tail, making it the new head. (O(1) with tail pointer)' },
        { type: 'li', text: '<strong>Add to Tail:</strong> Adds a new node after the current tail and updates the tail pointer. (O(1) with tail pointer)' },
        { type: 'li', text: '<strong>Traversal:</strong> You can traverse the list indefinitely. Care must be taken to have a proper stopping condition to avoid an infinite loop.' },
        { type: 'h2', text: 'Syntax and Example (Conceptual)' },
        { type: 'code', text: '# Conceptual: Adding to the head with a tail pointer\ndef add_to_head(self, value):\n  new_node = Node(value)\n  if self.tail is None: # List is empty\n    new_node.next = new_node\n    self.tail = new_node\n  else:\n    new_node.next = self.tail.next # New node points to old head\n    self.tail.next = new_node # Old tail points to new node' },
        { type: 'h2', text: 'Real-World Use Cases' },
        { type: 'li', text: '<strong>Round-Robin Schedulers:</strong> Operating systems can use a circular list to cycle through processes, giving each one a turn to execute.' },
        { type: 'li', text: '<strong>Streaming Media:</strong> A media player might use a circular list as a buffer for streaming data, continuously playing from one part of the buffer while downloading new data into another.' },
        { type: 'li', text: '<strong>Multiplayer Games:</strong> Used to manage turns for players in a game, looping back to the first player after the last one has taken their turn.' }
    ]
};