"use strict";
class SortsPlayer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    sort: Sorts;
    sortType: string;
    renderQueue: Queue;
    rects: Rect[][];
    marginFr = .1;
    gapFr = .2;

    constructor(canvas:HTMLCanvasElement, sortType:string = "insertion") {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.sort = new Sorts();
        this.sortType = sortType;
        this.renderQueue = new Queue();
        this.rects = [[]];
    }

    loadRandomArray(length: number, min: number, max: number) {
        let A = new Int32Array(length);
        for (let i = 0; i < A.length; i++) {
            A[i] = Math.floor(Math.random() * Math.abs(min + max)) + min;
        }
        this.applySort(A, this.sortType);
        this.setRects(A);
    }

    loadArray(Str: string) {
        let AStr = Str.split(",");
        let A = new Int32Array(AStr.length);
        for (let i = 0; i < AStr.length; i++) {
            A[i] = parseInt(AStr[i]);
        }
        this.applySort(A, this.sortType);
        this.setRects(A);
    }

    applySort(A: Int32Array, sortName: string) {
        if (sortName == "selection") {
            
        } else if (sortName == "Insertion") {
            this.sort.insertionSort(A, 0, A.length)
            console.log(this.sort.getSorted());
        }
    }

    setRects(A: Int32Array) {
        this.rects = [[]];
        let marginPx = this.canvas.clientWidth * this.marginFr;
        let usableWidth = this.canvas.clientWidth - (2 * marginPx);
        let rectWidth = usableWidth / ((this.gapFr + 1) * A.length - this.gapFr);
        console.log("rect width: " + rectWidth);
        console.log("usable: " + usableWidth + " calculated usable: " + (rectWidth * A.length + rectWidth * this.gapFr * (A.length - 1)));
        let currentXPos = this.canvas.clientWidth * this.marginFr;
        let stepSize = rectWidth * (1 + this.gapFr);
        for(let i = 0; i < A.length; i++) {
            this.rects[0].push(new Rect(A[i], currentXPos, this.canvas.clientHeight - marginPx, rectWidth, marginPx / 5 * A[i], "red"));
            currentXPos += stepSize;
        }
    }

    step(n: number) {
        let temp = this.sort.stepForward(n);
        for (let i = 0; i < temp.length; i++) {
            this.renderQueue.appendItem(temp[i]);
        }
    }

    stepBackward(n: number) {
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
    value: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    constructor(value: number, x: number, y: number, width: number, height: number, color: string = "white") {
        this.value = value;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    setValue(value: number) {
        this.value = value;
    }

    setPos(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    setDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    setColor(color: string) {
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D, xOffset: number, yOffset: number) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - xOffset, this.y - this.height - yOffset, this.width, this.height)
    }
}

