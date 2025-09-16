export const dsGraphsIntro = {
    title: "Graphs",
    category: "Stage 4: Non-Linear Data Structures",
    content: [
        { type: 'h2', text: 'Modeling Networks and Relationships' },
        { type: 'p', text: 'A graph is a flexible, non-linear data structure consisting of a set of <strong>vertices</strong> (or nodes) and a set of <strong>edges</strong> that connect pairs of vertices. Unlike trees, graphs do not have a hierarchical parent-child structure; any node can be connected to any other node. They are the perfect tool for modeling complex networks like social media connections, road systems, or computer networks.' },
        { type: 'h2', text: 'Key Characteristics' },
        { type: 'li', text: '<strong>Directed vs. Undirected:</strong> In an undirected graph, an edge `(A, B)` is bidirectional, like a two-way street. In a directed graph, edges have a direction, so an edge `A -> B` is like a one-way street.' },
        { type: 'li', text: '<strong>Weighted vs. Unweighted:</strong> In a weighted graph, each edge has a "cost" or "weight" associated with it, representing a value like distance, time, or capacity. In an unweighted graph, all edges are considered equal.' },
        { type: 'li', text: '<strong>Cyclic vs. Acyclic:</strong> A cyclic graph contains a path that starts and ends at the same vertex. An acyclic graph does not. A Directed Acyclic Graph (DAG) is a common and important type of graph in computer science, used in scheduling and data dependency analysis.' },
        { type: 'h2', text: 'Representing a Graph in Code' },
        { type: 'p', text: 'There are two primary ways to represent a graph in code:' },
        { type: 'li', text: '<strong>Adjacency List:</strong> A dictionary (or hash map) where each key is a vertex, and its value is a list of all the vertices it\'s connected to. This is the most common representation as it is efficient for storing sparse graphs (graphs with few edges).' },
        { type: 'li', text: '<strong>Adjacency Matrix:</strong> A 2D array where `matrix[i][j]` is 1 if there is an edge from vertex `i` to vertex `j`, and 0 otherwise. This is more efficient for dense graphs (graphs with many edges) but uses more memory.' },
        { type: 'code', text: '# Adjacency List for an undirected graph\n# A is connected to B and C\ngraph = {\n  \'A\': [\'B\', \'C\'],\n  \'B\': [\'A\'],\n  \'C\': [\'A\']\n}\n\n# Adjacency Matrix representation of the same graph (A=0, B=1, C=2)\n#   A B C\n# A [0,1,1]\n# B [1,0,0]\n# C [1,0,0]' },
    ]
};