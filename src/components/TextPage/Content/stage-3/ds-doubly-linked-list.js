export const dsDoublyLinkedList = {
    title: "Doubly Linked Lists",
    category: "Stage 3: Linear Data Structures",
    content: [
        { type: 'h2', text: 'Two-Way Traversal' },
        { type: 'p', text: 'A doubly linked list is an enhancement of a singly linked list. Each node contains three fields: the data, a pointer to the <strong>next</strong> node, and a pointer to the <strong>previous</strong> node. This allows for traversal in both forward and backward directions.' },
        { type: 'h2', text: 'Key Advantages' },
        { type: 'li', text: '<strong>Efficient Tail Operations:</strong> With a pointer to the tail, adding or removing from the end of the list becomes an O(1) operation, a major improvement over singly linked lists.' },
        { type: 'li', text: '<strong>Backwards Traversal:</strong> You can easily navigate the list in reverse, which is useful for certain algorithms and applications.' },
        { type: 'h2', text: 'Syntax and Example (Conceptual)' },
        { type: 'code', text: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n    self.prev = None\n\n# ... (methods would update both next and prev pointers) ...\n\ndef delete_node(self, node_to_delete):\n  if node_to_delete.prev:\n    node_to_delete.prev.next = node_to_delete.next\n  if node_to_delete.next:\n    node_to_delete.next.prev = node_to_delete.prev' },
        { type: 'h2', text: 'The Cost of Convenience' },
        { type: 'p', text: 'The primary trade-off for this added flexibility is increased memory usage. Each node in a doubly linked list must store an extra pointer (the `prev` reference), which can be significant for lists with a very large number of small nodes. Additionally, the logic for insertion and deletion is slightly more complex, as you must correctly update both the `next` and `prev` pointers for the surrounding nodes.'},
        { type: 'h2', text: 'Real-World Use Cases' },
        { type: 'li', text: '<strong>Browser History:</strong> The "back" and "forward" buttons in a web browser are a perfect analogy for a doubly linked list.' },
        { type: 'li', text: '<strong>Undo/Redo Functionality:</strong> Text editors and other applications use a doubly linked list to store a sequence of operations, allowing the user to move forward and backward through them.' },
        { type: 'li', text: '<strong>Implementing a Deque:</strong> A double-ended queue (deque) can be efficiently implemented using a doubly linked list because it requires O(1) additions and removals from both ends.' }
    ]
};