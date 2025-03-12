"use strict";
class SortsPlayer {
    canvas;
    ctx;
    sort;
    sortType;
    renderQueue;
    rects;
    marginFr = .1;
    gapFr = .2;

    constructor(canvas, sortType) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.sort = new Sorts();
        this.sortType = sortType;
        this.rects = [[]];
    }

    loadRandomArray(length, min, max, sortName) {
        let A = new Int32Array(length);
        for (let i = 0; i < A.length; i++) {
            A[i] = Math.floor(Math.random() * Math.abs(min + max)) + min;
        }
        this.applySort(A, sortName);
        this.setRects(A);
    }

    loadArray(AStr) {
        AStr = AStrsplit(",");
        let A = new Int32Array(AStr.length);
        for (let i = 0; i < AStr.length; i++) {
            A[i] = parseInt(AStr);
        }
        this.applySort(A, sortName);
        this.setRects(A);
    }

    applySort(A, sortName) {
        if (sortName == "selection") {
            
        } else if (sortName == "Insertion") {
            this.sort.insertionSort(A)
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
        for(let i = 0; i < A.length; i++) {
            this.rects[0].push(new Rect(A[i], currentXPos, marginPx, rectWidth, 10 * A[i], "red"));
            currentXPos += stepSize;
        }
    }

    step(n) {
        this.renderQueue.push(this.sort.stepForward(n));
    }

    stepBackward(n) {
        this.renderQueue.push(this.sort.stepBackward(n));
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
    value;
    x;
    y;
    width;
    height;
    color;
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
        this.posx = x;
        this.posy = y;
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
        ctx.fillRect(this.x - xOffset, this.y - yOffset, this.width, this.height)
    }
}

