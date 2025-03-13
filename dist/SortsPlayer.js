"use strict";
class SortsPlayer {
    constructor(canvas, sortType = "insertion") {
        this.marginFr = .1;
        this.gapFr = .2;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.sort = new Sorts();
        this.sortType = sortType;
        this.renderQueue = new Queue();
        this.rects = [[]];
    }
    loadRandomArray(length, min, max) {
        let A = new Int32Array(length);
        for (let i = 0; i < A.length; i++) {
            A[i] = Math.floor(Math.random() * Math.abs(min + max)) + min;
        }
        this.applySort(A, this.sortType);
        this.setRects(A);
    }
    loadArray(Str) {
        let AStr = Str.split(",");
        let A = new Int32Array(AStr.length);
        for (let i = 0; i < AStr.length; i++) {
            A[i] = parseInt(AStr[i]);
        }
        this.applySort(A, this.sortType);
        this.setRects(A);
    }
    applySort(A, sortName) {
        if (sortName == "selection") {
        }
        else if (sortName == "Insertion") {
            this.sort.insertionSort(A, 0, A.length);
            console.log(this.sort.getSorted());
        }
    }
    setRects(A) {
        this.rects = [[]];
        let marginPx = this.canvas.clientWidth * this.marginFr;
        let usableWidth = this.canvas.clientWidth - (2 * marginPx);
        let rectWidth = usableWidth / ((this.gapFr + 1) * A.length - this.gapFr);
        console.log("rect width: " + rectWidth);
        console.log("usable: " + usableWidth + " calculated usable: " + (rectWidth * A.length + rectWidth * this.gapFr * (A.length - 1)));
        let currentXPos = this.canvas.clientWidth * this.marginFr;
        let stepSize = rectWidth * (1 + this.gapFr);
        for (let i = 0; i < A.length; i++) {
            this.rects[0].push(new Rect(A[i], currentXPos, this.canvas.clientHeight - marginPx, rectWidth, marginPx / 5 * A[i], "red"));
            currentXPos += stepSize;
        }
    }
    step(n) {
        let temp = this.sort.stepForward(n);
        for (let i = 0; i < temp.length; i++) {
            this.renderQueue.appendItem(temp[i]);
        }
    }
    stepBackward(n) {
        let temp = this.sort.stepBackward(n);
        for (let i = 0; i < temp.length; i++) {
            this.renderQueue.appendItem(temp[i]);
        }
    }
    run() {
        this.renderFrame();
    }
    renderFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.rects[0].length; i++) {
            this.rects[0][i].draw(this.ctx, 0, 0);
        }
    }
}
class Rect {
    constructor(value, x, y, width, height, color = "white") {
        this.value = value;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    setValue(value) {
        this.value = value;
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
    setDimensions(width, height) {
        this.width = width;
        this.height = height;
    }
    setColor(color) {
        this.color = color;
    }
    draw(ctx, xOffset, yOffset) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - xOffset, this.y - this.height - yOffset, this.width, this.height);
    }
}
