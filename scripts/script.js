const canvasId = "#canvas1";
const canvas = document.querySelector(canvasId);




//event listeners

window.addEventListener('resize', updateWindowSize, true);

function updateWindowSize(e) {
    canvas.width = this.window.innerWidth;
    canvas.height = this.window.innerHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    pointGrid.resize(canvasWidth, canvasHeight);
}

canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

let cursorX, cursorY, cursorDX, cursorDY = 0;
let button1, button2, button3 = false;
function setMousePosVel(e) {
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
    constructor(item, next) {
        this.item = item;
        this.next = next;
    }
    length() {
        if (this.isEmpty()) {
            return 0;
        }
        return 1 + this.next.length();

    }
    append(item) {
        if (this.isEmpty()) {
            this.item = item;
            this.next = new LinkedList();
        } else {
            this.next.append(item);
        }
    }
    removeItem(item) {
        if (this.isEmpty()) {
            return false;
        } else if (this.item == item) {
            this.remove();
            return true;
        }
        return this.next.removeItem(item);
    }
    remove() {
        this.item = this.next.item;
        this.next = this.next.next;
    }
    advance(n) {
        if (n <= 0) {
            return this;
        } else if (this.isEmpty()) {
            return undefined;
        } else {
            return this.next.advance(n - 1);
        }
    }
    at(p) {
        return this.advance(p).item;
    }
    isEmpty() {
        return this.item == undefined;
    }
}


//Tile class
class Tile {
    constructor() {
        this.points = new LinkedList(undefined, undefined);
        this.optimized = false;
        this.avgCenterX;
        this.avgCenterY;
        this.avgPoint = new Point(0,0,0,0,0);
        this.numPoints = 0;
    }

    addPoint(p) {
        this.numPoints++;
        this.points.append(p);
    }
    removePoint(p) {
        (this.points.removeItem(p)) ? this.numPoints-- : console.log("Could not remove point!");
    }
    calculateCenter() {
        let sublist = this.points;
        this.avgCenterX = 0;
        this.avgCenterY = 0;
        let count = 0;
        while (!sublist.isEmpty()) {
            this.avgCenterX += list.item.x;
            this.avgCenterY += list.item.y;
            sublist = sublist.entries;
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

    drawPoints(ctx) {
        let sublist = this.points;
        while (!sublist.isEmpty()) {
            let p = sublist.item;
            let vel = Math.sqrt(p.velX * p.velX + p.velY * p.velY);
            DrawHelper.drawCircle(p.x, p.y, p.radius, [(vel) * 10, (vel) * 10, 255]);
            sublist = sublist.next;
        }
    }
}


//Grid class
class ArrayGrid {
    constructor(tileSize) {
        this.tiles = [[]];
        this.xLength;
        this.yLength;
        this.tileSize = tileSize;
    }

    resize(width, height) {
        this.xLength = Math.floor(width / this.tileSize) + (width % this.tileSize == 0 ? 0 : 1) + 1;
        this.yLength = Math.floor(height / this.tileSize) + (height % this.tileSize == 0 ? 0 : 1) + 1;
        for (let i = 0; i < this.xLength; i++) {
            if (this.tiles[i] == undefined) {
                this.tiles.push([]);
            }
            for (let j = 0; j < this.yLength; j++) {
                if (this.tiles[i][j] == undefined) {
                    this.tiles[i].push(new Tile());
                }
            }
        }
    }

    init(pointCount, maxVel) {
        this.resize(canvasWidth, canvasHeight);
        this.initalizePoints(pointCount, maxVel);
    }


    initalizePoints(pointCount, maxVel) {
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

    moveAll(time) {
        for (let i = 0; i < this.xLength; i++) {
            for (let j = 0; j < this.yLength; j++) {
                let sublist = this.tiles[i][j].points;
                while (sublist != undefined && !sublist.isEmpty()) {
                    let p = sublist.item;
                    p.move(time); //this should also call this.moveOnGrid()
                    sublist = sublist.next;
                }
            }
        }
    }

    applyPhisicsAll(time) {
        for (let i = 0; i < this.xLength; i++) {
            for (let j = 0; j < this.yLength; j++) {
                let sublist = this.tiles[i][j].points;
                while (!sublist.isEmpty()) {
                    let p = sublist.item;
                    this.applyPhisicsPoint(time, p, i, j);
                    p.cursorColl();
                    sublist = sublist.next;
                }
            }
        }
    }

    applyPhisicsPoint(time, point, gx, gy) {
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
    applyPhisicsFromTile(time, point, tile) {
        if (tile.optimized) {
            point.collideWithPoint(time, tile.avgPoint, tile.pointCount);
        } else {
            let sublist = tile.points;
            while (!sublist.isEmpty()) {
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
    numPointsAt(gx, gy) {
        return this.tiles[gx][gy].numPoints;
    }

    /*
    moveOnGrid moves the given point p from one grid to another
    Precondition: x1, y1, x2, y2 >= 0; x1, x2 <= canvas.width; y1, y2 <= canvas.height
    Postcondition: point if moved from grid[gx1][gy1] to grid[gx2][gy2]
    */
    moveOnGrid(p, x1, y1, x2, y2) {
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
    addPointgc(p, gx, gy) {
        this.tiles[gx][gy].addPoint(p);
    }

    addPointac(p) {
        this.addPointgc(p, this.toGridCoord(p.x), this.toGridCoord(p.y));
    }

    /*
    removePointgc removes the given point from the given grid cordinates
    Precondition: gx, gy >= 0; gx <= grid.length; gy <= grid[0].length; grid[gx][gy] contains point p
    Postcondition: point p is removed from grid[gx][gy]
    */
    removePointgc(p, gx, gy) {
        this.tiles[gx][gy].removePoint(p);
    }

    removePointac(p) {
        this.removePointgc(p, this.toGridCoord(p.x), this.toGridCoord(p.y));
    }

    /*
    toGridCord returns the correct index if the grid's position on the canvas
    Precondition: n >= 0; n <= canvas's dimention
    */
    toGridCoord(n) {
        return Math.floor(n / this.tileSize);
    }

    drawAll(ctx) {
        for (let i = 0; i < this.xLength; i++) {
            for (let j = 0; j < this.yLength; j++) {
                this.tiles[i][j].drawPoints(ctx);
            }
        }
        if (debug) {
            this.drawDebug(ctx);
        }
    }

    drawDebug(ctx) {
        let margin = 0.05;
        let marginTrue = margin * this.tileSize;
        ctx.globalAlpha = 0.25;
        ctx.font = "20px serif";
        for (let i = 0; i < this.yLength; i++) {
            for (let j = 0; j < this.xLength; j++) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(this.tileSize * j + marginTrue, this.tileSize * i + marginTrue, this.tileSize - marginTrue * 2, this.tileSize - marginTrue * 2);
                ctx.fillStyle = 'black';
                ctx.fillText(this.numPointsAt(j, i), this.tileSize * j + marginTrue, this.tileSize * i + marginTrue + 20);
            }
        }
        ctx.globalAlpha = 1.0;
    }


}


//draw class
class DrawHelper {
    // drawing helper functions
    static drawCircle(x, y, size, color) {
        ctx.beginPath();
        ctx.fillStyle = this.colorToString(color);
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    static drawLine(x1, y1, x2, y2, lineWidth, lineCap) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap;
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    static drawShape(ctx, points, lineWidth, lineColor, fillColor) {
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

    static colorToString(color) {
        return `rgb(${color[0]},
                    ${color[1]},
                    ${color[2]})`;
    }

    static calculateShapeCenter(points) {
        let sumX = 0;
        let sumY = 0;
        let pointCount = points.length;
        for (let i = 0; i < pointCount; i++) {
            sumX += points[i].x;
            sumY += points[i].y;
        }
        return [sumX / pointCount, sumY / pointCount];
    }

    static calculateShapeColor(points, color1X, color2X, color1Y, color2Y) {
        let point = this.calculateShapeCenter(points);
        let color = [255, 19, 140]; //initialize color with 'error' color of pink
        for (let i = 0; i < 3; i++) {
            color[i] = (color1X[i] + color2X[i] + color1Y[i] + color2Y[i]) / 4; //average the color vectors for rgb
        }
        return color;
    }

    static drawLines(lines) {
        ctx.globalAlpha = 0.25;
        for (let i = 0; i < lines.length; i += 4) {
            this.drawLine(lines[i], lines[i + 1], lines[i + 2], lines[i + 3], 2, 'round');
        }
        ctx.globalAlpha = 1.0;
    }
}


//Point class
class Point {

    constructor(x, y, velX, velY, radius) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.radius = radius;
    }
    distToPoint(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
    distToXY(x, y) {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    }
    angleToPoint(other) {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }
    angleToXY(x, y) {
        return Math.atan2(y - this.y, x - this.x);
    }
    angleOf(x, y) {
        return Math.atan2(y, x);
    }
    accVA(mag, angle) {
        let fX = Math.cos(angle) * mag;
        let fY = Math.sin(angle) * mag;
        this.accXY(fX, fY);
    }
    accXY(fX, fY) {
        this.velX += fX;
        this.velY += fY;
    }
    saveLineTo(p) {
        lines.push(this.x);
        lines.push(this.y);
        lines.push(p.x);
        lines.push(p.y);
    }
    collideWithPoint(time, point, multiplier) {
        let distTo = this.distToPoint(point);
        if (distTo < pointGrid.tileSize) {
            this.accVA(.5 * time * this.calcForceFromPoint(distTo) * multiplier, this.angleToPoint(point));
            // if(i > 0 || i == 0 && j > -1) {
            //     this.saveLine(this, point);
            // }
        }
    }
    calcForceFromPoint(distance) {
        return -1 * Math.cos(Math.PI * distance / (2 * .8 * pointGrid.tileSize));
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
    calcCursorCarryForce(distance, maxDistance) {
        return (distance >= maxDistance) ? 0 : Math.sqrt(maxDistance - distance) / maxDistance;
    }
    calcCursorAttractionForce(distance, maxDistance) {

        //return Math.max(-(distance / maxDistance) + 0.25, 0); 
        // return Math.atan(-2 * Math.PI - distance) + Math.PI / 2;
        return (distance >= maxDistance) ? 0 : (1 - distance / maxDistance) * 0.5;
    }
    move(time) {
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
        this.reduceVel(time, 0.0025, 1);
    }
    reduceVel(time, factor, maxVel) {
        let abVelX = Math.abs(this.velX);
        let abVelY = Math.abs(this.velY);
        if (abVelX > maxVel) {
            this.velX = (this.velX < 0) ? -(maxVel + this.reduceLinear(factor, abVelX - maxVel)) : (maxVel + this.reduceLinear(factor, abVelX - maxVel));
        }
        if (abVelY > maxVel) {
            this.velY = (this.velY < 0) ? -(maxVel + this.reduceLinear(factor, abVelY - maxVel)) : (maxVel + this.reduceLinear(factor, abVelY - maxVel));
        }
    }
    reduceLinear(factor, val) {
        return val / (factor + 1);
    }
}




let running = true;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
canvas.width = this.window.innerWidth;
canvas.height = this.window.innerHeight;
canvasWidth = canvas.width;
canvasHeight = canvas.height;
// updateWindowSize(undefined);
// const pointMap = new Map();
console.log("canvas.width: " + canvas.width + " canvas.height " + canvas.height);
const pointGrid = new ArrayGrid(Math.max(canvas.width, canvas.height) / 20);
const pointCount = 500;
const pointCutoff = 3;
const timeStep = .5;
let totalFramerate = new Array(50).fill(0);
let stepFramerate = new Array(50).fill(0);
let stepFrametime = new Array(50).fill(0);
let index = 0;
// const points = [];
// let lines = [];
const debug = false;
const pointRadius = 10;
let maxCursorInteractionDistance = 1000;
let cursorRingDistance = maxCursorInteractionDistance / 4;

// Initialize the context
const ctx = canvas.getContext("2d");
// updateWindowSize();

function test() {
    let list = new LinkedList(undefined, undefined);
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
    drawFrameTime("Total", 0, dt, totalFramerate);
    index ++;
}

function stop() {
    running = false;
}

function step() {
    let start = Date.now();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    pointGrid.drawAll(ctx);
    pointGrid.moveAll(timeStep);
    pointGrid.applyPhisicsAll(timeStep);
    let dt = Date.now() - start;
    drawFrameTime("Step", 60, dt, stepFrametime);    
    // updateAll(timeStep);
    // drawLines(lines);
    //console.log(lines);
    //containsRepeatingLines(lines);
    // lines = [];


}

function drawFrameTime(title, y, dt, times) {
    times[index %= times.length] = dt;
    ctx.fillStyle = 'black';
    ctx.font = "20px serif";
    let margin = 20;
    ctx.fillText(title + " ms: " + avgArray(times), margin, margin + y);
    ctx.fillText(title + " fps: " + (1000/ avgArray(times)), margin, margin + y + 30);
}

function avgArray(A) {
    let sum = 0;
    for (let i = 0; i < A.length; i++) {
        sum += A[i];
    }
    return sum / A.length;
}







//line helper functions
function containsRepeatingLines(lines) {
    let testMap = new Set();
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

function xyxyHash(x1, y1, x2, y2) {
    return (x1 << 24) + (y1 << 16) + (x2 << 8) + y2;
}


