let itemId = 0; // Counter for unique IDs

export class DS_Queue {
    constructor(isFixedSize = false, capacity = 10) {
        this.queue = []; // Will now store objects: { id, value }
        this.history = [];
        this.isFixedSize = isFixedSize;
        this.capacity = isFixedSize ? capacity : Infinity;
        this._recordHistory('initial', `Queue created.`);
    }

    _recordHistory(type, description, details = {}) {
        const step = {
            type,
            description,
            queueState: [...this.queue], // Store a copy of the array of objects
            ...details
        };
        this.history.push(step);
    }

    // --- Configuration Methods ---
    setType(isFixedSize) {
        this.isFixedSize = isFixedSize;
        this.capacity = isFixedSize ? this.capacity : Infinity;
        this.history = [];
        this._recordHistory('config', `Queue type set to ${isFixedSize ? 'Fixed' : 'Dynamic'}`);
        return this.history;
    }

    setCapacity(newCapacity) {
        if (this.isFixedSize) {
            this.capacity = newCapacity;
            if (this.queue.length > newCapacity) {
                this.queue.length = newCapacity;
            }
            this.history = [];
            this._recordHistory('config', `Queue capacity set to ${newCapacity}`);
            return this.history;
        }
        return null;
    }

    enqueue(value) {
        this.history = [];
        this._recordHistory('start', `Starting to enqueue ${value}.`);

        if (this.isFixedSize && this.queue.length >= this.capacity) {
            this._recordHistory('error', `Queue Overflow: Cannot enqueue ${value}, queue is full.`);
            return this.history;
        }

        this._recordHistory('pre-enqueue', `Value ${value} is ready to be enqueued.`, { preEnqueueValue: value });
        
        // Push an object with a unique ID
        this.queue.push({ id: itemId++, value: value });

        const backIndex = this.queue.length - 1;
        this._recordHistory('insert', `Enqueuing ${value} at the back of the queue (index ${backIndex}).`, { insertIndex: backIndex });
        this._recordHistory('end', `Enqueue operation for ${value} is complete.`);
        return this.history;
    }

    dequeue() {
        this.history = [];
        this._recordHistory('start', `Starting to dequeue from the queue.`);

        if (this.queue.length === 0) {
            this._recordHistory('error', `Queue Underflow: Cannot dequeue, queue is empty.`);
            return this.history;
        }

        const removedItem = this.queue[0];

        // Highlight the front element
        this._recordHistory('highlight', `Highlighting the front element ${removedItem.value} for removal.`, { highlightIndices: [0] });

        // "Lift" the element off the front, using its unique ID
        this._recordHistory('lift-dequeue', `Lifting ${removedItem.value} from the front of the queue.`, { fromIndex: removedItem.id });

        // Actually remove the element
        this.queue.shift();

        // Record the final state after removal
        this._recordHistory('shrink', `Dequeuing ${removedItem.value} from the queue.`);

        this._recordHistory('end', `Dequeue operation complete. Removed ${removedItem.value}.`);
        return this.history;
    }

    peek() {
        this.history = [];
        this._recordHistory('start', `Starting to peek at the queue.`);
    
        if (this.queue.length === 0) {
            this._recordHistory('error', `Queue is empty. Nothing to peek at.`);
            return this.history;
        }
    
        const frontValue = this.queue[0].value;
        this._recordHistory('highlight', `Peeking at the front element: ${frontValue}.`, { highlightIndices: [0] });
        this._recordHistory('end', `Peek operation complete. The queue remains unchanged.`);
        return this.history;
    }

    clear() {
        this.history = [];
        this._recordHistory('start', `Clearing the queue.`);
        this.queue = [];
        this._recordHistory('end', `Queue cleared.`);
        return this.history;
    }

    random(minSize = 4, maxSize = 8, maxVal = 1000) {
        this.history = [];
        this.queue = [];
        this._recordHistory('start', `Generating a random queue.`);
        
        const size = this.isFixedSize ? this.capacity : Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

        for (let i = 0; i < size; i++) {
            const val = Math.floor(Math.random() * maxVal);
            this.queue.push({ id: itemId++, value: val });
        }

        this._recordHistory('end', `Random queue of size ${this.queue.length} generated.`);
        return this.history;
    }
}