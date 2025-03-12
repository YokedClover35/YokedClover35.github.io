class SortPlayer {
    canvas;
    ctx;
    sort;
    sortType;
    constructor(canvasId, sortType) {
        this.canvas = document.querySelector(canvasId);
        this.ctx = canvas.getContext("2d");
        this.sort = new Sorts();
        this.sortType = sortType;
    }

    loadRandomArray(length, min, max, sortName) {
        A = new Int32Array(length);
        for (let i = 0; i < A.length; i++) {
            A[i] = (int)(Math.random() * Math.abs(min + max)) + min;
        }
        this.applySort(A, sortName);
    }

    loadArray(AString) {
        AString = AString.split(",");
        A = new Int32Array(AString.length);
        for (let i = 0; i < AString.length; i++) {
            A[i] = parseInt(AString);
        }
        this.applySort(A, sortName);
    }

    applySort(A, sortName) {
        if (sortName == "selection") {
            
        } else if (sortName == "Insertion") {
            this.sort.insertionSort(A)
            console.log(this.sort.getSorted());
        }
    }
}