export const algoConceptsBigO = {
    title: "Understanding Big O Notation",
    category: "Stage 6: Algorithmic Concepts",
    content: [
        { type: 'h2', text: 'How We Measure Efficiency' },
        { type: 'p', text: 'Big O notation is a mathematical notation used in computer science to describe the performance or complexity of an algorithm. It tells you how the runtime or memory usage of an algorithm grows as the input size grows.' },
        { type: 'p', text: 'It focuses on the worst-case scenario, providing a reliable upper bound on performance. When you hear that an algorithm is "O(n)", it means its runtime grows linearly with the number of inputs (n).' },
        { type: 'h2', text: 'Common Complexities' },
        { type: 'li', text: '<strong>O(1) - Constant Time:</strong> The best. The algorithm takes the same amount of time regardless of the input size. (e.g., `arr[2]`).' },
        { type: 'li', text: '<strong>O(log n) - Logarithmic Time:</strong> Excellent. The runtime grows logarithmically. Common in algorithms that repeatedly divide the problem in half (e.g., binary search).' },
        { type: 'li', text: '<strong>O(n) - Linear Time:</strong> Good. The runtime grows directly proportional to the input size (e.g., `for item in arr:`).' },
        { type: 'li', text: '<strong>O(n²) - Quadratic Time:</strong> Fair. The runtime grows quadratically. Often seen in nested loops (e.g., `for item1 in arr: for item2 in arr:`).' },
    ]
};