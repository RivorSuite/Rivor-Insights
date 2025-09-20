export class Algo_InsertionSort {
    constructor(array) {
        this.array = [...array];
        this.history = [];
        this._recordHistory('initial', 'Algorithm initialized');
    }
    _recordHistory(type, description, details = {}) {
        const step = {
            type,
            description,
            arrayState: [...this.array],
            ...details,
        };
        this.history.push(step);
    }
    run() {
        this.history = [];
        this._recordHistory('start', 'Starting Insertion Sort.');
        const n = this.array.length;
        for (let i = 1; i < n; i++) {
            let key = this.array[i];
            let j = i - 1;
            this._recordHistory('key-select', `Selecting ${key} as the key to insert.`, {
                keyIndex: i,
                comparingIndex: j,
                sortedCount: i,
                keyValue: key
            });
            while (j >= 0 && this.array[j] > key) {
                this._recordHistory('compare', `Comparing key ${key} with ${this.array[j]}.`, {
                    keyIndex: i,
                    comparingIndex: j,
                    sortedCount: i,
                    keyValue: key
                });    
                this.array[j + 1] = this.array[j];
                this._recordHistory('shift', `${this.array[j]} > ${key}, shifting ${this.array[j]} to the right.`, {
                    keyIndex: i,
                    comparingIndex: j,
                    sortedCount: i,
                    keyValue: key
                });
                j = j - 1;
            }
            if (j >= 0) {
                this._recordHistory('compare-fail', `${this.array[j]} <= ${key}, insertion spot found.`, {
                    keyIndex: i,
                    comparingIndex: j,
                    sortedCount: i,
                    keyValue: key
                });
            }
            this.array[j + 1] = key;
            this._recordHistory('insert', `Inserting key ${key} at index ${j + 1}.`, {
                insertedIndex: j + 1, // Use a new property to mark the inserted cell
                sortedCount: i,      // Keep the sorted count same for one frame
                keyIndex: i,
                comparingIndex: j,
                keyValue: key
            });
            // Add a final step to absorb the new key into the sorted section
            this._recordHistory('absorb', `Key ${key} is now sorted.`, {
                sortedCount: i + 1,
                keyValue: key
            });
        }
        this._recordHistory('end', 'Insertion Sort complete.', { sortedCount: n });
        return this.history;
    }
}