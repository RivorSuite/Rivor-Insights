export const dsTreesIntro = {
    title: "Trees",
    category: "Stage 4: Non-Linear Data Structures",
    content: [
        { type: 'h2', text: 'Hierarchical Data Structures' },
        { type: 'p', text: 'Unlike linear structures like arrays and linked lists, a tree is a hierarchical data structure that consists of nodes connected by edges. It is used to represent relationships where there is a parent-child dynamic, such as a file system, an organization chart, or the DOM (Document Object Model) of a web page.' },
        { type: 'h2', text: 'Core Terminology' },
        { type: 'li', text: '<strong>Root:</strong> The topmost node in a tree, from which all other nodes descend. It is the only node with no parent.' },
        { type: 'li', text: '<strong>Node:</strong> A fundamental part of a tree that can have a value and pointers to its children.' },
        { type: 'li', text: '<strong>Edge:</strong> The link between a parent node and a child node.' },
        { type: 'li', text: '<strong>Parent/Child:</strong> A node that has an edge to another node is the parent; the node at the other end of the edge is the child.' },
        { type: 'li', text: '<strong>Leaf:</strong> A node with no children.' },
        { type: 'li', text: '<strong>Height/Depth:</strong> The height of a tree is the length of the longest path from the root to a leaf. The depth of a node is the length of the path from the root to that node.' },
        { type: 'h2', text: 'Types of Trees' },
        { type: 'p', text: 'While the general concept is the same, trees come in many specialized forms:' },
        { type: 'li', text: '<strong>Binary Tree:</strong> A tree in which each node has at most two children (a left and a right child).' },
        { type: 'li', text: '<strong>Binary Search Tree (BST):</strong> A special type of binary tree where the left child of a node is always less than the parent, and the right child is always greater. This property allows for very efficient searching (O(log n)).' },
        { type: 'li', text: '<strong>AVL Tree / Red-Black Tree:</strong> Self-balancing binary search trees that maintain a balanced height to guarantee O(log n) performance for insertions, deletions, and searches.' },
    ]
};