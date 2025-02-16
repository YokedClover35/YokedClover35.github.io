const canvasId = "#canvas1";
const canvas = document.querySelector(canvasId) as HTMLCanvasElement;
// Initialize the context
const ctx = canvas.getContext("2d")!;

//event listeners

window.addEventListener('resize', updateWindowSize, true);

function updateWindowSize(this: any, e:Event) {
    canvas.width = this.window.innerWidth;
    canvas.height = this.window.innerHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    pointGrid.resize(canvasWidth, canvasHeight);
}

canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

let cursorX:number, cursorY:number, cursorDX:number, cursorDY:number = 0;
let button1:boolean, button2:boolean, button3:boolean = false;
function setMousePosVel(e:MouseEvent) {
    cursorX = e.offsetX;
    cursorY = e.offsetY;
    cursorDX = e.movementX;
    cursorDY = e.movementY;
    //console.log("x: " + cursorX + " y: " + cursorY + "\nvelX: " + cursorDX + " velY: " + cursorDY);
}

canvas.addEventListener("mousemove", setMousePosVel);
canvas.addEventListener("mouseenter", setMousePosVel);
canvas.addEventListener("mouseleave", setMousePosVel);


canvas.addEventListener("mousedown", function (e) {
    switch (e.button) {
        case 0:
            button1 = true;
            break;
        case 1:
            e.preventDefault();
            button2 = true;
            break;
        case 2:
            button3 = true;
            break;
    }
});

canvas.addEventListener("mouseup", function (e) {
    switch (e.button) {
        case 0:
            button1 = false;
            break;
        case 1:
            button2 = false;
            break;
        case 2:
            e.preventDefault();
            button3 = false;
            break;
    }
});

canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    maxCursorInteractionDistance -= e.deltaY;
    console.log(maxCursorInteractionDistance);
});





//LinkedList class
class LinkedList {
    item:any | null = null;
    next:LinkedList | null = null;
    constructor(item:any, next:LinkedList | null = null) {
        this.item = item;
        this.next = next;
    }
    length():number {
        if (this.next === null || this.item === null) {
            return 0;
        } 
        return 1 + this.next.length();
    }
    append(item:any) {
        if (this.next === null || this.item === null) {
            this.item = item;
            this.next = new LinkedList(null, null);
        } else if (this.next != null) {
            this.next.append(item);
        } else {
            console.error("Attempted to append to null, LinkedList.isEmpty() must be broken");
        }
    }
    removeItem(item:any):boolean {
        if (this.next === null || this.item === null) {
            return false;
        } else if (this.item == item) {
            this.remove();
            return true;
        }
        return this.next.removeItem(item);
    }
    remove() {
        if (this.next !== null && this.item !== null) {
        this.item = this.next.item;
        this.next = this.next.next;
        }
    }
    advance(n:number):LinkedList | null {
        if (n <= 0) {
            return this;
        } else if (this.next === null || this.item === null) {
            return null;
        } else {
            return this.next.advance(n - 1);
        }
    }
    at(p:number):any {
        let sublist = this.advance(p);
        return (sublist === null) ? null : sublist.item;
    }
    isEmpty() {
        return this.item === null;
    }
}


//Tile class
class Tile {
    points:LinkedList;
    optimized:boolean;
    avgCenterX:number;
    avgCenterY:number;
    avgPoint:Point;
    numPoints:number;
    constructor() {
        this.points = new LinkedList(null, null);
        this.optimized = false;
        this.avgCenterX = -1;
        this.avgCenterY = -1;
        this.avgPoint = new Point(0,0,0,0,0);
        this.numPoints = 0;
    }

    addPoint(p:Point) {
        this.numPoints++;
        this.points.append(p);
    }
    removePoint(p:Point) {
        (this.points.removeItem(p)) ? this.numPoints-- : console.log("Could not remove point!");
    }
    calculateCenter() {
        let sublist:LinkedList | null = this.points;
        this.avgCenterX = 0;
        this.avgCenterY = 0;
        let count = 0;
        while (sublist !== null && !sublist.isEmpty()) {
            this.avgCenterX += sublist.item.x;
            this.avgCenterY += sublist.item.y;
            sublist = sublist.next;
            count++;
        }
        if (count == 0 || count != this.numPoints) {
            console.log("point sount and true count are different! numPoints: " + this.numPoints + " trueCount: " + count);
        } else {
            this.avgCenterX /= count;
            this.avgCenterY /= count;
        }
        this.avgPoint.x = this.avgCenterX;
        this.avgPoint.y = this.avgCenterY;
    }

    drawPoints(ctx:CanvasRenderingContext2D) {
        let sublist:LinkedList | null = this.points;
        while (sublist !== null && !sublist.isEmpty()) {
            let p = sublist.item;
            let vel = Math.sqrt(p.velX * p.velX + p.velY * p.velY);
            DrawHelper.drawCircle(p.x, p.y, p.radius, [255, (vel) * 10, (vel) * 10]);
            sublist = sublist.next;
        }
    }
}

//Line class
class Line{
    x1:number;
    y1:number;
    x2:number;
    y2:number;
    constructor(x1:number, y1:number, x2:number, y2:number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

    }
    draw(width:number) {
        DrawHelper.drawLine(this.x1, this.y1, this.x2, this.y2, width, 'round', [0, 0, 0])
    }
}


//Grid class
class ArrayGrid {
    tiles:Tile[][];
    lines:Line[];
    xLength:number;
    yLength:number;
    tileSize:number;
    constructor(tileSize:number) {
        this.tiles = [[]];
        this.lines = [];
        this.xLength = 0;
        this.yLength = 0;
        this.tileSize = tileSize;
    }

    resize(width:number, height:number) {
        this.xLength = Math.floor(width / this.tileSize) + (width % this.tileSize == 0 ? 0 : 1) + 1;
        this.yLength = Math.floor(height / this.tileSize) + (height % this.tileSize == 0 ? 0 : 1) + 1;
        for (let i = 0; i < this.xLength; i++) {
            if (this.tiles[i] == null) {
                this.tiles.push([]);
            }
            for (let j = 0; j < this.yLength; j++) {
                if (this.tiles[i][j] == null) {
                    this.tiles[i].push(new Tile());
                }
            }
        }
    }

    init(pointCount:number, maxVel:number) {
        this.resize(canvasWidth, canvasHeight);
        this.initalizePoints(pointCount, maxVel);
    }


    initalizePoints(pointCount:number, maxVel:number) {
        console.log("canvasWidth: " + canvasWidth + " canvasHeight: " + canvasHeight);
        console.log("tileSize: " + this.tileSize);
        for (let i = 0; i < pointCount; i++) {
            let point = new Point(Math.floor(Math.random() * canvasWidth),
                Math.floor(Math.random() * canvasHeight),
                (Math.random() * maxVel * 2) - maxVel,
                (Math.random() * maxVel * 2) - maxVel,
                pointRadius);
            this.addPointac(point);
            console.log("Initalization Done!");
        }
    }

    optimizeTiles() {
        for (let i = 0; i < this.xLength; i++) {
            for (let j = 0; j < this.yLength; j++) {
                if(this.tiles[i][j].numPoints > pointCutoff) {
                    this.tiles[i][j].calculateCenter();
                    this.tiles[i][j].optimized = true;
                } else {
                    this.tiles[i][j].optimized = false;
                }
            }
        }
    }

    moveAll(time:number) {
        for (let i = 0; i < this.xLength; i++) {
            for (let j = 0; j < this.yLength; j++) {
                let sublist:LinkedList | null = this.tiles[i][j].points;
                while (sublist !== null && !sublist.isEmpty()) {
                    let p = sublist.item;
                    p.move(time); //this should also call this.moveOnGrid()
                    sublist = sublist.next;
                }
            }
        }
    }

    applyPhisicsAll(time:number) {
        for (let i = 0; i < this.xLength; i++) {
            for (let j = 0; j < this.yLength; j++) {
                let sublist:LinkedList | null = this.tiles[i][j].points;
                while (sublist !== null && !sublist.isEmpty()) {
                    let p = sublist.item;
                    this.applyPhisicsPoint(time, p, i, j);
                    p.cursorColl();
                    sublist = sublist.next;
                }
            }
        }
    }

    applyPhisicsPoint(time:number, point:Point, gx:number, gy:number) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let gx1 = i + gx;
                let gy1 = j + gy;
                if (gx1 >= 0 && gy1 >= 0 && gx1 < this.xLength && gy1 < this.yLength) {
                    this.applyPhisicsFromTile(time, point, this.tiles[gx1][gy1]);
                }
            }
        }
    }
    applyPhisicsFromTile(time:number, point:Point, tile:Tile) {
        if (tile.optimized) {
            point.collideWithPoint(time, tile.avgPoint, tile.numPoints);
        } else {
            let sublist:LinkedList | null = tile.points;
            while (sublist !== null && !sublist.isEmpty()) {
                if (point != sublist.item) {
                    point.collideWithPoint(time, sublist.item, 1);
                }
                sublist = sublist.next;
            }
        }

    }


    /*
    numPointsOnGridAt returns the number of points at the given location
    Precondition: gx, gy >= 0; gx <= grid.length; gy <= grid[0].length
    Postcondition: nothing is changed
    */
    numPointsAt(gx:number, gy:number) {
        return this.tiles[gx][gy].numPoints;
    }

    /*
    moveOnGrid moves the given point p from one grid to another
    Precondition: x1, y1, x2, y2 >= 0; x1, x2 <= canvas.width; y1, y2 <= canvas.height
    Postcondition: point if moved from grid[gx1][gy1] to grid[gx2][gy2]
    */
    moveOnGrid(p:Point, x1:number, y1:number, x2:number, y2:number) {
        let gx1 = this.toGridCoord(x1);
        let gy1 = this.toGridCoord(y1);
        let gx2 = this.toGridCoord(x2);
        let gy2 = this.toGridCoord(y2);
        if (gx1 != gx2 || gy1 != gy2) {
            this.removePointgc(p, gx1, gy1);
            this.addPointgc(p, gx2, gy2);
            return true;
        }
        return false;
    }

    /*
    addPointgc adds the given point to the given grid cordinates
    Precondition: gx, gy >= 0; gx <= grid.length; gy <= grid[0].length
    Postcondition: a new point is added to grid[gx][gy]
    */
    addPointgc(p:Point, gx:number, gy:number) {
        this.tiles[gx][gy].addPoint(p);
    }

    addPointac(p:Point) {
        this.addPointgc(p, this.toGridCoord(p.x), this.toGridCoord(p.y));
    }

    /*
    removePointgc removes the given point from the given grid cordinates
    Precondition: gx, gy >= 0; gx <= grid.length; gy <= grid[0].length; grid[gx][gy] contains point p
    Postcondition: point p is removed from grid[gx][gy]
    */
    removePointgc(p:Point, gx:number, gy:number) {
        this.tiles[gx][gy].removePoint(p);
    }

    removePointac(p:Point) {
        this.removePointgc(p, this.toGridCoord(p.x), this.toGridCoord(p.y));
    }

    /*
    toGridCord returns the correct index if the grid's position on the canvas
    Precondition: n >= 0; n <= canvas's dimention
    */
    toGridCoord(n:number) {
        return Math.floor(n / this.tileSize);
    }

    drawAll(ctx:CanvasRenderingContext2D) {
        for (let i = 0; i < this.xLength; i++) {
            for (let j = 0; j < this.yLength; j++) {
                this.tiles[i][j].drawPoints(ctx);
                this.saveLinesForTile(this.tiles[i][j], i, j);
            }
        }
        if (debug) {
            this.drawDebug(ctx);
        }
    }

    saveLinesForTile(tile:Tile, gx:number, gy:number) {
        let tilesToCheck = [
            1,0,
            -1,-1,
            0,-1,
            1,-1
        ]
        //do same tile connections
        for(let subArray1:LinkedList | null = tile.points; subArray1 !== null && !subArray1.isEmpty(); subArray1 = subArray1.next) {
            for(let subArray2:LinkedList | null = subArray1.next; subArray2 !== null && !subArray2.isEmpty(); subArray2 = subArray2.next) {
                this.saveLine(subArray1.item, subArray2.item);
            }
        }
        //do other tile connections
        for(let i = 0; i < tilesToCheck.length; i+= 2) {
            let cx = tilesToCheck[i] + gx;
            let cy = tilesToCheck[i + 1] + gy;
            if(cx >= 0 && cx < this.xLength && cy >= 0 && cy < this.yLength) {
                let tile1 = this.tiles[cx][cy];
                for(let subArray1:LinkedList | null = tile.points; subArray1 !== null && !subArray1.isEmpty(); subArray1 = subArray1.next) {
                    for(let subArray2:LinkedList | null = tile1.points; subArray2 !== null && !subArray2.isEmpty(); subArray2 = subArray2.next) {
                        this.saveLine(subArray1.item, subArray2.item);
                    }
                }
            }
        }
    }

    saveLine(p1:Point, p2:Point) {
        if(p1.distToPoint(p2) <= this.tileSize) {
            this.lines.push(new Line(p1.x, p1.y, p2.x, p2.y));
        }
    }

    drawLines(ctx:CanvasRenderingContext2D) {
        for(let i = 0; i < this.lines.length; i++) {
            this.lines[i].draw(1);
        }
        this.lines = [];
    }

    drawDebug(ctx:CanvasRenderingContext2D) {
        let margin = 0.05;
        let marginTrue = margin * this.tileSize;
        ctx.globalAlpha = 0.25;
        ctx.font = "20px serif";
        for (let i = 0; i < this.yLength; i++) {
            for (let j = 0; j < this.xLength; j++) {
                ctx.fillStyle = (this.tiles[j][i].optimized) ? 'green' : 'blue';
                ctx.fillRect(this.tileSize * j + marginTrue, this.tileSize * i + marginTrue, this.tileSize - marginTrue * 2, this.tileSize - marginTrue * 2);
                ctx.fillStyle = 'black';
                ctx.fillText(`${this.numPointsAt(j, i)}`, this.tileSize * j + marginTrue, this.tileSize * i + marginTrue + 20);
            }
        }
        ctx.globalAlpha = 1.0;
        DrawHelper.drawCircle(cursorX, cursorY, 10, [0,0,0]);
        DrawHelper.drawLine(cursorX, cursorY, cursorX + 10 * cursorDX, cursorY + 10 * cursorDY, 3, 'round', [0, 255, 0]);

    }


}


//draw class
class DrawHelper {
    // drawing helper functions
    static drawCircle(x:number, y:number, size:number, color:number[]) {
        ctx.beginPath();
        ctx.fillStyle = this.colorToString(color);
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    static drawLine(x1:number, y1:number, x2:number, y2:number, lineWidth:number, lineCap:CanvasLineCap, color:number[]) {
        ctx.strokeStyle = this.colorToString(color);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap;
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    static drawShape(points:Point[], lineWidth:number, lineColor:number[], fillColor:number[]) {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = this.colorToString(lineColor);
        ctx.fillStyle = this.colorToString(fillColor);
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    static colorToString(color:number[]):string {
        return `rgb(${color[0]},
                    ${color[1]},
                    ${color[2]})`;
    }

    static calculateShapeCenter(points:Point[]) {
        let sumX = 0;
        let sumY = 0;
        let pointCount = points.length;
        for (let i = 0; i < pointCount; i++) {
            sumX += points[i].x;
            sumY += points[i].y;
        }
        return [sumX / pointCount, sumY / pointCount];
    }

    static calculateShapeColor(points:Point[], color1X:number[], color2X:number[], color1Y:number[], color2Y:number[]) {
        let point = this.calculateShapeCenter(points);
        let color = [255, 19, 140]; //initialize color with 'error' color of pink
        for (let i = 0; i < 3; i++) {
            color[i] = (color1X[i] + color2X[i] + color1Y[i] + color2Y[i]) / 4; //average the color vectors for rgb
        }
        return color;
    }
}


//Point class
class Point {
    x:number;
    y:number;
    velX:number;
    velY:number;
    radius:number;
    constructor(x:number, y:number, velX:number, velY:number, radius:number) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.radius = radius;
    }
    distToPoint(other:Point) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
    distToXY(x:number, y:number) {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    }
    angleToPoint(other:Point) {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }
    angleToXY(x:number, y:number) {
        return Math.atan2(y - this.y, x - this.x);
    }
    angleOf(x:number, y:number) {
        return Math.atan2(y, x);
    }
    accVA(mag:number, angle:number) {
        let fX = Math.cos(angle) * mag;
        let fY = Math.sin(angle) * mag;
        this.accXY(fX, fY);
    }
    accXY(fX:number, fY:number) {
        this.velX += fX;
        this.velY += fY;
    }
    collideWithPoint(time:number, point:Point, multiplier:number) {
        let distTo = this.distToPoint(point);
        if (distTo < pointGrid.tileSize) {
            this.accVA(.5 * time * this.calcForceFromPoint(distTo) * multiplier, this.angleToPoint(point));
            // if(i > 0 || i == 0 && j > -1) {
            //     this.saveLine(this, point);
            // }
        }
    }
    calcForceFromPoint(distance:number) {
        return -5 * Math.cos(Math.PI * distance / (2 * .8 * pointGrid.tileSize));
        //return -0.1 * (1 - distance / pointGrid.tileSize);
    }
    cursorColl() {

        if (!(button1 || button2 || button3) && (Math.abs(cursorDX) > 0 || Math.abs(cursorDY) > 0)) {
            let distTo = this.distToXY(cursorX, cursorY);
            let force = this.calcCursorCarryForce(distTo, 100);
            this.accXY(cursorDX * force, cursorDY * force);

        } else if (button1) {
            let distTo = this.distToXY(cursorX, cursorY);
            let force = this.calcCursorAttractionForce(distTo, maxCursorInteractionDistance);
            let angle = this.angleToXY(cursorX, cursorY);
            this.accVA(force, angle);
        } else if (button2) {
            let distTo = this.distToXY(cursorX, cursorY);

            let force = (distTo < cursorRingDistance) ? -this.calcCursorAttractionForce(distTo, maxCursorInteractionDistance) : this.calcCursorAttractionForce(distTo, maxCursorInteractionDistance);
            let angle = this.angleToXY(cursorX, cursorY);
            this.accVA(force, angle);
        } else if (button3) {
            let distTo = this.distToXY(cursorX, cursorY);
            let force = -this.calcCursorAttractionForce(distTo, maxCursorInteractionDistance);
            let angle = this.angleToXY(cursorX, cursorY);
            this.accVA(force, angle);
        }

    }
    calcCursorCarryForce(distance:number, maxDistance:number) {
        return (distance >= maxDistance) ? 0 : Math.sqrt(maxDistance - distance) / maxDistance;
    }
    calcCursorAttractionForce(distance:number, maxDistance:number) {

        //return Math.max(-(distance / maxDistance) + 0.25, 0); 
        // return Math.atan(-2 * Math.PI - distance) + Math.PI / 2;
        return (distance >= maxDistance) ? 0 : (1 - distance / maxDistance) * 0.5;
    }
    move(time:number) {
        let prevX = this.x;
        let prevY = this.y;
        let dX = this.velX * time;
        if (this.x + dX > canvasWidth - this.radius) {
            this.x += canvasWidth - this.radius - this.x - dX;
            this.velX *= -0.75;
        } else if (this.x + dX < this.radius) {
            this.x += this.radius - dX - this.x;
            this.velX *= -0.75;
        } else {
            this.x += dX;
        }

        let dY = this.velY * time;
        if (this.y + dY > canvasHeight - this.radius) {
            this.y += canvasHeight - this.radius - this.y - dY;
            this.velY *= -0.75;
        } else if (this.y + dY < this.radius) {
            this.y += this.radius - dY - this.y;
            this.velY *= -0.75;
        } else {
            this.y += dY;
        }
        pointGrid.moveOnGrid(this, prevX, prevY, this.x, this.y);
        this.reduceVel(time, 0.01, 0);
    }
    reduceVel(time:number, factor:number, maxVel:number) {
        let abVelX = Math.abs(this.velX);
        let abVelY = Math.abs(this.velY);
        if (abVelX > maxVel) {
            this.velX = (this.velX < 0) ? -(maxVel + this.reduceLinear(factor, abVelX - maxVel)) : (maxVel + this.reduceLinear(factor, abVelX - maxVel));
        }
        if (abVelY > maxVel) {
            this.velY = (this.velY < 0) ? -(maxVel + this.reduceLinear(factor, abVelY - maxVel)) : (maxVel + this.reduceLinear(factor, abVelY - maxVel));
        }
    }
    reduceLinear(factor:number, val:number) {
        return val / (factor + 1);
    }
}

function getEmptyArray(n:number) {
    return new Int32Array(1);
}



let running = true;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
canvas.width = this.window.innerWidth;
canvas.height = this.window.innerHeight;
canvasWidth = canvas.width;
canvasHeight = canvas.height;
// updateWindowSize(null);
// const pointMap = new Map();
console.log("canvas.width: " + canvas.width + " canvas.height " + canvas.height);
const pointGrid = new ArrayGrid(Math.max(canvas.width, canvas.height) / 10);
const pointCount = 50;
const pointCutoff = 3;
const timeStep = .5;
let totalFramerate = new Int32Array(50);
let stepFramerate = new Int32Array(50);
let stepFrametime = new Int32Array(50);
let index = 0;
// const points = [];
// let lines = [];
const debug = true;
const showFps = false;
const pointRadius = 5;
let maxCursorInteractionDistance = 1000;
let cursorRingDistance = maxCursorInteractionDistance / 4;

// updateWindowSize();

function test() {
    let list = new LinkedList(null, null);
    let p = new Point(1,1,0,0,10);
    let p2 = new Point(2,2,0,0,10);
    list.append(p2)
    list.append(p);
    console.log("remove sucessful: " + list.removeItem(p));
    console.log(list);
    console.log(list.isEmpty());
    console.log("length: " + list.length() + " item: " + list.item);
    // list.append(p);
    // list.append(p);
    // console.log("length: " + list.length() + " item: " + list.item);
    // list.removeItem(p);
    // console.log("length: " + list.length() + " item: " + list.item);


}
//test();
let prevTime = Date.now();

function main() {
    
    console.log("canvasWidth: " + canvasWidth + " canvasHeight: " + canvasHeight);
    pointGrid.init(pointCount, 2);
    //testInit();
    for (let i = 0; i < 1; i++) {
        step();
    }

    run();
}
main();



function run() {
    step();
    if(running) {
        requestAnimationFrame(run);
    }
    let dt = Date.now() - prevTime;
    prevTime = Date.now()
    if(showFps) {
    drawFrameTime("Total", 0, dt, totalFramerate);
    index ++;
    }
}

function stop() {
    running = false;
}

function step() {
    let start = Date.now();
    // ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // pointGrid.optimizeTiles();
    pointGrid.applyPhisicsAll(timeStep);
    pointGrid.moveAll(timeStep);
    pointGrid.drawAll(ctx);
    pointGrid.drawLines(ctx)
    let dt = Date.now() - start;
    if(showFps) {
    drawFrameTime("Step", 60, dt, stepFrametime);    
    }
    // updateAll(timeStep);
    // drawLines(lines);
    //console.log(lines);
    //containsRepeatingLines(lines);
    // lines = [];


}

function drawFrameTime(title:string, y:number, dt:number, times:Int32Array) {
    times[index %= times.length] = dt;
    ctx.fillStyle = 'black';
    ctx.font = "20px serif";
    let margin = 20;
    ctx.fillText(title + " ms: " + avgArray(times), margin, margin + y);
    ctx.fillText(title + " fps: " + (1000/ avgArray(times)), margin, margin + y + 30);
}

function avgArray(A:Int32Array) {
    let sum = 0;
    for (let i = 0; i < A.length; i++) {
        sum += A[i];
    }
    return sum / A.length;
}







//line helper functions
function containsRepeatingLines(lines:number[]) {
    let testMap:Set<number> = new Set();
    let i = 0;
    let found = false;
    while (i < lines.length && !found) {
        let x1 = lines[i];
        let y1 = lines[i + 1];
        let x2 = lines[i + 2];
        let y2 = lines[i + 3];
        if (x2 > x1) {
            let tx = x1;
            let ty = y1;
            x1 = x2;
            y1 = y2;
            x2 = tx;
            y2 = ty;
        }
        let hash = xyxyHash(Math.floor(x1), Math.floor(y1), Math.floor(x2), Math.floor(y2));
        if (testMap.has(hash)) {
            found = true;
        } else {
            testMap.add(hash);
        }
        i += 4;
    }
    console.log((!found) ? "No repeating lines!" : "Repeating Lines Found!");
}

function xyxyHash(x1:number, y1:number, x2:number, y2:number) {
    return (x1 << 24) + (y1 << 16) + (x2 << 8) + y2;
}

