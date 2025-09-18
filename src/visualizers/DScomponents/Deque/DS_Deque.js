let nodeId = 0; // A simple counter to ensure unique IDs

class Node {
    constructor(value) {
        this.id = nodeId++; // Assign a unique ID and increment the counter
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

export class DS_Deque {
    constructor(isFixedSize = false, capacity = 10) {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.history = [];
        this.isFixedSize = isFixedSize;
        this.capacity = isFixedSize ? capacity : Infinity;
    }

    _recordHistory(type, description, details = {}) {
        const values = [];
        let current = this.head;
        while (current) {
            values.push({ id: current.id, value: current.value });
            current = current.next;
        }
        this.history.push({ type, description, dequeState: values, ...details });
    }

    setType(isFixedSize) {
        this.isFixedSize = isFixedSize;
        this.capacity = isFixedSize ? this.capacity : Infinity;
        this.clear();
        this.history = [];
        this._recordHistory('config', `Deque type set to ${isFixedSize ? 'Fixed' : 'Dynamic'}`);
        return this.history;
    }

    setCapacity(newCapacity) {
        if (this.isFixedSize) {
            this.capacity = newCapacity;
            this.clear();
            this.history = [];
            this._recordHistory('config', `Deque capacity set to ${newCapacity}`);
            return this.history;
        }
        return null;
    }

    addToFront(value) {
        this.history = [];
         if (this.isFixedSize && this.size >= this.capacity) {
            this._recordHistory('error', `Deque Overflow: Cannot add ${value}.`);
            return this.history;
        }
        this._recordHistory('start', `Adding ${value} to front.`);
        this._recordHistory('pre-add-front', `Value ${value} ready.`, { value });
        const newNode = new Node(value);
        newNode.next = this.head;
        if (this.head) this.head.prev = newNode;
        else this.tail = newNode;
        this.head = newNode;
        this.size++;
        this._recordHistory('end', `Addition of ${value} complete.`);
        return this.history;
    }

    addToBack(value) {
        this.history = [];
         if (this.isFixedSize && this.size >= this.capacity) {
            this._recordHistory('error', `Deque Overflow: Cannot add ${value}.`);
            return this.history;
        }
        this._recordHistory('start', `Adding ${value} to back.`);
        this._recordHistory('pre-add-back', `Value ${value} ready.`, { value });
        const newNode = new Node(value);
        newNode.prev = this.tail;
        if (this.tail) this.tail.next = newNode;
        else this.head = newNode;
        this.tail = newNode;
        this.size++;
        this._recordHistory('end', `Addition of ${value} complete.`);
        return this.history;
    }

    removeFromFront() {
        this.history = [];
        if (!this.head) {
            this._recordHistory('error', 'Deque is empty.');
            return this.history;
        }
        const removedNode = this.head;
        this._recordHistory('start', `Removing ${removedNode.value} from front.`);
        this._recordHistory('lift-front', `Lifting ${removedNode.value}.`, { fromIndex: removedNode.id });
        this.head = this.head.next;
        if (this.head) this.head.prev = null;
        else this.tail = null;
        this.size--;
        this._recordHistory('end', 'Removal from front complete.');
        return this.history;
    }

    removeFromBack() {
        this.history = [];
        if (!this.tail) {
            this._recordHistory('error', 'Deque is empty.');
            return this.history;
        }
        const removedNode = this.tail;
        this._recordHistory('start', `Removing ${removedNode.value} from back.`);
        this._recordHistory('lift-back', `Lifting ${removedNode.value}.`, { fromIndex: removedNode.id });
        this.tail = this.tail.prev;
        if (this.tail) this.tail.next = null;
        else this.head = null;
        this.size--;
        this._recordHistory('end', 'Removal from back complete.');
        return this.history;
    }

    peekFront() {
        this.history = [];
        if (!this.head) {
            this._recordHistory('error', 'Deque is empty.');
            return this.history;
        }
        this._recordHistory('highlight', `Peeking at front: ${this.head.value}`, { highlightIndices: [0] });
        this._recordHistory('end', 'Peek complete.');
        return this.history;
    }

    peekBack() {
        this.history = [];
        if (!this.tail) {
            this._recordHistory('error', 'Deque is empty.');
            return this.history;
        }
        this._recordHistory('highlight', `Peeking at back: ${this.tail.value}`, { highlightIndices: [this.size - 1] });
        this._recordHistory('end', 'Peek complete.');
        return this.history;
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.history = [];
        this._recordHistory('start', 'Clearing deque.');
        this._recordHistory('end', 'Deque cleared.');
        return this.history;
    }

    random(maxVal = 1000) {
        this.clear();
        this.history = [];
        const size = this.isFixedSize ? this.capacity : Math.floor(Math.random() * (10 - 4 + 1)) + 4;
        for (let i = 0; i < size; i++) {
            const val = Math.floor(Math.random() * maxVal);
            const newNode = new Node(val);
            if (!this.head) {this.head = this.tail = newNode;}
            else {
                this.tail.next = newNode;
                newNode.prev = this.tail;
                this.tail = newNode;
            }
            this.size++;
        }
        this._recordHistory('end', 'Random deque generated.');
        return this.history;
    }
}