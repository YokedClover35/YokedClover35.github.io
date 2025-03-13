"use strict";
class SortsPlayer {
    constructor(canvas, sortType = "insertion") {
        this.marginFr = .1;
        this.gapFr = .2;
        this.prevTime = 0;
        this.canvas = canvas;
        this.resizeCanvas();
        this.ctx = canvas.getContext("2d");
        this.sort = new Sorts();
        this.sortType = sortType;
        this.renderQueue = new Queue();
        this.rects = [];
        this.run();
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
        this.rects = [];
        let marginPx = this.canvas.clientWidth * this.marginFr;
        let usableWidth = this.canvas.clientWidth - (2 * marginPx);
        let rectWidth = usableWidth / ((this.gapFr + 1) * A.length - this.gapFr);
        console.log("rect width: " + rectWidth);
        console.log("usable: " + usableWidth + " calculated usable: " + (rectWidth * A.length + rectWidth * this.gapFr * (A.length - 1)));
        let currentXPos = this.canvas.clientWidth * this.marginFr;
        let stepSize = rectWidth * (1 + this.gapFr);
        for (let i = 0; i < A.length; i++) {
            this.rects.push(new Rect(A[i], currentXPos, this.canvas.clientHeight - marginPx, rectWidth, marginPx / 5 * A[i], "red"));
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
        let now = performance.now();
        console.log((this === undefined));
        if (this.rects.length > 0) {
            this.applyAnimations(now - this.prevTime);
            this.renderFrame();
        }
        this.prevTime = now;
        requestAnimationFrame(this.run);
    }
    applyAnimations(dt) {
        for (let i = 0; i < this.rects.length; i++) {
            this.rects[i].applyAnimation(dt);
        }
    }
    renderFrame() {
        this.resizeCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < 0; i++) {
            this.rects[i].draw(this.ctx, 0, 0);
        }
        console.log("here");
    }
    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
    randomAnimation() {
        let index = Math.floor(Math.random() * this.rects.length);
        this.rects[index].addAnimation(new LinearAnimation(this.rects[index], 1000, Math.random() * 100 - 50, Math.random() * 100 - 50));
    }
}
class Rect {
    constructor(value, x, y, width, height, color = "white") {
        this.animationQueue = new Queue;
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
    addAnimation(animation) {
        this.animationQueue.appendItem(animation);
    }
    applyAnimation(dt) {
        if (this.animationQueue.length > 0) {
            if (this.animationQueue.peek().applyAnimationStep(dt)) {
                this.animationQueue.poll();
            }
        }
    }
}
class LinearAnimation {
    constructor(rect, duration, dx, dy) {
        // duration: number;
        // dx: number;
        // dy: number;
        this.complete = false;
        this.rect = rect;
        this.timeElapsed = 0;
        // this.duration = duration;
        // this.dx = dx;
        // this.dy = dy;
        this.applyAnimationStep = function (dt) {
            if (this.complete)
                return true;
            if (this.timeElapsed + dt > duration) {
                this.complete = true;
                dt = duration - this.timeElapsed;
            }
            let dxdt = dx / duration;
            let dydt = dy / duration;
            this.rect.x += dxdt * dt;
            this.rect.y += dydt * dt;
            this.timeElapsed += dt;
            return this.complete;
        };
    }
}
