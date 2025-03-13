interface Action {
    type: string;
    getDescription: () => string;
    apply: (A: Int32Array) => void;
}

class Swap implements Action {
    type = "swap";
    i: number;
    j: number;
    x: number;
    y: number;
    constructor(i: number, j: number, x: number, y: number) {
        this.i = i;
        this.j = j;
        this.x = x;
        this.y = y;

    }
    apply(A: Int32Array) {
        Sorts.swap(A, this.i, this.j);
    }
    getDescription(): string {
        return `Index ${this.i} with value ${this.x} and index ${this.j} with value ${this.y} are swapped.`;
    }
}

class Comparison implements Action {
    type = "comparison";
    i: number;
    j: number;
    x: number;
    y: number;
    relation: number;
    constructor(i: number, j: number, x: number, y: number) {
        this.i = i;
        this.j = j;
        this.x = x;
        this.y = y;
        if (this.x > this.y) {
            this.relation = 1;
        } else if (this.x === this.y) {
            this.relation = 0;
        } else {
            this.relation = -1;
        }
    }
    relationToString(): string {
        switch (this.relation) {
            case 1:
                return `greater than`;
            case 0:
                return `equal to`;
            case -1:
                return `less than`;
            default:
                return `error`;
        }
    }
    apply(A: Int32Array) {
    }
    getDescription(): string {
        return `Index ${this.i} with value ${this.x} is ${this.relationToString()} index ${this.j} with value ${this.y}.`;
    }
}



class Sorts {

    // maintains a count of comparisons performed by this Sorts object
    comparisonCount: number = 0;
    swapCount: number = 0;
    history: Action[] = [];
    unsorted: Int32Array = new Int32Array(0);
    sorted: Int32Array = new Int32Array(0);
    currentState: Int32Array = new Int32Array(0);
    historyIndex: number = 0;

    constructor() {
    }

    loadNewArray(A: Int32Array) {
        this.comparisonCount = 0;
        this.swapCount = 0;
        this.history = [];
        // make unsorted and currentState a deep copy of A
        this.unsorted = this.copyArray(A);
        this.currentState = this.copyArray(A);
        // make sorted A so when changes are made to A they are also made to 
        this.sorted = new Int32Array(A.length);
    }

    getComparisonCount(): number {
        return this.comparisonCount;
    }

    getSwapCount(): number {
        return this.swapCount;
    }

    getHistory(): Action[] {
        return this.history;
    }

    public getState(): Int32Array {
        return this.currentState;
    }

    public getUnsorted(): Int32Array {
        return this.unsorted;
    }

    public getSorted(): Int32Array {
        return this.sorted;
    }

    public skipToUnsorted() {
        this.currentState = this.copyArray(this.unsorted);
        this.historyIndex = 0;
    }

    public skipToSorted() {
        this.currentState = this.copyArray(this.sorted);
        this.historyIndex = this.history.length - 1;
    }

    public stepForward(n:number = 1): Action[] {
        let steps: Action[] = [];
        for (let i = 0; i < n && this.historyIndex < this.history.length; i++) {
            let action = this.history[this.historyIndex];
            steps.push(action);
            action.apply(this.currentState);
            this.historyIndex ++;
        }
        return steps;
    }

    public stepBackward(n:number = 1): Action[] {
        let steps: Action[] = [];
        for (let i = 0; i < n && this.historyIndex > 0; i++) {
            this.historyIndex --;
            let action = this.history[this.historyIndex];
            steps.push(action);
            action.apply(this.currentState);
        }
        return steps;
    }
    /**
     * Sorts A[start..end] in place using insertion sort
     * Precondition: 0 <= start <= end <= A.length
     */
    insertionSort(A: Int32Array, start: number, end: number) {
        this.loadNewArray(A);
        // A[start..i] is sorted
        for (let i = start + 1; i < end; i++) {
            let j = i;
            // A[j..i] is sorted
            while (j > start && this.compareAndLog(A, j - 1, j) === 1) {
                this.swapAndLog(A, j - 1, j);
                j--;
            }
        }
        this.sorted = this.copyArray(A);
    }

    /**
     * Partitions A[start..end] around the pivot A[pivIndex]; returns the
     * pivot's new index.
     * Precondition: start <= pivIndex < end
     * Postcondition: If partition returns i, then
     * A[start..i] <= A[i] <= A[i+1..end]
     **/
    partition(A: Int32Array, start: number, end: number, pivIndex: number): number {
        let pivValue = A[pivIndex];
        this.swapAndLog(A, pivIndex, start);
        let i = start + 1;
        let j = end;
        // A[start..i] <= pivValue and A[j..end] > pivValue
        while (i != j) {
            if (A[i] <= pivValue) {
                this.swapAndLog(A, i - 1, i);
                i++;
            } else {
                this.swapAndLog(A, j - 1, i);
                j--;
            }
        }
        return i - 1;
    }

    /** use quicksort to sort the subarray A[start..end] */
    quickSort(A: Int32Array, start: number, end: number) {
        if (end - start < 2) {
            return;
        }
        let mid = this.partition(A, start, end, start);
        this.quickSort(A, start, mid);
        this.quickSort(A, mid + 1, end);
    }

    /**
     * merge the sorted subarrays A[start..mid] and A[mid..end] into
     * a single sorted array in A.
     */
    merge(A: Int32Array, start: number, mid: number, end: number) {
        let i = start;
        let j = mid;
        let temp = new Int32Array(end - start);
        // temp[0..(i - start) + (j - mid)] is sorted
        while (i < mid && j < end) {
            if (A[i] <= A[j]) {
                temp[(i - start) + (j - mid)] = A[i];
                i++;
            } else {
                temp[(i - start) + (j - mid)] = A[j];
                j++;
            }
        }
        // temp[0..(i - start) + (j - mid)] is sorted
        while (i < mid) {
            temp[(i - start) + (j - mid)] = A[i];
            i++;
        }
        // temp[0..(i - start) + (j - mid)] is sorted
        while (j < end) {
            temp[(i - start) + (j - mid)] = A[j];
            j++;
        }
        // copy temp array elements to A
        for (let i = 0; i < temp.length; i++) {
            A[i + start] = temp[i];
        }
    }

    /** use mergesort to sort the subarray A[start..end] */
    mergeSort(A: Int32Array, start: number, end: number) {
        let length = end - start;
        let mid = Math.floor((start + end) / 2);
        if (length < 2) {
            return;
        }

        this.mergeSort(A, start, mid);
        this.mergeSort(A, mid, end);
        this.merge(A, start, mid, end);
    }

    /** Sort A using LSD radix sort. Uses counting sort to sort on each digit */
    radixSort(A: Int32Array) {
        // count # of digits for largest number
        let largest = A[0];
        for (let i = 1; i < A.length; i++) {
            largest = Math.max(largest, Math.abs(A[i]));
        }
        let digits = 0;
        while (largest > 0) {
            largest /= 10;
            digits++;
        }
        // initialize buckets
        let buckets: LinkedList[] = [];
        for (let i = 0; i < 10; i++) {
            buckets.push(new LinkedList());
        }
        //sort by digits
        for (let i = 0; i <= digits; i++) {
            for (let j = 0; j < A.length; j++) {
                // in the case of negative numbers sort digits from large to small b/c bigger negative number digit = smaller number
                let digit = (A[j] < 0) ? 9 - Math.abs(this.getDigit(A[j], i)) : this.getDigit(A[j], i);
                buckets[digit].appendItem(A[j]);
            }
            let k = 0;
            for (let j = 0; j < buckets.length; j++) {
                while (!buckets[j].isEmpty()) {
                    A[k] = buckets[j].remove();
                    k++;
                }
            }
        }
        //sort negatives
        for (let i = 0; i < A.length; i++) {
            buckets[(A[i] < 0) ? 0 : 1].appendItem(A[i]);
        }
        let k = 0;
        for (let i = 0; i < buckets.length; i++) {
            while (!buckets[i].isEmpty()) {
                A[k] = buckets[i].remove();
                k++;
            }
        }


    }

    /* return the 10^d's place digit of n */
    getDigit(n: number, d: number): number {
        return (n / (Math.floor(Math.pow(10, d)))) % 10;
    }

    swapAndLog(a: Int32Array, i: number, j: number) {
        this.history.push(new Swap(i, j, a[i], a[j]));
        this.swapCount ++;
        Sorts.swap(a, i, j);
    }
    /**
     * swap a[i] and a[j]
     * pre: 0 <= i, j < a.size
     * post: values in a[i] and a[j] are swapped and a swap is pushed to history
     */
    public static swap(a: Int32Array, i: number, j: number) {
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }

    

    compareAndLog(a: Int32Array, i: number, j: number): number {
        this.history.push(new Comparison(i, j, a[i], a[j]));
        this.comparisonCount ++;
        return Sorts.compare(a, i, j);
    }

    public static compare(a: Int32Array, i: number, j: number): number {
        let difference = a[i] - a[j];
        if (difference === 0) return 0;
        return (difference > 0 ? 1 : -1);
    }

    copyArray(a: Int32Array): Int32Array {
        let temp = new Int32Array(a.length);
        for (let i = 0; i < temp.length; i++) {
            temp[i] = a[i];
        }
        return temp;
    }

}