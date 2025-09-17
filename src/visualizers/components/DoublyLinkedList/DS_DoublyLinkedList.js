class Node {
    constructor(value, next = null, prev = null) {this.value = value; this.next = next; this.prev = prev;
    }
}

export class DS_DoublyLinkedList {
    constructor() {this.head = null; this.tail = null; this.size = 0;}

    getListState() {
        const values = [];
        let current = this.head;
        while (current) {
            values.push(current.value);
            current = current.next;
        }
        return values;
    }

    addToHead(value) {
        const history = [];
        let animState = this.getListState();
        const recordHistory = (type, description, details = {}) => {history.push({ type, description, listState: [...animState], ...details });};
        recordHistory('start', `Adding ${value} to the head.`);
        if (this.size > 0) recordHistory('highlight', `Highlighting the head.`, { highlightIndices: [0] });
        if (this.size > 0) {
            animState.push(null);
            recordHistory('expand', `Making space.`);
            for (let i = this.size - 1; i >= 0; i--) {
                const valueToMove = animState[i];
                recordHistory('lift', `Lifting ${valueToMove}.`, { fromIndex: i });
                animState[i + 1] = valueToMove;
                animState[i] = null;
                recordHistory('place', `Placing ${valueToMove}.`, { toIndex: i + 1 });
            }
        }
        animState[0] = value;
        recordHistory('insert', `Inserting ${value}.`, { insertIndex: 0 });
        const newNode = new Node(value, this.head);
        if (this.head) this.head.prev = newNode; else this.tail = newNode;
        this.head = newNode;
        this.size++;
        recordHistory('end', `Addition of ${value} to head complete.`);
        return history;
    }

    addToTail(value) {
        const history = [];
        let animState = this.getListState();
        const recordHistory = (type, description, details = {}) => {history.push({ type, description, listState: [...animState], ...details });};
        recordHistory('start', `Adding ${value} to the tail.`);
        if (!this.head) {
            animState.push(value);
            recordHistory('insert', `List is empty. Inserting ${value}.`, { insertIndex: 0 });
        }
        else {
            recordHistory('highlight', `Highlighting the tail node (O(1) operation).`, { highlightIndices: [this.size - 1] });
            animState.push(value);
            recordHistory('insert', `Inserting ${value} at the tail.`, { insertIndex: this.size });
        }
        const newNode = new Node(value);
        if (this.tail) {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        else {this.head = this.tail = newNode;}
        this.size++;
        recordHistory('end', `Addition of ${value} to tail is complete.`);
        return history;
    }

    addAtIndex(index, value) {
        if (index < 0 || index > this.size) {return `Index out of bounds. Next valid index is ${this.size}.`;}
        if (index === 0) return this.addToHead(value);
        if (index === this.size) return this.addToTail(value);
        const history = [];
        let animState = this.getListState();
        const recordHistory = (type, description, details = {}) => {history.push({ type, description, listState: [...animState], ...details });};
        recordHistory('start', `Adding ${value} at index ${index}.`);
        let current;
        if (index < this.size / 2) { // Traverse from HEAD
            current = this.head;
            for (let i = 0; i < index - 1; i++) {
                recordHistory('traverse', `Traversing from head past ${current.value}.`, { traversedIndex: i });
                current = current.next;
            }
            recordHistory('traverse-end', `Reached node before insertion point.`, { traversedIndex: index - 1 });
        }
        else { // Traverse from TAIL
            
            current = this.tail;
            //loop to index, not index - 1, need to step back one from the node at the insertion point
            for (let i = this.size - 1; i > index; i--) {
                recordHistory('traverse', `Traversing from tail past ${current.value}.`, { traversedIndex: i });
                current = current.prev;
            }
            // current is now the node *after* the insertion point. Step back one to get the node to insert after.
            recordHistory('traverse-end', `Reached node after insertion point.`, { traversedIndex: index });
            current = current.prev;
        }
        // Add a blank frame to reset highlights and then highlight the specific insertion spot
        recordHistory('traverse-complete', 'Traversal complete.');
        recordHistory('highlight', `Highlighting insertion spot at index ${index}.`, { highlightIndices: [index] });
        animState.push(null);
        recordHistory('expand', `Making space for the new element.`);
        for (let i = this.size - 1; i >= index; i--) {
            const valueToMove = animState[i];
            recordHistory('lift', `Lifting ${valueToMove}.`, { fromIndex: i });
            animState[i + 1] = valueToMove; animState[i] = null;
            recordHistory('place', `Placing ${valueToMove}.`, { toIndex: i + 1 });
        }
        animState[index] = value;
        recordHistory('insert', `Inserting ${value}.`, { insertIndex: index });
        const newNode = new Node(value, current.next, current);
        if (current.next) {current.next.prev = newNode;}
        else {this.tail = newNode;} // If we inserted after the old tail, the new node is the new tail
        current.next = newNode;
        this.size++;
        recordHistory('end', `Addition of ${value} complete.`);
        return history;
    }

    removeFromHead() {
        if (this.size === 0) {return "Cannot remove from an empty list.";}
        const history = []; let animState = this.getListState();
        const recordHistory = (type, description, details = {}) => history.push({ type, description, listState: [...animState], ...details });
        recordHistory('start', 'Removing from the head.');
        const removedValue = animState[0];
        recordHistory('highlight', `Highlighting head.`, { highlightIndices: [0] });
        recordHistory('lift', `Lifting ${removedValue}.`, { fromIndex: 0 });
        animState[0] = null;
        for (let i = 0; i < this.size - 1; i++) {
            const valueToMove = animState[i + 1];
            recordHistory('lift', `Lifting ${valueToMove}.`, { fromIndex: i + 1 });
            animState[i] = valueToMove; animState[i + 1] = null;
            recordHistory('place', `Placing ${valueToMove}.`, { toIndex: i });
        }
        animState.pop();
        recordHistory('shrink', 'Shrinking list.');
        this.head = this.head.next;
        if (this.head) this.head.prev = null; else this.tail = null;
        this.size--;
        recordHistory('end', `Removal of ${removedValue} complete.`);
        return history;
    }

    removeFromTail() {
        if (this.size === 0) {return "Cannot remove from an empty list.";}
        const history = []; let animState = this.getListState();
        const recordHistory = (type, description, details = {}) => history.push({ type, description, listState: [...animState], ...details });
        recordHistory('start', 'Removing from the tail.');
        const removedValue = animState[this.size - 1];
        recordHistory('highlight', `Highlighting tail (O(1) operation).`, { highlightIndices: [this.size - 1] });
        recordHistory('lift', `Lifting ${removedValue}.`, { fromIndex: this.size - 1 });
        animState.pop();
        recordHistory('shrink', 'Removing last node.');
        this.tail = this.tail.prev;
        if (this.tail) this.tail.next = null; else this.head = null;
        this.size--;
        recordHistory('end', `Removal of ${removedValue} complete.`);
        return history;
    }

    removeAtIndex(index) {
        if (index < 0 || index >= this.size) {return `Index out of bounds.`;}
        if (index === 0) return this.removeFromHead();
        if (index === this.size - 1) return this.removeFromTail();
        const history = [];
        let animState = this.getListState();
        const recordHistory = (type, description, details = {}) => {history.push({ type, description, listState: [...animState], ...details });};
        recordHistory('start', `Removing node at index ${index}.`);
        let current;
        if (index < this.size / 2) { // Traverse from HEAD
            current = this.head;
            for (let i = 0; i < index; i++) {
                recordHistory('traverse', `Traversing from head past ${current.value}.`, { traversedIndex: i });
                current = current.next;
            }
            recordHistory('traverse-end', `Reached node for removal.`, { traversedIndex: index });
        }
        else { // Traverse from TAIL
            current = this.tail;
            for (let i = this.size - 1; i > index; i--) {
                recordHistory('traverse', `Traversing from tail past ${current.value}.`, { traversedIndex: i });
                current = current.prev;
            }
            recordHistory('traverse-end', `Reached node for removal.`, { traversedIndex: index });
        }
        const removedValue = animState[index];
        recordHistory('highlight', `Highlighting node ${removedValue}.`, { highlightIndices: [index] });
        recordHistory('lift', `Lifting ${removedValue}.`, { fromIndex: index });
        animState[index] = null;
        for (let i = index; i < this.size - 1; i++) {
            const valueToMove = animState[i + 1];
            recordHistory('lift', `Lifting ${valueToMove}.`, { fromIndex: i + 1 });
            animState[i] = valueToMove; animState[i + 1] = null;
            recordHistory('place', `Placing ${valueToMove}.`, { toIndex: i });
        }
        animState.pop();
        recordHistory('shrink', 'Shrinking list.');
        current.prev.next = current.next;
        if (current.next) current.next.prev = current.prev;
        this.size--;
        recordHistory('end', `Removal of node at index ${index} is complete.`);
        return history;
    }

    clear() {
        this.head = null; this.tail = null; this.size = 0;
        return [{type: 'start', description: 'Clearing list.', listState: []}, {type: 'end', description: 'List cleared.', listState: []}];
    }

    random(minSize = 4, maxSize = 10, maxVal = 1000) {
        this.clear();
        const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        for (let i = 0; i < size; i++) {
            const val = Math.floor(Math.random() * maxVal);
            const newNode = new Node(val);
            if (!this.head) { this.head = this.tail = newNode; }
            else { this.tail.next = newNode; newNode.prev = this.tail; this.tail = newNode; }
            this.size++;
        }
        return [{type: 'start', description: 'Generating random list.', listState: []}, {type: 'end', description: 'Random list generated.', listState: this.getListState()}];
    }
}