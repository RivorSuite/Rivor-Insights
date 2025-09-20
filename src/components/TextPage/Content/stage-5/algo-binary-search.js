export const algoBinarySearch = {
    title: "Binary Search",
    category: "Stage 5: Searching & Sorting Algorithms",
    content: [
        { type: 'h2', text: 'An Efficient "Divide and Conquer" Strategy' },
        { type: 'p', text: 'Binary Search is a highly efficient algorithm for finding an item from a <strong>sorted</strong> collection of items. It works by repeatedly dividing the search interval in half. If the value of the search key is less than the item in the middle of the interval, it narrows the interval to the lower half. Otherwise, it narrows it to the upper half.' },
        { type: 'h2', text: 'Prerequisites & Core Logic' },
        { type: 'li', text: '<strong>Sorted Data is a Must:</strong> The single most important prerequisite for Binary Search is that the data collection must be sorted.' },
        { type: 'li', text: '<strong>Find the Middle:</strong> The algorithm starts by examining the middle item of the collection.' },
        { type: 'li', text: '<strong>Compare and Eliminate:</strong> If the middle item is the target, the search is over. If the target is smaller, the entire right half of the collection is eliminated. If the target is larger, the entire left half is eliminated.' },
        { type: 'li', text: '<strong>Repeat:</strong> This process of dividing the search space in half is repeated on the remaining sub-collection until the value is found or the sub-collection is empty.' },
        { type: 'h2', text: 'Performance: The Power of Logarithms' },
        { type: 'p', text: 'The "divide and conquer" approach of Binary Search gives it a massive performance advantage over Linear Search for large datasets.' },
        { type: 'li', text: '<strong>Time Complexity: O(log n)</strong> - Because the algorithm halves the search space with each comparison, the number of checks grows logarithmically, not linearly. This makes it incredibly fast for searching in large sorted arrays.' },
        { type: 'h2', text: 'Iterative Python Implementation' },
        { type: 'code', text: 'def binary_search(data, target):\n  low = 0\n  high = len(data) - 1\n\n  while low <= high:\n    mid = (low + high) // 2\n    if data[mid] == target:\n      return mid\n    elif data[mid] < target:\n      low = mid + 1\n    else:\n      high = mid - 1\n\n  return -1 # Target not found' },
    ]
};