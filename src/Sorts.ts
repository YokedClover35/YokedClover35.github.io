interface Action {
    type: string;
    getDescription: () => string;
}

class Swap implements Action {
    type = "Swap";
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
    getDescription(): string {
        return `Index ${this.i} with value ${this.x} and index ${this.j} with value ${this.y} are swapped.`;
    }
}

class Comparison implements Action {
    type = "Comparison";
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
    getDescription(): string {
        return `Index ${this.i} with value ${this.x} is ${this.relationToString()} index ${this.j} with value ${this.y}.`;
    }
}



class Sorts {

    // maintains a count of comparisons performed by this Sorts object
    comparisonCount: number;

    constructor() {
        this.comparisonCount = 0;
    }
    getComparisonCount(): number {
        return this.comparisonCount;
    }

    resetComparisonCount() {
        this.comparisonCount = 0;
    }

    /**
     * Sorts A[start..end] in place using insertion sort
     * Precondition: 0 <= start <= end <= A.length
     */
    insertionSort(A: Int32Array, start: number, end: number) {
        // A[start..i] is sorted
        for (let i = start + 1; i < end; i++) {
        let j = i;
            // A[j..i] is sorted
            while (j > start && A[j - 1] > A[j]) {
                this.swap(A, j - 1, j);
                this.comparisonCount++;
                j--;
            }
        }
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
        this.swap(A, pivIndex, start);
      let i = start + 1;
      let j = end;
        // A[start..i] <= pivValue and A[j..end] > pivValue
        while (i != j) {
            if (A[i] <= pivValue) {
                this.swap(A, i - 1, i);
                i++;
            } else {
                this.swap(A, j - 1, i);
                j--;
            }
            this.comparisonCount++;
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
            this.comparisonCount++;
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
            A[i + start] = temp [i];
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
                buckets[digit].append(A[j]);
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
            buckets[(A[i] < 0) ? 0 : 1].append(A[i]);
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

    /**
     * swap a[i] and a[j]
     * pre: 0 <= i, j < a.size
     * post: values in a[i] and a[j] are swapped
     */
    swap(a: Int32Array, i: number, j: number) {
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }

}