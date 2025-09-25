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
            { name: 'Python Implementation', snippet: `def linear_search(data, target):\n  for i in range(len(data)):\n    if data[i] == target:\n      return i  # Return the index where the target was found\n  return -1 # Return -1 if the target is not in the list\n\n# --- Example ---\nmy_list = [4, 2, 7, 1, 9, 5]\ntarget_value = 7\nresult = linear_search(my_list, target_value)\n\nif result != -1:\n  print(f"Target {target_value} found at index: {result}")\nelse:\n  print(f"Target {target_value} not found in the list.")` },
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
            { name: 'Python Implementation (Iterative)', snippet: `def binary_search(data, target):\n  low = 0\n  high = len(data) - 1\n\n  while low <= high:\n    mid = (low + high) // 2\n    if data[mid] == target:\n      return mid\n    elif data[mid] < target:\n      low = mid + 1\n    else:\n      high = mid - 1\n\n  return -1 # Target not found\n\n# --- Example ---\n# Binary search requires a sorted list\nmy_list = [1, 2, 4, 5, 7, 9]\ntarget_value = 7\nresult = binary_search(my_list, target_value)\n\nif result != -1:\n  print(f"Target {target_value} found at index: {result}")\nelse:\n  print(f"Target {target_value} not found in the list.")` },
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
            { name: 'Python Implementation', snippet: `def bubble_sort(data):\n  n = len(data)\n  for i in range(n):\n    swapped = False\n    for j in range(0, n-i-1):\n      if data[j] > data[j+1]:\n        data[j], data[j+1] = data[j+1], data[j]\n        swapped = True\n    if not swapped:\n      break\n  return data\n\n# --- Example ---\nmy_list = [64, 34, 25, 12, 22, 11, 90]\nprint(f"Original list: {my_list}")\nsorted_list = bubble_sort(my_list)\nprint(f"Sorted list: {sorted_list}")` },
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
            { name: 'Python Implementation', snippet: `def insertion_sort(data):\n  for i in range(1, len(data)):\n    key = data[i]\n    j = i - 1\n    while j >= 0 and key < data[j]:\n      data[j + 1] = data[j]\n      j -= 1\n    data[j + 1] = key\n  return data\n\n# --- Example ---\nmy_list = [12, 11, 13, 5, 6]\nprint(f"Original list: {my_list}")\nsorted_list = insertion_sort(my_list)\nprint(f"Sorted list: {sorted_list}")` },
        ],
        bigO: {
            'Best Case': { best: 'O(n)', worst: 'O(n)' },
            'Average Case': { best: 'O(n²)', worst: 'O(n²)' },
            'Worst Case': { best: 'O(n²)', worst: 'O(n²)' },
            'Space Complexity': { best: 'O(1)', worst: 'O(1)' },
        }
    },
    bfs: {
        about: {
            title: "About Breadth-First Search (BFS)",
            description: "Breadth-First Search is a graph traversal algorithm that explores neighbors first before children. It uses a queue data structure to keep track of the nodes to visit. It's often used to find the shortest path in an unweighted graph.",
            details: [
                { title: "Queue-Based", complexity: "Core Concept", note: "BFS uses a queue (First-In, First-Out) to manage the order of nodes to visit." },
                { title: "Level by Level", complexity: "Traversal Order", note: "It explores all nodes at the present 'level' or depth before moving to the next level." },
                { title: "Shortest Path", complexity: "Key Use Case", note: "For unweighted graphs, BFS is guaranteed to find the shortest path from the start node to any other node." },
                { title: "Completeness", complexity: "Algorithm Trait", note: "BFS is a 'complete' algorithm, meaning if a solution exists, BFS is guaranteed to find it." },
            ]
        },
        code: [
            { name: 'Python Implementation', snippet: `from collections import deque\n\ndef bfs(graph, start):\n  visited = {start}\n  queue = deque([start])\n  result = []\n\n  while queue:\n    vertex = queue.popleft()\n    result.append(vertex)\n    for neighbor in graph.get(vertex, []):\n      if neighbor not in visited:\n        visited.add(neighbor)\n        queue.append(neighbor)\n\n  return result\n\n# --- Example ---\n# Graph represented as an adjacency list\ngraph = {\n  'A': ['B', 'C'],\n  'B': ['A', 'D', 'E'],\n  'C': ['A', 'F'],\n  'D': ['B'],\n  'E': ['B', 'F'],\n  'F': ['C', 'E']\n}\n\nprint("BFS starting from node 'A':")\nprint(bfs(graph, 'A'))` },
        ],
        bigO: {
            'Time Complexity': { best: 'O(V + E)', worst: 'O(V + E)' },
            'Space Complexity': { best: 'O(V)', worst: 'O(V)' },
        }
    },
    dfs: {
        about: {
            title: "About Depth-First Search (DFS)",
            description: "Depth-First Search is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack data structure to keep track of the nodes to visit, which results in a deep exploration of the graph.",
            details: [
                { title: "Stack-Based", complexity: "Core Concept", note: "DFS uses a stack (Last-In, First-Out) to manage the order of nodes to visit, which naturally leads to a deep, recursive-like traversal." },
                { title: "Path Finding", complexity: "Traversal Order", note: "It explores one path to its conclusion before exploring another. This is different from BFS which explores level by level." },
                { title: "Backtracking", complexity: "Key Use Case", note: "Ideal for problems that require exploring all possible paths, like solving mazes, puzzles, or finding connected components in a graph." },
                { title: "Completeness", complexity: "Algorithm Trait", note: "DFS is 'complete' on finite graphs, but can get stuck in infinite loops on graphs with cycles if not handled with a 'visited' set." },
            ]
        },
        code: [
            { name: 'Python Implementation (Recursive)', snippet: `def dfs_recursive(graph, vertex, visited=None, result=None):\n  if visited is None:\n    visited = set()\n  if result is None:\n    result = []\n  visited.add(vertex)\n  result.append(vertex)\n  for neighbor in graph.get(vertex, []):\n    if neighbor not in visited:\n      dfs_recursive(graph, neighbor, visited, result)\n  return result\n\n# --- Example ---\n# Graph represented as an adjacency list\ngraph = {\n  'A': ['B', 'C'],\n  'B': ['A', 'D', 'E'],\n  'C': ['A', 'F'],\n  'D': ['B'],\n  'E': ['B', 'F'],\n  'F': ['C', 'E']\n}\n\nprint("DFS (recursive) starting from node 'A':")\nprint(dfs_recursive(graph, 'A'))` },
            { name: 'Python Implementation (Iterative)', snippet: `def dfs_iterative(graph, start):\n  visited = set()\n  stack = [start]\n  result = []\n  while stack:\n    vertex = stack.pop()\n    if vertex not in visited:\n      visited.add(vertex)\n      result.append(vertex)\n      # Add neighbors in reverse to visit them in order\n      for neighbor in reversed(graph.get(vertex, [])):\n        if neighbor not in visited:\n          stack.append(neighbor)\n  return result\n\n# --- Example ---\n# Graph represented as an adjacency list\ngraph = {\n  'A': ['B', 'C'],\n  'B': ['A', 'D', 'E'],\n  'C': ['A', 'F'],\n  'D': ['B'],\n  'E': ['B', 'F'],\n  'F': ['C', 'E']\n}\n\nprint("DFS (iterative) starting from node 'A':")\nprint(dfs_iterative(graph, 'A'))` },
        ],
        bigO: {
            'Time Complexity': { best: 'O(V + E)', worst: 'O(V + E)' },
            'Space Complexity': { best: 'O(V)', worst: 'O(V)' },
        }
    },
};