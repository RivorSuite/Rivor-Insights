// In src/visualizers/datastructures/DS_Stack.js

export class DS_Stack {
    constructor(isFixedSize = false, capacity = 10) {
        this.stack = [];
        this.history = [];
        this.isFixedSize = isFixedSize;
        this.capacity = isFixedSize ? capacity : Infinity;
        this._recordHistory('initial', `Stack created (Type: ${isFixedSize ? 'Fixed' : 'Dynamic'}, Capacity: ${this.capacity})`);
    }

    _recordHistory(type, description, details = {}) {
        const step = {
            type,
            description,
            stackState: [...this.stack],
            ...details
        };
        this.history.push(step);
    }

    // --- Configuration Methods ---
    setType(isFixedSize) {
        this.isFixedSize = isFixedSize;
        this.capacity = isFixedSize ? this.capacity : Infinity;
        this.history = [];
        this._recordHistory('config', `Stack type set to ${isFixedSize ? 'Fixed' : 'Dynamic'}`);
        return this.history;
    }

    setCapacity(newCapacity) {
        if (this.isFixedSize) {
            this.capacity = newCapacity;
            // Optional: You might want to truncate the stack if it exceeds the new capacity
            if (this.stack.length > newCapacity) {
                this.stack.length = newCapacity;
            }
            this.history = [];
            this._recordHistory('config', `Stack capacity set to ${newCapacity}`);
            return this.history;
        }
        return null; // Or some indicator that this is not applicable
    }

    // --- Core Stack Operations ---
    push(value) {
        this.history = [];
        this._recordHistory('start', `Starting to push ${value} onto the stack.`);

        if (this.isFixedSize && this.stack.length >= this.capacity) {
            this._recordHistory('error', `Stack Overflow: Cannot push ${value}, stack is full.`);
            return this.history;
        }

        // Step 1: Show the new value appearing, ready to be added
        this._recordHistory('pre-insert', `Value ${value} is ready to be pushed.`, { preInsertValue: value });

        // Step 2: Push the element onto the actual stack logic
        this.stack.push(value);

        // Step 3: Record the final state with the element inserted
        const topIndex = this.stack.length - 1;
        this._recordHistory('insert', `Pushing ${value} onto the stack at index ${topIndex}.`, { insertIndex: topIndex });

        this._recordHistory('end', `Push operation for ${value} is complete.`);
        return this.history;
    }

    pop() {
        this.history = [];
        this._recordHistory('start', `Starting to pop from the stack.`);

        if (this.stack.length === 0) {
            this._recordHistory('error', `Stack Underflow: Cannot pop, stack is empty.`);
            return this.history;
        }

        const topIndex = this.stack.length - 1;
        const removedValue = this.stack[topIndex];

        // Step 1: Highlight the top element that will be popped
        this._recordHistory('highlight', `Highlighting the top element ${removedValue} for removal.`, { highlightIndices: [topIndex] });

        // Step 2: "Lift" the element off the stack visually
        this._recordHistory('lift', `Lifting ${removedValue} from the top of the stack.`, { fromIndex: topIndex });

        // Step 3: Actually remove the element from the data structure
        this.stack.pop();

        // Step 4: Record the final state after removal
        this._recordHistory('shrink', `Removing ${removedValue} from the stack.`);

        this._recordHistory('end', `Pop operation complete. Removed ${removedValue}.`);
        return this.history;
    }

    peek() {
        this.history = [];
        this._recordHistory('start', `Starting to peek at the stack.`);
    
        if (this.stack.length === 0) {
            this._recordHistory('error', `Stack is empty. Nothing to peek at.`);
            return this.history;
        }
    
        const topIndex = this.stack.length - 1;
        const topValue = this.stack[topIndex];
    
        // Step 1: Highlight the top element
        this._recordHistory('highlight', `Peeking at the top element: ${topValue}.`, { highlightIndices: [topIndex] });
    
        // Step 2: Add a final frame to remove the highlight, showing the operation is over
        this._recordHistory('end', `Peek operation complete. The stack remains unchanged.`);
        return this.history;
    }

    clear() {
        this.history = [];
        this._recordHistory('start', `Clearing the stack.`);
        this.stack = [];
        this._recordHistory('end', `Stack cleared.`);
        return this.history;
    }

    random(maxVal = 1000) {
        this.history = [];
        this.stack = [];
        this._recordHistory('start', `Generating a random stack.`);
        
        const size = this.isFixedSize ? this.capacity : Math.floor(Math.random() * (10 - 4 + 1)) + 4;

        for (let i = 0; i < size; i++) {
            const val = Math.floor(Math.random() * maxVal);
            this.stack.push(val);
        }

        this._recordHistory('end', `Random stack of size ${this.stack.length} generated.`);
        return this.history;
    }
}