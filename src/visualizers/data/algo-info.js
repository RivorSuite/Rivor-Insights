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
    bubbleSort: {
        about: {
            title: "About Bubble Sort",
            description: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
            details: [
                { title: "Simplicity", complexity: "Core Concept", note: "It's one of the easiest sorting algorithms to understand and implement, making it a great educational tool." },
                { title: "Performance", complexity: "O(n²) Time", note: "Its quadratic time complexity makes it very inefficient for large datasets." },
                { title: "In-Place Sort", complexity: "Key Trait", note: "It sorts the list without requiring significant additional memory." },
                { title: "Use Cases", complexity: "Applications", note: "Primarily used for educational purposes or for very small, nearly-sorted datasets." },
            ]
        },
        code: [
            { name: 'Python Implementation', snippet: `def bubble_sort(data):\n  n = len(data)\n  for i in range(n):\n    swapped = False\n    for j in range(0, n-i-1):\n      if data[j] > data[j+1]:\n        data[j], data[j+1] = data[j+1], data[j]\n        swapped = True\n    if not swapped:\n      break # Exit early if no swaps occurred` },
        ],
        bigO: {
            'Best Case': { best: 'O(n)', worst: 'O(n)' },
            'Average Case': { best: 'O(n²)', worst: 'O(n²)' },
            'Worst Case': { best: 'O(n²)', worst: 'O(n²)' },
            'Space Complexity': { best: 'O(1)', worst: 'O(1)' },
        }
    },
    insertionSort: {
        about: {
            title: "About Insertion Sort",
            description: "Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It iterates through an input array and removes one element per iteration, finds the place the element belongs in the array, and then places it there.",
            details: [
                { title: "In-Place", complexity: "Core Concept", note: "It only requires a constant amount of additional memory space." },
                { title: "Performance", complexity: "O(n²) Time", note: "Like Bubble Sort, its quadratic time complexity makes it inefficient for large datasets." },
                { title: "Adaptive", complexity: "Key Trait", note: "It is efficient for data sets that are already substantially sorted: the time complexity is O(nk) when each element in the input is no more than k places away from its sorted position." },
                { title: "Use Cases", complexity: "Applications", note: "Efficient for small data sets, and is often used as a part of more sophisticated algorithms, such as hybrid sorting algorithms." },
            ]
        },
        code: [
            { name: 'Python Implementation', snippet: `def insertion_sort(data):\n  for i in range(1, len(data)):\n    key = data[i]\n    j = i - 1\n    while j >= 0 and key < data[j]:\n      data[j + 1] = data[j]\n      j -= 1\n    data[j + 1] = key` },
        ],
        bigO: {
            'Best Case': { best: 'O(n)', worst: 'O(n)' },
            'Average Case': { best: 'O(n²)', worst: 'O(n²)' },
            'Worst Case': { best: 'O(n²)', worst: 'O(n²)' },
            'Space Complexity': { best: 'O(1)', worst: 'O(1)' },
        }
    },
};