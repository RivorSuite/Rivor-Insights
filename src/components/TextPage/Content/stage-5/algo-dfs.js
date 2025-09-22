export const algoDFS = {
    title: "Depth-First Search (DFS)",
    category: "Stage 5: Searching & Sorting Algorithms",
    content: [
        { type: 'h2', text: 'Exploring Deeply' },
        { type: 'p', text: 'Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (either explicitly in an iterative version or implicitly through recursion) to keep track of the nodes to visit.' },
        { type: 'h2', text: 'Core Logic' },
        { type: 'li', text: '<strong>Start with a Stack:</strong> Begin with a stack and add the starting vertex to it.' },
        { type: 'li', text: '<strong>Pop and Visit:</strong> Pop a vertex from the top of the stack. If it has not been visited, process it and mark it as visited.' },
        { type: 'li', text: '<strong>Push Neighbors:</strong> For the popped vertex, find all its unvisited neighbors and push them onto the stack.' },
        { type: 'li', text: '<strong>Repeat:</strong> Continue this process until the stack is empty. The path taken follows one branch to its conclusion before moving to the next.' },
        { type: 'h2', text: 'Performance' },
        { type: 'li', text: '<strong>Time Complexity: O(V + E)</strong> - Where V is the number of vertices and E is the number of edges. The algorithm must visit every vertex and check every edge once.' },
        { type: 'li', text: '<strong>Space Complexity: O(V)</strong> - In the worst case (for a long, unbranched graph), the stack may have to store all vertices.' },
        { type: 'h2', text: 'Use Cases' },
        { type: 'li', text: '<strong>Solving Mazes and Puzzles:</strong> DFS is excellent for finding a path in a maze.' },
        { type: 'li', text: '<strong>Topological Sorting:</strong> Used for ordering tasks or dependencies in a Directed Acyclic Graph (DAG).' },
        { type: 'li', text: '<strong>Detecting Cycles:</strong> Can be adapted to detect if a graph contains any cycles.' },
    ]
};