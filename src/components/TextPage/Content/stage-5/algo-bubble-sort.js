export const algoBubbleSort = {
    title: "Bubble Sort",
    category: "Stage 5: Searching & Sorting Algorithms",
    content: [
        { type: 'h2', text: 'The Simplest Sort' },
        { type: 'p', text: 'Bubble Sort is a straightforward sorting algorithm that repeatedly steps through a list, compares each pair of adjacent items, and swaps them if they are in the wrong order. The passes through the list are repeated until no swaps are needed, which means the list is sorted.' },
        { type: 'h2', text: 'Core Logic' },
        { type: 'li', text: '<strong>Outer Loop:</strong> The algorithm uses a nested loop structure. The outer loop runs for each element in the array.' },
        { type: 'li', text: '<strong>Inner Loop:</strong> The inner loop compares adjacent elements. The largest element in each pass "bubbles up" to its correct position at the end of the array.' },
        { type: 'li', text: '<strong>Optimization:</strong> A common optimization is to add a flag that checks if any swaps were made during a pass. If no swaps occur, the list is already sorted, and the algorithm can stop early.' },
        { type: 'h2', text: 'Performance: Simple but Slow' },
        { type: 'p', text: 'While easy to grasp, Bubble Sort\'s performance is a major drawback for any real-world application with a significant amount of data.' },
        { type: 'li', text: '<strong>Time Complexity: O(n²)</strong> - In the worst-case and average-case scenarios, the algorithm has to perform a pass for each element, and in each pass, it compares roughly n elements. This quadratic complexity means its runtime increases very quickly as the input size grows.' },
        { type: 'li', text: '<strong>Best Case: O(n)</strong> - The best case occurs if the array is already sorted. With the optimization, it will make a single pass through the array and then stop.' },
        { type: 'h2', text: 'Python Implementation' },
        { type: 'code', text: 'def bubble_sort(data):\n  n = len(data)\n  for i in range(n):\n    swapped = False\n    for j in range(0, n-i-1):\n      if data[j] > data[j+1]:\n        # Swap the elements\n        data[j], data[j+1] = data[j+1], data[j]\n        swapped = True\n    # If no two elements were swapped by inner loop, then break\n    if not swapped:\n      break' },
    ]
};