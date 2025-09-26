export class Algo_BinarySearch {
    constructor(array, valueToFind) {
        this.array = [...array].sort((a, b) => a - b); // Binary search requires a sorted array
        this.valueToFind = valueToFind;
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
        this._recordHistory('start', `Starting Binary Search for ${this.valueToFind}. Array is sorted first.`);
        let low = 0;
        let high = this.array.length - 1;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            // Step 1: Highlight the current search range and the midpoint
            this._recordHistory('compare', `Comparing with middle element at index ${mid}.`, {
                low,
                high,
                mid,
            });
            // Step 2: Check if the midpoint is the target
            if (this.array[mid] === this.valueToFind) {
                this._recordHistory('found', `Value ${this.valueToFind} found at index ${mid}.`, {
                    low,
                    high,
                    mid,
                    foundIndex: mid,
                });
                this._recordHistory('end', 'Search complete. Value found.');
                return this.history;
            }
            // Step 3: Adjust the search range
            if (this.array[mid] < this.valueToFind) {
                this._recordHistory('adjust', `Target is greater. Discarding left half.`, {
                    low,
                    high,
                    mid,
                });
                low = mid + 1;
            } else {
                this._recordHistory('adjust', `Target is smaller. Discarding right half.`, {
                    low,
                    high,
                    mid,
                });
                high = mid - 1;
            }
        }
        // Step 4: If the loop finishes, the value was not found
        this._recordHistory('not-found', `Value ${this.valueToFind} not found in the array.`);
        this._recordHistory('end', 'Search complete. Value not found.');
        return this.history;
    }
}