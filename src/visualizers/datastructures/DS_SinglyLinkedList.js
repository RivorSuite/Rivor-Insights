class Node {
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
}

export class DS_SinglyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // UPDATED: getListState now returns a simple array of values
    getListState() {
        const values = [];
        let current = this.head;
        while (current) {
            values.push(current.value);
            current = current.next;
        }
        return values;
    }

    // --- REBUILT: addToHead with Shifting Animation ---
    addToHead(value) {
        const history = [];
        // This is a temporary array for building the animation states
        let animState = this.getListState();

        const recordHistory = (type, description, details = {}) => {
            history.push({
                type,
                description,
                // IMPORTANT: We now save the animation state array
                listState: [...animState],
                ...details
            });
        };

        recordHistory('start', `Starting to add ${value} to the head.`);

        // Step 1: Highlight the head where insertion will happen
        recordHistory('highlight', `Highlighting the head.`, { highlightIndices: [0] });

        // Step 2: Make space at the end of the visual array
        if (this.size > 0) {
            animState.push(null);
            recordHistory('expand', `Making space for the new element.`);
        }

        // Step 3: Shift all elements one by one
        for (let i = this.size - 1; i >= 0; i--) {
            const valueToMove = animState[i];
            recordHistory('lift', `Lifting ${valueToMove} from index ${i}.`, { fromIndex: i });

            animState[i + 1] = valueToMove;
            animState[i] = null;
            recordHistory('place', `Placing ${valueToMove} at index ${i + 1}.`, { toIndex: i + 1 });
        }

        // Step 4: Insert the new value into the empty head position
        animState[0] = value;
        recordHistory('insert', `Inserting ${value} at the head.`, { insertIndex: 0 });

        // --- Finalize the actual data structure ---
        const newNode = new Node(value, this.head);
        this.head = newNode;
        this.size++;

        recordHistory('end', `Addition of ${value} to head is complete.`);
        return history;
    }

    // --- Add to Tail with Traversal Animation ---
    addToTail(value) {
        const history = [];
        let animState = this.getListState();
        const recordHistory = (type, description, details = {}) => {
            history.push({ type, description, listState: [...animState], ...details });
        };
        
        recordHistory('start', `Starting to add ${value} to the tail.`);
        const newNode = new Node(value);

        // Case 1: The list is empty
        if (!this.head) {
            animState.push(null);
            recordHistory('highlight', 'Highlighting the head position.', { highlightIndices: [0] });
            animState[0] = value;
            recordHistory('insert', `Inserting ${value} at the head.`, { insertIndex: 0 });
            this.head = newNode;
            this.size++;
            recordHistory('end', `List was empty. New node becomes the head.`);
            return history;
        }
        
        // Case 2: Traverse the list, creating a frame for each step
        let current = this.head;
        let index = 0;
        while (current.next) {
            // Create a frame that says "highlight the current node"
            recordHistory('traverse', `Traversing past node ${current.value}.`, { traversedIndex: index });
            current = current.next;
            index++;
        }
        
        // Create a final frame to highlight the last node in the traversal
        recordHistory('traverse-end', `Reached the last node (${current.value}).`, { traversedIndex: index });
        
        // Create a frame with no highlights to "turn off" the traversal color
        recordHistory('traverse-complete', 'Traversal complete.');
        
        // Step 2: Add placeholder and highlight it
        animState.push(null);
        recordHistory('highlight', `Highlighting new spot at the tail.`, { highlightIndices: [this.size] });
        
        // Step 3: Insert the new node
        animState[this.size] = value;
        recordHistory('insert', `Inserting ${value} at the tail.`, { insertIndex: this.size });
    
        // --- Finalize the actual data structure ---
        current.next = newNode;
        this.size++;
        recordHistory('end', `Addition of ${value} to tail is complete.`);
        return history;
    }

    // --- Add at Index with Shifting Animation ---
    addAtIndex(index, value) {
        if (index < 0 || index > this.size) {
            return `Index out of bounds. Next valid index is ${this.size}.`;
        }
        if (index === 0) {
            return this.addToHead(value);
        }
        if (index === this.size) {
            return this.addToTail(value);
        }
        
        const history = [];
        let animState = this.getListState();
        const recordHistory = (type, description, details = {}) => {
            history.push({ type, description, listState: [...animState], ...details });
        };
        
        recordHistory('start', `Starting to add ${value} at index ${index}.`);
        
        // Step 1: Traverse to the node *before* the target index
        let current = this.head;
        for (let i = 0; i < index - 1; i++) {
            recordHistory('traverse', `Traversing past node ${current.value}.`, { traversedIndex: i });
            current = current.next;
        }
        recordHistory('traverse-end', `Reached node before insertion point.`, { traversedIndex: index - 1 });
    
        // Step 2: Highlight the insertion spot
        recordHistory('highlight', `Highlighting insertion spot at index ${index}.`, { highlightIndices: [index] });
        
        // Step 3: Make space and shift elements
        animState.push(null);
        recordHistory('expand', `Making space for the new element.`);
        for (let i = this.size - 1; i >= index; i--) {
            const valueToMove = animState[i];
            recordHistory('lift', `Lifting ${valueToMove} from index ${i}.`, { fromIndex: i });
            animState[i + 1] = valueToMove;
            animState[i] = null;
            recordHistory('place', `Placing ${valueToMove} at index ${i + 1}.`, { toIndex: i + 1 });
        }
        // Step 4: Insert the new value
        animState[index] = value;
        recordHistory('insert', `Inserting ${value} at index ${index}.`, { insertIndex: index });
        
        // --- Finalize the actual data structure ---
        const newNode = new Node(value, current.next);
        current.next = newNode;
        this.size++;
        
        recordHistory('end', `Addition of ${value} at index ${index} is complete.`);
        return history;
    }

    // --- Remove from Head with Shifting Animation ---
    removeFromHead() {
        if (this.size === 0) {
            return "Cannot remove from an empty list.";
        }
        const history = [];
        let animState = this.getListState();
    
        const recordHistory = (type, description, details = {}) => {
            history.push({ type, description, listState: [...animState], ...details });
        };
    
        recordHistory('start', 'Starting to remove from the head.');
        
        const removedValue = animState[0];
        // Step 1: Highlight the node to be removed
        recordHistory('highlight', `Highlighting head node ${removedValue} for removal.`, { highlightIndices: [0] });
        
        // Step 2: Lift the node
        recordHistory('lift', `Lifting ${removedValue} from the head.`, { fromIndex: 0 });
        animState[0] = null; // Leave an empty spot
    
        // Step 3: Shift all subsequent nodes to the left
        for (let i = 0; i < this.size - 1; i++) {
            const valueToMove = animState[i + 1];
            recordHistory('lift', `Lifting ${valueToMove} from index ${i + 1}.`, { fromIndex: i + 1 });
            
            animState[i] = valueToMove;
            animState[i + 1] = null;
            recordHistory('place', `Placing ${valueToMove} at index ${i}.`, { toIndex: i });
        }

        // Step 4: Remove the final null placeholder from the visual array
        animState.pop();
        recordHistory('shrink', 'Shrinking the list to its final size.');

        // --- Finalize the actual data structure ---
        this.head = this.head.next;
        this.size--;

        recordHistory('end', `Removal of ${removedValue} from head is complete.`);
        return history;
    }

    // --- Remove from Tail with Animation ---
    removeFromTail() {
        if (this.size === 0) {
            return "Cannot remove from an empty list.";
        }
        const history = [];
        let animState = this.getListState();
        
        const recordHistory = (type, description, details = {}) => {
            history.push({ type, description, listState: [...animState], ...details });
        };
        
        recordHistory('start', 'Starting to remove from the tail.');
        
        // Case 1: Only one node in the list
        if (this.size === 1) {
            const removedValue = animState[0];
            recordHistory('highlight', `Highlighting the only node ${removedValue} for removal.`, { highlightIndices: [0] });
            recordHistory('lift', `Lifting ${removedValue} from the list.`, { fromIndex: 0 });
            animState.pop();
            recordHistory('end', `Removal of ${removedValue} complete.`);
        
            // Finalize the data structure
            this.head = null;
            this.size = 0;
            return history;
        }
        
        // Case 2: Traverse to the second-to-last node
        let current = this.head;
        let index = 0;
        while (current.next && current.next.next) {
            recordHistory('traverse', `Traversing past node ${current.value}.`, { traversedIndex: index });
            current = current.next;
            index++;
        }
    
        // Highlight the second-to-last node
        recordHistory('traverse-end', `Reached second-to-last node (${current.value}).`, { traversedIndex: index });

        // Step 2: Highlight the tail node to be removed
        const removedValue = animState[this.size - 1];
        recordHistory('highlight', `Highlighting tail node ${removedValue} for removal.`, { highlightIndices: [this.size - 1] });
    
        // Step 3: Lift the tail node
        recordHistory('lift', `Lifting ${removedValue} from the tail.`, { fromIndex: this.size - 1 });

        // Step 4: Visually remove the node
        animState.pop();
        recordHistory('shrink', 'Removing the last node.');

        // --- Finalize the actual data structure ---
        current.next = null;
        this.size--;

        recordHistory('end', `Removal of ${removedValue} from tail is complete.`);
        return history;
    }

    // --- Remove at Index with Shifting Animation ---
    removeAtIndex(index) {
        if (index < 0 || index >= this.size) {
            return `Index out of bounds.`;
        }
        
        if (index === 0) {
            return this.removeFromHead();
        }
        // Note: A separate, optimized removeFromTail is faster.
        // We let it handle the last index case.
        if (index === this.size - 1) {
            return this.removeFromTail();
        }
        
        const history = [];
        let animState = this.getListState();
        const recordHistory = (type, description, details = {}) => {
            history.push({ type, description, listState: [...animState], ...details });
        };
        
        recordHistory('start', `Starting to remove node at index ${index}.`);

        // Step 1: Traverse to the node *before* the removal target
        let current = this.head;
        for (let i = 0; i < index - 1; i++) {
            recordHistory('traverse', `Traversing past node ${current.value}.`, { traversedIndex: i });
            current = current.next;
        }
        recordHistory('traverse-end', `Reached node before removal point.`, { traversedIndex: index - 1 });
        
        // Step 2: Highlight and lift the node to be removed
        const removedValue = animState[index];
        recordHistory('highlight', `Highlighting node ${removedValue} for removal.`, { highlightIndices: [index] });
        recordHistory('lift', `Lifting ${removedValue} from index ${index}.`, { fromIndex: index });
        animState[index] = null;
        
        // Step 3: Shift subsequent nodes to the left
        for (let i = index; i < this.size - 1; i++) {
            const valueToMove = animState[i + 1];
            recordHistory('lift', `Lifting ${valueToMove} from index ${i + 1}.`, { fromIndex: i + 1 });
            animState[i] = valueToMove;
            animState[i + 1] = null;
            recordHistory('place', `Placing ${valueToMove} at index ${i}.`, { toIndex: i });
        }

        // Step 4: Shrink the visual array
        animState.pop();
        recordHistory('shrink', 'Shrinking the list to its final size.');
        
        // --- Finalize the actual data structure ---
        current.next = current.next.next;
        this.size--;

        recordHistory('end', `Removal of node at index ${index} is complete.`);
        return history;
    }

    // --- Clear Method ---
    clear() {
        const history = [];
        const recordHistory = (type, description, details = {}) => {
            history.push({
                type,
                description,
                listState: this.getListState(),
                ...details
            });
        };

        recordHistory('start', `Clearing the list.`);

        // Step 1: Set the head to null
        this.head = null;
        this.size = 0;
        recordHistory('clear', `List has been cleared. Head is now null.`);

        recordHistory('end', `Clear operation complete.`);
        return history;
    }

    // --- Random Method ---
    random(minSize = 4, maxSize = 10, maxVal = 1000) {
        // Start with a fresh history
        const history = [];
        const recordHistory = (type, description, details = {}) => {
            history.push({
                type,
                description,
                listState: this.getListState(),
                ...details
            });
        };

        // First, clear the existing list
        this.head = null;
        this.size = 0;
        recordHistory('clear', `Clearing the list to generate random nodes.`);

        const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

        recordHistory('start', `Generating a random list of size ${size}.`);

        for (let i = 0; i < size; i++) {
            const val = Math.floor(Math.random() * maxVal);

            // For simplicity and speed, we'll add to the head each time
            const newNode = new Node(val, this.head);
            this.head = newNode;
            this.size++;
        }

        recordHistory('end', `Random list generated.`);
        return history;
    }
}