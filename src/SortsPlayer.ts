"use strict";
class SortsPlayer {
    id: string;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    sort: Sorts;
    sortType: string;
    renderQueue: Queue;
    rects: Rect[];
    tempRects: Rect[];
    marginFr = .05;
    gapFr = .2;
    defaultAnimationSpeed = 200;
    offsetX = 0;
    offsetY = 0;
    recursiveOffset = 50;

    paused = true;
    prevTime:number = 0;

    running = true;
    repeat = false;

    constructor(canvas:HTMLCanvasElement, sortType:string = "insertion", id: string) {
        this.id = id;
        this.canvas = canvas;
        this.resizeCanvas();
        this.ctx = canvas.getContext("2d")!;
        this.sort = new Sorts();
        this.sortType = sortType;
        this.renderQueue = new Queue();
        this.rects = [];
        this.tempRects = [];
        this.run();
    }

    equals(id: string): boolean {
        return this.id == id;
    }

    loadRandomArray(length: number, min: number, max: number) {
        let A = new Int32Array(length);
        for (let i = 0; i < A.length; i++) {
            A[i] = Math.floor(Math.random() * Math.abs(min + max)) + min;
        }
        this.applySort(A, this.sortType);
        this.setRects(this.sort.getUnsorted());
    }

    loadArrayFromString(Str: string) {
        let AStr = Str.split(",");
        let A = new Int32Array(AStr.length);
        for (let i = 0; i < AStr.length; i++) {
            A[i] = parseInt(AStr[i]);
        }
        this.applySort(A, this.sortType);
        this.setRects(this.sort.getUnsorted());
    }
    
    skipToUnsorted() {
        this.reset();
        this.offsetX = 0;
        this.offsetY = 0;
    }

    skipToSorted() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.sort.skipToSorted();
        console.log(this.sort.getSorted());
        this.setRects(this.sort.getSorted());
        this.run();
    }

    reset() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.sort.skipToUnsorted();
        this.setRects(this.sort.getUnsorted());
        this.run();
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

    setAnimationSpeed(ms: number) {
        this.defaultAnimationSpeed = ms;
    }

    applySort(A: Int32Array, sortName: string) {
        if (sortName == "insertion") {
            this.sort.insertionSort(A, 0, A.length);
        } else if (sortName == "quick") {
            this.sort.quickSort(A, 0, A.length);
        } else {
            this.sort.insertionSort(A, 0, A.length);
        }
    }

    setRects(A: Int32Array) {
        this.rects = [];
        this.tempRects = [];
        let marginPx = this.canvas.clientWidth * this.marginFr;
        let usableWidth = this.canvas.clientWidth - (2 * marginPx);
        let usableHeight = this.canvas.clientHeight - (2 * marginPx);
        let rectHeightStep = usableHeight / this.maxOf(A);
        let rectWidth = usableWidth / ((this.gapFr + 1) * A.length - this.gapFr);
        let currentXPos = this.canvas.clientWidth * this.marginFr;
        let stepSize = rectWidth * (1 + this.gapFr);
        for(let i = 0; i < A.length; i++) {
            this.rects.push(new Rect(A[i], currentXPos, this.canvas.clientHeight - marginPx, rectWidth, rectHeightStep * A[i], "red"));
            this.tempRects.push(new Rect(0, currentXPos, this.canvas.clientHeight - marginPx - this.recursiveOffset, rectWidth, rectHeightStep * 2, "blue"))
            currentXPos += stepSize;
        }
    }

    maxOf(A: Int32Array): number {
        let max = -Infinity; 
        for (let i = 0; i < A.length; i++) {
            max = Math.max(max, A[i]);
        }
        return max;
    }

    stepForward(n: number) {
        let temp = this.sort.stepForward(n);
        for (let i = 0; i < temp.length; i++) {
            this.renderQueue.appendItem(temp[i]);
        }
        if (this.repeat && this.renderQueue.length === 0) {
            this.reset();
        }
    }

    stepBackward(n: number) {
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

    applyAnimations(dt: number) {
        let animationsComplete = true;
        for (let i = 0; i < this.rects.length; i++) {
            if (!this.rects[i].applyAnimation(dt) || !this.tempRects[i].applyAnimation(dt)) {
                animationsComplete = false;
            }
        } if (animationsComplete) {
            if (!this.paused && this.renderQueue.length === 0) {
                this.stepForward(1);
            }
            if (this.renderQueue.length > 0) {
                let action = this.renderQueue.poll();
                this.addActionToRects(action);
            }
        }
        
        
    }

    addActionToRects(action: Action) {
        let type = action.type;
        let i = action.i;
        let j = action.j;
        console.log(type);
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
        } else if (type == "tempSwap") {
            let ix = this.rects[i].x;
            let iy = this.rects[i].y;
            let jx = this.tempRects[j].x;
            let jy = this.tempRects[j].y;
            this.rects[i].addAnimation(new LinearAnimation(this.rects[i], this.defaultAnimationSpeed, jx - ix, jy - iy, "green"));
            this.tempRects[j].addAnimation(new LinearAnimation(this.tempRects[j], this.defaultAnimationSpeed, ix - jx, iy - jy, "green"));
            let temp = this.rects[i];
            this.rects[i] = this.tempRects[j];
            this.tempRects[j] = temp;
        } else if (type == "comparison" && this.defaultAnimationSpeed > 10) {
            this.rects[i].addAnimation(new ColorAnimation(this.rects[i], this.defaultAnimationSpeed, "blue"));
            this.rects[j].addAnimation(new ColorAnimation(this.rects[j], this.defaultAnimationSpeed, "blue"));
        } else if (type == "recursiveDown") {
            for(let index = i; index < j; index++) {
                this.rects[index].addAnimation(new LinearAnimation(this.rects[index], this.defaultAnimationSpeed, 0, this.recursiveOffset, "orange"));
                this.tempRects[index].addAnimation(new LinearAnimation(this.tempRects[index], this.defaultAnimationSpeed, 0, this.recursiveOffset, "orange"));
            }
            this.offsetY += this.recursiveOffset;
        } else if (type == "recursiveUp") {
            for(let index = i; index < j; index++) {
                this.rects[index].addAnimation(new LinearAnimation(this.rects[index], this.defaultAnimationSpeed, 0, -this.recursiveOffset, "orange"));
                this.tempRects[index].addAnimation(new LinearAnimation(this.tempRects[index], this.defaultAnimationSpeed, 0, -this.recursiveOffset, "orange"));
            }
            this.offsetY -= this.recursiveOffset;
        } else if (type == "retrieveTemp") {
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
            this.rects[i].draw(this.ctx, this.offsetX, this.offsetY);
            this.tempRects[i].draw(this.ctx, this.offsetX, this.offsetY);
            
        }
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

}

class Rect {
    value: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    animationQueue: Queue = new Queue;
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

    addAnimation(animation: RectAnimation) {
        this.animationQueue.appendItem(animation);
    }
    // retruns true if all animations are complete
    applyAnimation(dt:number): boolean {
        if(this.animationQueue.length > 0) {
            if (this.animationQueue.peek().applyAnimationStep(dt))  {
                this.animationQueue.poll();
            }
        }
        return this.animationQueue.length === 0;
    }
}

interface RectAnimation {
    applyAnimationStep: (dt:number) => boolean;
}

class LinearAnimation implements RectAnimation {
    rect: Rect;
    timeElapsed: number;
    complete = false;
    oldRectColor: string;
    applyAnimationStep: (dt:number) => boolean;
    constructor(rect:Rect, duration: number, dx:number, dy:number, color: string) {
        this.rect = rect;
        this.oldRectColor = rect.color;
        this.timeElapsed = 0;
        this.applyAnimationStep = function(dt:number): boolean {
            if (this.complete) return true;
            if (this.timeElapsed + dt > duration) {
                this.complete = true;
                dt = duration - this.timeElapsed;
                rect.color = this.oldRectColor;
            } else {
                rect.color = color;
            }
            let dxdt = dx / duration;
            let dydt = dy / duration;
            this.rect.x += dxdt * dt;
            this.rect.y += dydt * dt;
            this.timeElapsed += dt;
            return this.complete;
        }
    }
}

class ColorAnimation implements RectAnimation {
    rect: Rect;
    timeElapsed: number;
    complete = false;
    oldRectColor: string;
    applyAnimationStep: (dt:number) => boolean;
    constructor(rect:Rect, duration: number, color: string) {
        this.rect = rect;
        this.oldRectColor = rect.color;
        this.timeElapsed = 0;
        this.applyAnimationStep = function(dt:number): boolean {
            if (this.complete) return true;
            if (this.timeElapsed + dt > duration) {
                this.complete = true;
                dt = duration - this.timeElapsed;
                rect.color = this.oldRectColor;
            } else {
                rect.color = color;
            }
            this.timeElapsed += dt;
            return this.complete;
        }
    }
}
