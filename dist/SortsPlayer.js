"use strict";
class SortsPlayer {
    constructor(canvas, sortType = "insertion", id) {
        this.out = null;
        this.marginFr = .2;
        this.gapFr = .2;
        this.defaultAnimationSpeed = 200;
        this.viewPortRect = new Rect(0, 0, 0, 0, 0, "black", false);
        this.recursiveOffset = 50;
        this.paused = true;
        this.prevTime = 0;
        this.running = true;
        this.repeat = false;
        this.id = id;
        this.canvas = canvas;
        this.resizeCanvas();
        this.ctx = canvas.getContext("2d");
        this.sort = new Sorts();
        this.sortType = sortType;
        this.renderQueue = new Queue();
        this.rects = [];
        this.tempRects = [];
        this.run();
    }
    equals(id) {
        return this.id == id;
    }
    setOut(out) {
        this.out = out;
    }
    loadRandomArray(length, min, max) {
        let A = new Int32Array(length);
        for (let i = 0; i < A.length; i++) {
            A[i] = Math.floor(Math.random() * Math.abs(min + max)) + min;
        }
        this.applySort(A, this.sortType);
        this.setRects(this.sort.getUnsorted());
    }
    loadArrayFromString(Str) {
        let AStr = Str.split(",");
        let A = new Int32Array(AStr.length);
        for (let i = 0; i < AStr.length; i++) {
            A[i] = parseInt(AStr[i]);
        }
        this.applySort(A, this.sortType);
        this.setRects(this.sort.getUnsorted());
    }
    skipToUnsorted() {
        this.viewPortRect.x = 0;
        this.viewPortRect.y = 0;
        this.sort.skipToUnsorted();
        this.setRects(this.sort.getUnsorted());
        this.run();
    }
    skipToSorted() {
        this.viewPortRect.x = 0;
        this.viewPortRect.y = 0;
        this.sort.skipToSorted();
        console.log(this.sort.getSorted());
        this.setRects(this.sort.getSorted());
        this.run();
    }
    reset() {
        this.skipToUnsorted();
    }
    pause() {
        this.paused = true;
    }
    play() {
        this.paused = false;
    }
    playPause() {
        this.paused = !this.paused;
    }
    setAnimationSpeed(ms) {
        this.defaultAnimationSpeed = ms;
    }
    applySort(A, sortName) {
        if (sortName == "selection") {
            this.sort.selectionSort(A, 0, A.length);
        }
        else if (sortName == "quick") {
            this.sort.quickSort(A, 0, A.length);
        }
        else if (sortName == "merge") {
            this.sort.mergeSort(A, 0, A.length);
        }
        else {
            this.sort.insertionSort(A, 0, A.length);
        }
    }
    setRects(A) {
        this.rects = [];
        this.tempRects = [];
        let marginWidthPx = this.canvas.clientWidth * this.marginFr;
        let marginHeightPx = this.canvas.clientHeight * this.marginFr;
        let usableWidth = this.canvas.clientWidth - (2 * marginWidthPx);
        let usableHeight = this.canvas.clientHeight - (2 * marginHeightPx);
        let rectHeightStep = usableHeight / this.maxOf(A);
        let rectWidth = usableWidth / ((this.gapFr + 1) * A.length - this.gapFr);
        let currentXPos = this.canvas.clientWidth * this.marginFr;
        let stepSize = rectWidth * (1 + this.gapFr);
        for (let i = 0; i < A.length; i++) {
            this.rects.push(new Rect(A[i], currentXPos, this.canvas.clientHeight - marginHeightPx, rectWidth, rectHeightStep * A[i], "red", true));
            this.tempRects.push(new Rect(0, currentXPos, this.canvas.clientHeight - marginHeightPx / 4, rectWidth, rectHeightStep * 2, "blue", false));
            currentXPos += stepSize;
        }
    }
    maxOf(A) {
        let max = -Infinity;
        for (let i = 0; i < A.length; i++) {
            max = Math.max(max, A[i]);
        }
        return max;
    }
    stepForward(n) {
        let temp = this.sort.stepForward(n);
        for (let i = 0; i < temp.length; i++) {
            this.renderQueue.appendItem(temp[i]);
        }
        if (this.repeat && this.renderQueue.length === 0) {
            this.reset();
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
        this.applyAnimations(now - this.prevTime);
        this.renderFrame();
        this.prevTime = now;
    }
    applyAnimations(dt) {
        let animationsComplete = true;
        for (let i = 0; i < this.rects.length; i++) {
            this.viewPortRect.applyAnimation(dt);
            if (!this.rects[i].applyAnimation(dt) || !this.tempRects[i].applyAnimation(dt)) {
                animationsComplete = false;
            }
        }
        if (animationsComplete) {
            if (!this.paused && this.renderQueue.length === 0) {
                this.stepForward(1);
            }
            if (this.renderQueue.length > 0) {
                let action = this.renderQueue.poll();
                this.writeToOut(action);
                this.addActionToRects(action);
            }
        }
    }
    writeToOut(action) {
        if (this.out !== null) {
            this.out.innerHTML = action.getDescription();
        }
    }
    addActionToRects(action) {
        let type = action.type;
        let i = action.i;
        let j = action.j;
        if (type == "swap") {
            let ix = this.rects[i].x;
            let iy = this.rects[i].y;
            let jx = this.rects[j].x;
            let jy = this.rects[j].y;
            this.rects[i].addAnimation(new LinearAnimation(this.rects[i], this.defaultAnimationSpeed, jx - ix, jy - iy, "green"));
            this.rects[j].addAnimation(new LinearAnimation(this.rects[j], this.defaultAnimationSpeed, ix - jx, iy - jy, "green"));
            let temp = this.rects[i];
            this.rects[i] = this.rects[j];
            this.rects[j] = temp;
        }
        else if (type == "tempSwap") {
            let ix = this.rects[i].x;
            let iy = this.rects[i].y;
            let jx = this.tempRects[j].x;
            let jy = this.tempRects[j].y;
            this.rects[i].addAnimation(new LinearAnimation(this.rects[i], this.defaultAnimationSpeed, jx - ix, jy - iy, "green"));
            this.tempRects[j].addAnimation(new LinearAnimation(this.tempRects[j], this.defaultAnimationSpeed, ix - jx, iy - jy, "green"));
            let temp = this.rects[i];
            this.rects[i] = this.tempRects[j];
            this.tempRects[j] = temp;
        }
        else if (type == "comparison" && this.defaultAnimationSpeed > 10) {
            this.rects[i].addAnimation(new ColorAnimation(this.rects[i], this.defaultAnimationSpeed, "blue"));
            this.rects[j].addAnimation(new ColorAnimation(this.rects[j], this.defaultAnimationSpeed, "blue"));
        }
        else if (type == "recursiveDown") {
            for (let index = i; index < j; index++) {
                this.rects[index].addAnimation(new LinearAnimation(this.rects[index], this.defaultAnimationSpeed, 0, this.recursiveOffset, "orange"));
                this.tempRects[index].addAnimation(new LinearAnimation(this.tempRects[index], this.defaultAnimationSpeed, 0, this.recursiveOffset, "orange"));
            }
            this.viewPortRect.addAnimation(new LinearAnimation(this.viewPortRect, this.defaultAnimationSpeed, 0, this.recursiveOffset, "orange"));
        }
        else if (type == "recursiveUp") {
            for (let index = i; index < j; index++) {
                this.rects[index].addAnimation(new LinearAnimation(this.rects[index], this.defaultAnimationSpeed, 0, -this.recursiveOffset, "orange"));
                this.tempRects[index].addAnimation(new LinearAnimation(this.tempRects[index], this.defaultAnimationSpeed, 0, -this.recursiveOffset, "orange"));
            }
            this.viewPortRect.addAnimation(new LinearAnimation(this.viewPortRect, this.defaultAnimationSpeed, 0, -this.recursiveOffset, "orange"));
        }
        else if (type == "retrieveTemp") {
            for (let index = i; index < j; index++) {
                let regx = this.rects[index].x;
                let regy = this.rects[index].y;
                let tempx = this.tempRects[index].x;
                let tempy = this.tempRects[index].y;
                this.rects[index].addAnimation(new LinearAnimation(this.rects[index], this.defaultAnimationSpeed, tempx - regx, tempy - regy, "green"));
                this.tempRects[index].addAnimation(new LinearAnimation(this.tempRects[index], this.defaultAnimationSpeed, regx - tempx, regy - tempy, "green"));
                let temp = this.rects[index];
                this.rects[index] = this.tempRects[index];
                this.tempRects[index] = temp;
            }
        }
    }
    skipAnimations() {
        while (this.renderQueue.length > 0) {
            this.applyAnimations(Infinity);
        }
        this.applyAnimations(Infinity);
    }
    renderFrame() {
        this.resizeCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.rects.length; i++) {
            this.rects[i].draw(this.ctx, this.viewPortRect.x, this.viewPortRect.y);
            this.tempRects[i].draw(this.ctx, this.viewPortRect.x, this.viewPortRect.y);
        }
    }
    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
}
class Rect {
    constructor(value, x, y, width, height, color = "white", visible) {
        this.animationQueue = new Queue;
        this.value = value;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.visible = visible;
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
        if (this.visible) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - xOffset, this.y - this.height - yOffset, this.width, this.height);
        }
    }
    addAnimation(animation) {
        this.animationQueue.appendItem(animation);
    }
    // retruns true if all animations are complete
    applyAnimation(dt) {
        if (this.animationQueue.length > 0) {
            if (this.animationQueue.peek().applyAnimationStep(dt)) {
                this.animationQueue.poll();
            }
        }
        return this.animationQueue.length === 0;
    }
}
class LinearAnimation {
    constructor(rect, duration, dx, dy, color) {
        this.complete = false;
        this.rect = rect;
        this.oldRectColor = rect.color;
        this.timeElapsed = 0;
        this.applyAnimationStep = function (dt) {
            if (this.complete)
                return true;
            if (this.timeElapsed + dt > duration) {
                this.complete = true;
                dt = duration - this.timeElapsed;
                rect.color = this.oldRectColor;
            }
            else {
                rect.color = color;
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
class ColorAnimation {
    constructor(rect, duration, color) {
        this.complete = false;
        this.rect = rect;
        this.oldRectColor = rect.color;
        this.timeElapsed = 0;
        this.applyAnimationStep = function (dt) {
            if (this.complete)
                return true;
            if (this.timeElapsed + dt > duration) {
                this.complete = true;
                dt = duration - this.timeElapsed;
                rect.color = this.oldRectColor;
            }
            else {
                rect.color = color;
            }
            this.timeElapsed += dt;
            return this.complete;
        };
    }
}
