export class Algo_LinearSearch {
    constructor(array, valueToFind) {
        this.array = array;
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
        this._recordHistory('start', `Starting Linear Search for ${this.valueToFind}.`);
        for (let i = 0; i < this.array.length; i++) {
            // Step 1: Highlight the element being compared
            this._recordHistory('compare', `Comparing with element at index ${i}.`, {comparingIndex: i,});
            // Step 2: Check if the element is found
            if (this.array[i] === this.valueToFind) {
                this._recordHistory('found', `Value ${this.valueToFind} found at index ${i}.`, {foundIndex: i,});
                this._recordHistory('end', 'Search complete. Value found.');
                return this.history; // Exit after finding the value
            }
        }
        // Step 3: If the loop finishes, the value was not found
        this._recordHistory('not-found', `Value ${this.valueToFind} not found in the array.`);
        this._recordHistory('end', 'Search complete. Value not found.');
        return this.history;
    }
}