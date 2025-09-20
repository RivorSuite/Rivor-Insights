export const algoLinearSearch = {
    title: "Linear Search",
    category: "Stage 5: Searching & Sorting Algorithms",
    content: [
        { type: 'h2', text: 'The Simplest Search' },
        { type: 'p', text: 'Linear Search is the most straightforward search algorithm. It sequentially checks each element in a collection, one by one, until a match for the target value is found or until all elements have been searched.' },
        { type: 'h2', text: 'Core Logic' },
        { type: 'li', text: '<strong>Start at the Beginning:</strong> The search begins at the very first element (index 0).' },
        { type: 'li', text: '<strong>Compare and Continue:</strong> It compares the current element with the target value. If they don\'t match, it moves to the next element.' },
        { type: 'li', text: '<strong>Find or Finish:</strong> The process continues until a match is found (and its index is returned) or the end of the collection is reached (indicating the target is not present).' },
        { type: 'h2', text: 'Performance: The Trade-off for Simplicity' },
        { type: 'p', text: 'The primary advantage of Linear Search is its simplicity and the fact that it can be performed on an unsorted collection of data. However, its performance is a significant drawback for large datasets.' },
        { type: 'li', text: '<strong>Time Complexity: O(n)</strong> - In the worst-case scenario, the algorithm must check every single element in the collection, making its runtime directly proportional to the number of elements (n).' },
        { type: 'li', text: '<strong>Best Case: O(1)</strong> - The best case occurs if the target element happens to be the very first item in the collection.' },
        { type: 'h2', text: 'Python Implementation' },
        { type: 'code', text: 'def linear_search(data, target):\n  for i in range(len(data)):\n    if data[i] == target:\n      return i  # Return the index where the target was found\n  return -1 # Return -1 if the target is not in the list' },
    ]
};