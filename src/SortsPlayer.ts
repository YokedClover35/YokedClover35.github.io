"use strict";
class SortsPlayer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    sort: Sorts;
    sortType: string;
    renderQueue: Queue;
    rects: Rect[];
    marginFr = .1;
    gapFr = .2;

    prevTime:number = 0;

    constructor(canvas:HTMLCanvasElement, sortType:string = "insertion") {
        this.canvas = canvas;
        this.resizeCanvas();
        this.ctx = canvas.getContext("2d")!;
        this.sort = new Sorts();
        this.sortType = sortType;
        this.renderQueue = new Queue();
        this.rects = [];
        this.run();
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

    reset() {
        this.sort.skipToUnsorted();
        console.log(this.sort.getUnsorted());
        this.setRects(this.sort.getUnsorted());
        this.run()
    }

    applySort(A: Int32Array, sortName: string) {
        if (sortName == "selection") {
            
        } else if (sortName == "insertion") {
            this.sort.insertionSort(A, 0, A.length)
        }
    }

    setRects(A: Int32Array) {
        this.rects = [];
        let marginPx = this.canvas.clientWidth * this.marginFr;
        let usableWidth = this.canvas.clientWidth - (2 * marginPx);
        let rectWidth = usableWidth / ((this.gapFr + 1) * A.length - this.gapFr);
        console.log("rect width: " + rectWidth);
        console.log("usable: " + usableWidth + " calculated usable: " + (rectWidth * A.length + rectWidth * this.gapFr * (A.length - 1)));
        let currentXPos = this.canvas.clientWidth * this.marginFr;
        let stepSize = rectWidth * (1 + this.gapFr);
        for(let i = 0; i < A.length; i++) {
            this.rects.push(new Rect(A[i], currentXPos, this.canvas.clientHeight - marginPx, rectWidth, marginPx / 5 * A[i], "red"));
            currentXPos += stepSize;
        }
    }

    stepForward(n: number) {
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
        let now = performance.now();
        if (this.rects.length > 0) {
            this.applyAnimations(now - this.prevTime);
            this.renderFrame();
        }
        this.prevTime = now;
    }

    applyAnimations(dt: number) {
        let animationsComplete = true;
        for (let i = 0; i < this.rects.length; i++) {
            if (!this.rects[i].applyAnimation(dt)) {
                animationsComplete = false;
            }
        }
        if (animationsComplete && this.renderQueue.length > 0) {
            let action = this.renderQueue.poll();
            console.log(action.getDescription());
            this.addActionToRects(action);

        }
    }

    addActionToRects(action: Action) {
        let type = action.type;
        let i = action.i;
        let j = action.j;
        if (type == "swap") {
            let ix = this.rects[i].x;
            let iy = this.rects[i].y;
            let jx = this.rects[j].x;
            let jy = this.rects[j].y;
            this.rects[i].addAnimation(new LinearAnimation(this.rects[i], 200, jx - ix, jy - iy));
            this.rects[j].addAnimation(new LinearAnimation(this.rects[j], 200, ix - jx, iy - jy));
            let temp = this.rects[i];
            this.rects[i] = this.rects[j];
            this.rects[j] = temp;
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
            this.rects[i].draw(this.ctx, 0, 0);
            
        }
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    randomAnimation() {
        let index = Math.floor(Math.random() * this.rects.length);
        this.rects[index].addAnimation(new LinearAnimation(this.rects[index], 1000, Math.random() * 200 - 50, Math.random() * 200 - 50));
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
    applyAnimationStep: (dt:number) => boolean;
    constructor(rect:Rect, duration: number, dx:number, dy:number) {
        this.rect = rect;
        this.timeElapsed = 0;
        this.applyAnimationStep = function(dt:number): boolean {
            if (this.complete) return true;
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
        }
    }
}
