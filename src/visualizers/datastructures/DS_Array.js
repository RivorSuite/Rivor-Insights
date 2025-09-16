// This class represents the LOGIC of our array.
// It tracks its own state and creates a "story" of steps for the animation engine.
export class DS_Array {
    constructor() {
        this.array = [];
        this.history = []; // This will store the "story" of the animation
        this._recordHistory('initial', 'Array created');
    }

    // A private helper to record each step of the animation
    _recordHistory(type, description, details = {}) {
        const step = {
            type,           // e.g., 'insert', 'highlight', 'compare'
            description,    // A human-readable message, e.g., "Inserting 10 at index 2"
            arrayState: [...this.array], // A snapshot of the array at this moment
            ...details      // Extra info, e.g., { index: 2, value: 10 }
        };
        this.history.push(step);
    }

    // Inserts a value at a given index with a more detailed animation script
    insert(index, value) {
        if (index < 0 || index > this.array.length) {
            return `Index out of bounds. Next valid index is ${this.array.length}.`;
        }
        
        this.history = [];
        this._recordHistory('start', `Starting insertion of ${value} at index ${index}`);

        // Step 1: Highlight the target index
        this._recordHistory('highlight', `Highlighting insertion spot at index ${index}`, { indices: [index] });

        // Step 2: Make space at the end of the array
        if (this.array.length > 0 && index < this.array.length) {
            this.array.push(null);
            this._recordHistory('expand', `Making space for the new element.`);
        }

        // Step 3: Shift elements with "lift" and "place" steps
        for (let i = this.array.length - 2; i >= index; i--) {
            const valueToMove = this.array[i];
            
            // "Lift" the value from its current spot
            this._recordHistory('lift', `Lifting ${valueToMove} from index ${i}`, { fromIndex: i, value: valueToMove });

            // "Place" the value in the new spot
            this.array[i + 1] = valueToMove;
            this.array[i] = null; // Leave the old spot empty
            this._recordHistory('place', `Placing ${valueToMove} at index ${i + 1}`, { toIndex: i + 1, value: valueToMove });
        }
        

        // Step 4: Insert the new element into the now-empty spot
        this.array[index] = value;
        this._recordHistory('insert', `Inserting ${value} at index ${index}`, { index, value });
        
        this._recordHistory('end', `Insertion complete`);
        return this.history;
    }
    
    // Adds a value to the front of the array (index 0)
    addToFront(value) {
        // If the array is not empty, use the standard insert logic
        if (this.array.length > 0) {
            return this.insert(0, value);
        }

        // --- Custom logic for an empty array ---
        this.history = [];
        this._recordHistory('start', `Adding ${value} to the front`);

        // Step 1: Add a placeholder and highlight it
        this.array.push(null);
        this._recordHistory('highlight', `Making space at index 0`, { indices: [0] });

        // Step 2: Insert the new element into the spot
        this.array[0] = value;
        this._recordHistory('insert', `Inserting ${value} at index 0`, { index: 0, value });

        this._recordHistory('end', `Addition to front complete`);
        return this.history;
    }
    // Adds a value to the back of the array
    addToBack(value) {
        const index = this.array.length;

        this.history = [];
        this._recordHistory('start', `Adding ${value} to the back`);

        // Step 1: Add a placeholder and highlight it
        this.array.push(null);
        this._recordHistory('highlight', `Making space at index ${index}`, { indices: [index] });

        // Step 2: Insert the new element into the spot
        this.array[index] = value;
        this._recordHistory('insert', `Inserting ${value} at index ${index}`, { index, value });

        this._recordHistory('end', `Addition to back complete`);
        return this.history;
    }

    // Clears the entire array
    clear() {
        this.history = [];
        this._recordHistory('start', `Clearing the array.`);
        this.array = [];
        this._recordHistory('end', `Array cleared.`);
        return this.history;
    }

    // Fills the array with random data within a specified size range
    random(minSize = 4, maxSize = 10, maxVal = 1000) {
        this.history = [];
        this.array = [];
        this._recordHistory('start', `Generating a random array.`);

        // --- This is the new logic for random sizing ---
        const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

        for (let i = 0; i < size; i++) {
            // Generate a random value (e.g., between 0 and 99)
            const val = Math.floor(Math.random() * maxVal);
            this.array.push(val);
        }

        this._recordHistory('end', `Random array of size ${size} generated.`);
        return this.history;
    }
    // Removes a value from a given index with a more detailed animation script
    removeAtIndex(index) {
        if (index < 0 || index >= this.array.length) {
            return `Index out of bounds: Cannot remove at index ${index}.`;
        }

        this.history = [];
        this._recordHistory('start', `Starting removal from index ${index}`);
        
        const removedValue = this.array[index];
        // Step 1: Highlight and "lift" the element to be removed
        this._recordHistory('highlight-remove', `Highlighting ${removedValue} for removal`, { indices: [index] });
        this._recordHistory('lift-remove', `Lifting ${removedValue} from index ${index} for removal`, { fromIndex: index, value: removedValue });
        this.array[index] = null; // Leave the spot empty

        // Step 2: Shift elements to the left using "lift" and "place"
        for (let i = index; i < this.array.length - 1; i++) {
            const valueToMove = this.array[i + 1];
            
            // "Lift" the next value
            this._recordHistory('lift', `Lifting ${valueToMove} from index ${i + 1}`, { fromIndex: i + 1, value: valueToMove });
            
            // "Place" it in the current empty spot
            this.array[i] = valueToMove;
            this.array[i + 1] = null;
            this._recordHistory('place', `Placing ${valueToMove} at index ${i}`, { toIndex: i, value: valueToMove });
        }

        // Step 3: Remove the final null element from the array
        this.array.pop();
        this._recordHistory('shrink', `Shrinking array to final size.`);
        
        this._recordHistory('end', `Removal complete.`);
        return this.history;
    }

    // Removes a value from the front of the array
    removeFromFront() {
        if (this.array.length === 0) {
            return "Cannot remove from an empty array.";
        }
        return this.removeAtIndex(0);
    }

    // Removes a value from the back of the array
    removeFromBack() {
        if (this.array.length === 0) {
            return "Cannot remove from an empty array.";
        }
        const index = this.array.length - 1;
        
        this.history = [];
        this._recordHistory('start', `Removing from back at index ${index}`);
        
        const removedValue = this.array[index];
        this._recordHistory('highlight-remove', `Highlighting ${removedValue} for removal`, { indices: [index], value: removedValue });

        this.array.pop();
        this._recordHistory('end', `Removal complete.`);
        return this.history;
    }

    
    // A simple method to get the current state and history
    getSnapshot() {
        return {
            array: this.array,
            history: this.history
        };
    }
}