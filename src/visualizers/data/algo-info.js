export const algoInfo = {
    linearSearch: {
        about: {
            title: "About Linear Search",
            description: "Linear Search is the most basic search algorithm. It sequentially checks each element of a list for the target value until a match is found or until all the elements have been searched.",
            details: [
                { title: "Simplicity", complexity: "Core Concept", note: "Its primary advantage is its simplicity to understand and implement." },
                { title: "Performance", complexity: "O(n) Time", note: "In the worst case, it must check every element in the collection, making it inefficient for large datasets." },
                { title: "Unordered Data", complexity: "Key Use Case", note: "It does not require the data to be sorted, which is its main advantage over more complex algorithms like Binary Search." },
                { title: "Real-World Apps", complexity: "Applications", note: "Used for simple searches in small or unsorted datasets, like finding an item in a shopping list." },
            ]
        },
        code: [
            { name: 'Python Implementation', snippet: `def linear_search(data, target):\n  for i in range(len(data)):\n    if data[i] == target:\n      return i  # Return the index where the target was found\n  return -1 # Return -1 if the target is not in the list` },
        ],
        bigO: {
            'Access': { best: 'N/A', worst: 'N/A' },
            'Search': { best: 'O(1)', worst: 'O(n)' },
            'Insertion': { best: 'N/A', worst: 'N/A' },
            'Deletion': { best: 'N/A', worst: 'N/A' },
        }
    },
    binarySearch: {
        about: {
            title: "About Binary Search",
            description: "Binary Search is a highly efficient searching algorithm. It works by repeatedly dividing the search interval in half. A key prerequisite for Binary Search is that the data collection must be sorted.",
            details: [
                { title: "Divide and Conquer", complexity: "Core Concept", note: "The algorithm repeatedly divides the problem into smaller sub-problems until a solution is found." },
                { title: "Performance", complexity: "O(log n) Time", note: "Its logarithmic time complexity makes it extremely fast for large, sorted datasets." },
                { title: "Sorted Data Required", complexity: "Prerequisite", note: "The list must be sorted before the search can begin. If the data is unsorted, it must first be sorted, which adds to the overall time." },
                { title: "Use Cases", complexity: "Applications", note: "Used in countless applications, from searching for a word in a dictionary to looking up an item in a large database index." },
            ]
        },
        code: [
            { name: 'Python Implementation (Iterative)', snippet: `def binary_search(data, target):\n  low = 0\n  high = len(data) - 1\n\n  while low <= high:\n    mid = (low + high) // 2\n    if data[mid] == target:\n      return mid\n    elif data[mid] < target:\n      low = mid + 1\n    else:\n      high = mid - 1\n\n  return -1 # Target not found` },
        ],
        bigO: {
            'Access': { best: 'N/A', worst: 'N/A' },
            'Search': { best: 'O(1)', worst: 'O(log n)' },
            'Insertion': { best: 'N/A', worst: 'N/A' },
            'Deletion': { best: 'N/A', worst: 'N/A' },
        }
    },
};