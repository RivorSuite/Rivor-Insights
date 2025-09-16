export const dsArrays = {
    title: "Arrays",
    category: "Stage 3: Linear Data Structures",
    content: [
        { type: 'h2', text: 'Contiguous Memory Layout' },
        { type: 'p', text: 'An array is a fundamental data structure that stores a collection of elements in a single, contiguous block of memory. This means that if the first element is at memory address `X`, the next element will be at `X + size_of_element`, and so on. This simple, linear layout is the key to the array\'s primary strength.' },
        { type: 'p', text: 'In many modern languages like Python, the "list" is a high-level abstraction built on top of a dynamic array, which can automatically resize itself to accommodate more elements.' },
        { type: 'h2', text: 'Core Operations' },
        { type: 'li', text: '<strong>Access:</strong> Retrieve an element by its index. (e.g., `my_array[2]`)' },
        { type: 'li', text: '<strong>Search:</strong> Find the index of a specific value.' },
        { type: 'li', text: '<strong>Insertion:</strong> Add an element at a specific index.' },
        { type: 'li', text: '<strong>Deletion:</strong> Remove an element from a specific index.' },
        { type: 'h2', text: 'Syntax and Example' },
        { type: 'code', text: 'numbers = [10, 20, 30, 40, 50, 60]\n\n# Access (O(1))\nthird_element = numbers[2] # 30\n\n# Slicing: Extract a sub-array (O(k) where k is slice size)\nsubset = numbers[1:4]  # Result: [20, 30, 40]\n\n# Searching: Find the index of an element (O(n))\nindex_of_40 = numbers.index(40) # 3\n\n# Appending: Add to the end (Amortized O(1))\nnumbers.append(70)\n\n# Insertion: Add at a specific index (O(n))\nnumbers.insert(0, 5)' },
        { type: 'h2', text: 'Performance and Memory' },
        { type: 'li', text: '<strong>O(1) Access:</strong> Because the memory is contiguous, the computer can instantly calculate the memory address of any element using its index. `address = start_address + index * element_size`. This is why accessing an element by its index is a "constant time" operation.' },
        { type: 'li', text: '<strong>Cache Locality:</strong> When you access an element, the CPU often loads adjacent elements into its high-speed cache. Since array elements are neighbors in memory, iterating through an array is extremely fast because the data is likely already in the cache.' },
        { type: 'li', text: '<strong>O(n) Insertions/Deletions:</strong> The contiguous nature of arrays is also their main weakness. To insert or delete an element at the beginning or middle, every subsequent element must be shifted in memory. In the worst case, this requires moving `n` elements, resulting in a "linear time" operation.' },
        { type: 'h2', text: 'Real-World Use Cases' },
        { type: 'p', text: 'Arrays are the right choice when you have a collection of data and your primary need is to read or update elements at known positions. They are less suitable when you need to perform frequent insertions or deletions from the middle of the collection.' },
        { type: 'li', text: 'Storing a grid of pixels in an image.'},
        { type: 'li', text: 'Implementing other data structures like stacks, queues, and heaps.'},
        { type: 'li', text: 'Used in matrices for mathematical computations.'}
    ]
};