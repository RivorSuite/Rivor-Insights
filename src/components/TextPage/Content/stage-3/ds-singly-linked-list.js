export const dsSinglyLinkedList = {
    title: "Singly Linked Lists",
    category: "Stage 3: Linear Data Structures",
    content: [
        { type: 'h2', text: 'A Chain of Nodes' },
        { type: 'p', text: 'A linked list is a linear collection of data elements called "nodes" where the order is not given by their physical placement in memory. Instead, each node points to the next node in the sequence. In a singly linked list, each node only stores a reference to the very next node.' },
        { type: 'h2', text: 'Anatomy of a Node' },
        { type: 'p', text: 'The fundamental unit of a linked list is the node. Each node contains two key pieces of information:'},
        { type: 'li', text: '<strong>Data:</strong> The actual value that the node holds (e.g., a number, a string, or a more complex object).' },
        { type: 'li', text: '<strong>Next Pointer:</strong> A reference to the next node in the chain. For the last node in the list, this pointer is typically `null` or `None` to signify the end.' },
        { type: 'h2', text: 'Core Operations' },
        { type: 'li', text: '<strong>Add to Head:</strong> Adds a new node to the beginning of the list. (O(1))' },
        { type: 'li', text: '<strong>Add to Tail:</strong> Adds a new node to the end of the list. Requires traversal. (O(n))' },
        { type: 'li', text: '<strong>Remove from Head:</strong> Removes the first node. (O(1))' },
        { type: 'li', text: '<strong>Search:</strong> Finds a node with a specific value. Requires traversal. (O(n))' },
        { type: 'h2', text: 'Syntax and Example (Conceptual)' },
        { type: 'code', text: 'class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None\n\nclass LinkedList:\n  def __init__(self):\n    self.head = None\n\n  # Method to add a node to the head\n  def add_to_head(self, new_data):\n    new_node = Node(new_data)\n    new_node.next = self.head\n    self.head = new_node' },
        { type: 'h2', text: 'Strengths and Weaknesses' },
        { type: 'li', text: '<strong>Strength:</strong> Fast insertions and deletions at the beginning of the list (the "head"). Since you only need to update a couple of pointers, this is an O(1) operation.' },
        { type: 'li', text: '<strong>Weakness:</strong> Slow access and search. To find an element at a specific position, you must start from the head and traverse the entire list until you reach it. This is an O(n) operation.' },
        { type: 'h2', text: 'Real-World Use Cases' },
        { type: 'li', text: '<strong>Implementing Stacks and Queues:</strong> Linked lists are a natural fit for these structures due to their efficient head/tail operations.' },
        { type: 'li', text: '<strong>Music Playlist:</strong> Each song is a node, and the `next` pointer links to the next song in the playlist.' },
        { type: 'li', text: '<strong>Task Schedulers:</strong> Operating systems can use linked lists to manage a list of processes waiting to be executed.' }
    ]
};