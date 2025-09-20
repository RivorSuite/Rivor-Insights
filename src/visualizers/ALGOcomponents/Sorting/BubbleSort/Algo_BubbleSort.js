export class Algo_BubbleSort {
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
        this._recordHistory('start', 'Starting Bubble Sort.');
        const n = this.array.length;
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                this._recordHistory('compare', `Comparing elements at index ${j} and ${j + 1}.`, {
                    comparingIndices: [j, j + 1],
                    sortedCount: i,
                    i: i,
                    j: j,
                });
                if (this.array[j] > this.array[j + 1]) {
                    swapped = true;
                    this._recordHistory('swap', `Swapping ${this.array[j]} and ${this.array[j+1]}.`, {
                        swapIndices: [j, j + 1],
                        sortedCount: i,
                        i: i,
                        j: j,
                        value1: this.array[j],
                        value2: this.array[j + 1],
                    });
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                } 
                else {
                    this._recordHistory('no-swap', `${this.array[j]} < ${this.array[j + 1]}, so no swap.`, {
                        comparingIndices: [j, j + 1],
                        sortedCount: i,
                        i: i,
                        j: j,
                    });
                }
            }
            if (!swapped) {
                this._recordHistory('end', 'Bubble Sort complete (early exit).', { sortedCount: n });
                return this.history;
            }
        }
        this._recordHistory('end', 'Bubble Sort complete.', { sortedCount: n });
        return this.history;
    }
}