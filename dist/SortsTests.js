"use strict";
function runInsertionTest1(length) {
    let sort = new Sorts();
    let A = new Int32Array(length);
    for (let i = 0; i < A.length; i++) {
        A[i] = A.length - i - 1;
    }
    console.log("Unsorted: ");
    console.log(A);
    sort.insertionSort(A, 0, A.length);
    console.log("Sorted: ");
    console.log(A);
    console.log("Steps: ");
    let steps = sort.getHistory();
    for (let i = 0; i < steps.length; i++) {
        console.log(steps[i].getDescription());
    }
}
function insertionTest2(length) {
    let sort = new Sorts();
    let A = new Int32Array(length);
    for (let i = 0; i < A.length; i++) {
        A[i] = A.length - i - 1;
    }
    console.log("Unsorted (real): ");
    console.log(A);
    sort.insertionSort(A, 0, A.length);
    console.log("Unsorted: ");
    console.log(sort.getUnsorted());
    console.log("Sorted: ");
    console.log(sort.getSorted());
    let steps = [new Swap(0, 0, 0, 0)];
    //step forward to end
    while (steps.length > 0) {
        if (steps[0].type == "swap") {
            console.log(aToS(sort.getState()));
        }
        steps = sort.stepForward();
    }
    steps = [new Swap(0, 0, 0, 0)];
    //step backard until begining
    while (steps.length > 0) {
        if (steps[0].type == "swap") {
            console.log(aToS(sort.getState()));
        }
        steps = sort.stepBackward();
    }
}
function aToS(a) {
    let rStr = "";
    for (let i = 0; i < a.length; i++) {
        rStr += a[i] + " ";
    }
    return rStr;
}
