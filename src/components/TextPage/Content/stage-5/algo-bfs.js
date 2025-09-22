export const algoBFS = {
    title: "Breadth-First Search (BFS)",
    category: "Stage 5: Searching & Sorting Algorithms",
    content: [
        { type: 'h2', text: 'Exploring Level by Level' },
        { type: 'p', text: 'Breadth-First Search (BFS) is a graph traversal algorithm that explores all the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. It uses a queue to keep track of the next location to visit.' },
        { type: 'h2', text: 'Core Logic' },
        { type: 'li', text: '<strong>Start with a Queue:</strong> Begin with a queue and add the starting vertex to it. Also, maintain a "visited" set to avoid processing the same node twice.' },
        { type: 'li', text: '<strong>Dequeue and Visit:</strong> Dequeue a vertex from the front of the queue.' },
        { type: 'li', text: '<strong>Enqueue Neighbors:</strong> For the dequeued vertex, find all its unvisited neighbors, mark them as visited, and enqueue them.' },
        { type: 'li', text: '<strong>Repeat:</strong> Continue this process until the queue is empty. The order in which nodes were dequeued is the BFS traversal order.' },
        { type: 'h2', text: 'Performance' },
        { type: 'li', text: '<strong>Time Complexity: O(V + E)</strong> - Where V is the number of vertices and E is the number of edges. The algorithm must visit every vertex and check every edge once.' },
        { type: 'li', text: '<strong>Space Complexity: O(V)</strong> - In the worst case, the queue may have to store all vertices.' },
        { type: 'h2', text: 'Use Cases' },
        { type: 'li', text: '<strong>Finding Shortest Path:</strong> In an unweighted graph, BFS is guaranteed to find the shortest path between two nodes.' },
        { type: 'li', text: '<strong>Web Crawlers:</strong> To discover all the pages on a website, starting from a root URL.' },
        { type: 'li', text: '<strong>Social Networks:</strong> To find people within a certain connection distance ("friends of friends").' },
    ]
};