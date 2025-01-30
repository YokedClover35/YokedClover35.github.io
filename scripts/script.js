const canvasId = "#canvas1";
const canvas = document.querySelector(canvasId);



//event listeners

window.addEventListener('resize', function (event) {
    updateWindowSize();
}, true);

canvas.addEventListener('contextmenu', function(event) {
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

canvas.addEventListener("wheel", function(e) {
    e.preventDefault();
    maxCursorInteractionDistance -= e.deltaY;
    console.log(maxCursorInteractionDistance);
})





//LinkedList class
class LinkedList{
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
    remove() {
        this.item = this.next().item();
        this.next = this.next().next;
    }
    advance(n) {
        if (n <= 0) {
            return this;
        } else if (this.isEmpty()) {
            return null;
        } else {
            return this.next().advance( n - 1);
        }
    }
    at(p) {
        return this.advance(p).item();
    }
    isEmpty() {
        return this.item == null;
    }
}


//Grid class
class Grid{
    constructor() {
        this.points = null;
        this.th;
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
    saveLine(p1, p2) {
        lines.push(p1.x);
        lines.push(p1.y);
        lines.push(p2.x);
        lines.push(p2.y);
    }
    collide(time, map) {
        this.pointColl(time, map);
        this.cursorColl();
    }
    pointColl(time, map) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let points = map.get(xyGridHash(this.gridX() + i, this.gridY() + j));
                if (points != undefined) {
                    for (let i = 0; i < points.length; i++) {
                        if (this != points[i]) {
                            let p = points[i];
                            let distTo = this.distToPoint(p);
                            if (distTo < gridSize) {
                                this.accVA(.5 * time * this.calcForceFromPoint(distTo), this.angleToPoint(p));
                                // if(i > 0 || i == 0 && j > -1) {
                                //     this.saveLine(this, p);
                                // }
                            }
                        }
                    }
                }
            }
        }
    }
    calcForceFromPoint(distance) {
        return -1 * Math.cos(Math.PI * distance / (2 * .8 * gridSize));
        //return -0.1 * (1 - distance / gridSize);
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
        let dX = this.velX * time;
        if(this.x + dX > canvasWidth - this.radius) {
            this.x += canvasWidth - this.radius - this.x - dX;
            this.velX *= -0.75;
        } else if (this.x + dX < this.radius) {
            this.x += this.radius - dX - this.x;
            this.velX *= -0.75
        } else {
            this.x += dX;
        }
        
        let dY = this.velY * time;
        if(this.y + dY > canvasHeight - this.radius) {
            this.y += canvasHeight - this.radius - this.y - dY;
            this.velY *= -0.75;
        } else if (this.y + dY < this.radius) {
            this.y += this.radius - dY - this.y;
            this.velY *= -0.75;
        } else {
            this.y += dY;
        }
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
    gridX() {
        return Math.floor(this.x / gridSize);
    }
    gridY() {
        return Math.floor(this.y / gridSize);
    }
}






let canvasWidth;
let canvasHeight;
let gridSize;
const pointMap = new Map();
const pointCount = 100;
const timeStep = .5;
const points = [];
let lines = [];
const debug = true;
const pointRadius = 10;
let maxCursorInteractionDistance = 1000;
let cursorRingDistance = maxCursorInteractionDistance / 4;

// Initialize the context
const ctx = canvas.getContext("2d");
updateWindowSize();


let size = 10;
let growing = true;
function test() {
    growing = size > 400 || size < 10 ? !growing : growing;
    size += growing ? 1 : -1;
    ctx.fillStyle = 'red';
    drawCircle(canvasWidth / 2, canvasHeight / 2, size);
    ctx.strokeStyle = 'blue';
    drawLine(canvasWidth / 2 - size * 1.125, canvasHeight / 2,
        canvasWidth / 2 + size * 1.125, canvasHeight / 2,
        size / 10,
        "round");
    // for(let i = 0; i < 50; i ++) {
    //     drawCircle(canvasWidth / 2, canvasHeight / 2, size);
    // }
    requestAnimationFrame(test);
}
//test();

function colorsTest() {

}
//colorsTest();

function drawShapeTest() {
    let maxVelX = 1;
    let maxVelY = 1;
    let count = 3;
    let points = [];
    for (let i = 0; i < count; i++) {
        points[i] = new Point(Math.floor(Math.random() * canvasWidth),
            Math.floor(Math.random() * canvasHeight),
            (Math.random() * maxVelX * 2) - maxVelX,
            (Math.random() * maxVelX * 2) - maxVelY,
            pointRadius);

    }
    drawShape(ctx, points, 5, [0, 0, 0], [255, 0, 0]);
}
//drawShapeTest();

function drawCircle(x, y, size, color) {

    ctx.beginPath();
    ctx.fillStyle = colorToString(color);
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawLine(x1, y1, x2, y2, lineWidth, lineCap) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawShape(ctx, points, lineWidth, lineColor, fillColor) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = colorToString(lineColor);
    ctx.fillStyle = colorToString(fillColor);
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function colorToString(color) {
    return `rgb(${color[0]},
                ${color[1]},
                ${color[2]})`;
}

function calculateShapeCenter(points) {
    let sumX = 0;
    let sumY = 0;
    let pointCount = points.length;
    for (let i = 0; i < pointCount; i++) {
        sumX += points[i].x;
        sumY += points[i].y;
    }
    return [sumX / pointCount, sumY / pointCount];
}

function calculateShapeColor(points, color1X, color2X, color1Y, color2Y) {
    let point = calculateShapeCenter(points);
    let color = [255, 19, 140]; //initialize color with 'error' color of pink
    for (let i = 0; i < 3; i++) {
        color[i] = (color1X[i] + color2X[i] + color1Y[i] + color2Y[i]) / 4; //average the color vectors for rgb
    }
    return color;
}



function updateWindowSize() {
    canvas.width = this.window.innerWidth;
    canvas.height = this.window.innerHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    gridSize = Math.floor(canvasHeight / 20);
}


function main() {
    init();
    //testInit();
    for (let i = 0; i < 5; i++) {
        step();
    }

    run();
}
main();

function testInit() {
    initMap(canvasWidth, canvasHeight);
    points.push(new Point(canvasWidth / 2,
        canvasHeight / 2,
        1,
        0,
        pointRadius));

    points.push(new Point(canvasWidth / 2,
        canvasHeight / 2 + 10,
        1,
        0,
        pointRadius));
}

function init() {
    console.log("canvasWidth: " + canvasWidth + " canvasHeight: " + canvasHeight + " gridSize: " + gridSize);
    console.log("canvas.width: " + canvas.width + " canvas.height: " + canvas.height);
    initMap(canvasWidth, canvasHeight);
    initPoints(pointCount, canvasWidth, canvasHeight, 1, 2);
}

function initMap(width, height) {
    let rowTiles = Math.floor(height / gridSize) + (height % gridSize == 0 ? 0 : 1);
    let colTiles = Math.floor(width / gridSize) + (width % gridSize == 0 ? 0 : 1);
    console.log("rowTiles: " + rowTiles + " colTiles: " + colTiles);
    console.log("width: " + width + " height: " + height);
    for (let i = 0; i < rowTiles; i++) {
        for (let j = 0; j < colTiles; j++) {
            pointMap.set(xyGridHash(j, i), new Array());
        }
    }
}

function initPoints(pointCount, width, height, maxVelX, maxVelY) {

    for (let i = 0; i < pointCount; i++) {
        let point = new Point(Math.floor(Math.random() * width),
            Math.floor(Math.random() * height),
            (Math.random() * maxVelX * 2) - maxVelX,
            (Math.random() * maxVelX * 2) - maxVelY,
            pointRadius);
        points.push(point);
    }
    console.log("Initalization Done!");
}

function run() {
    step();
    requestAnimationFrame(run);
}

function step() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    updateAll(timeStep);
    drawLines(lines);
    //console.log(lines);
    //containsRepeatingLines(lines);
    lines = [];
    drawPoints(gridSize / 2, points);
    if (debug) {
        drawMap(pointMap);
    }

}

function updateAll(time) {
    collideAll(time, points);
    moveAll(time, points);
}

function collideAll(time, points) {
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        p.collide(time, pointMap);
    }
}

function moveAll(time, points) {
    clearMap(pointMap);
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        p.move(time);
    }
    populateMap(pointMap, points);
}

function drawPoints(size, points) {
    pointMap.forEach(function (points, key) {
        // console.log(points.length);
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            let vel = Math.sqrt(p.velX * p.velX + p.velY * p.velY);
            drawCircle(p.x, p.y, p.radius, [(vel) * 10, (vel) * 10, 255]);
        }
    });
    // for (let i = 0; i < points.length; i++) {
    //     let p = points[i];
    //     drawCircle(p.x, p.y, size, [(p.velX - 1) * 127, (p.velY - 1) * 127, 255]);
    // }
}

function clearMap(map) {
    map.forEach(function (points, key) {
        map.set(key, []);
    });
}

function populateMap(map, points) {
    for (let i = 0; i < points.length; i++) {
        placePoint(map, points[i]);
    }
}

function drawMap(map) {
    let rowTiles = Math.floor(canvasHeight / gridSize) + (canvasHeight % gridSize == 0 ? 0 : 1);
    let colTiles = Math.floor(canvasWidth / gridSize) + (canvasWidth % gridSize == 0 ? 0 : 1);
    let margin = 0.05;
    let marginTrue = margin * gridSize;
    ctx.globalAlpha = 0.25;
    ctx.font = "20px serif";
    for (let i = 0; i < rowTiles; i++) {
        for (let j = 0; j < colTiles; j++) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(gridSize * j + marginTrue, gridSize * i + marginTrue, gridSize - marginTrue * 2, gridSize - marginTrue * 2);
            ctx.fillStyle = 'black';
            ctx.fillText(getMapCountAt(map, j, i), gridSize * j + marginTrue, gridSize * i + marginTrue + 20);
        }
    }
    ctx.globalAlpha = 1.0;
}

function drawLines(lines) {
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < lines.length; i += 4) {
        drawLine(lines[i], lines[i + 1], lines[i + 2], lines[i + 3], 2, 'round');
    }
    ctx.globalAlpha = 1.0;
}


function getMapCountAt(map, gridX, gridY) {
    return map.get(xyGridHash(gridX, gridY)).length;
}





// vestigial functions
function getPoints(map) {
    let A = [];
    let i = 0;
    map.forEach(function (points, key) {
        for (let j = 0; j < points.length; j++) {
            let point = points[j];
            A[i] = point.x;
            A[i + 1] = point.y;
            i += 2;
        }
    });
    return A;
}






// hashmap helper functions
function placePoint(map, point) {
    //console.log(point);
    let A = map.get(xyHash(point.x, point.y));
    if (A != undefined) {
        A.push(point);
    } else {
        // console.log("canvasX: " + canvasWidth + " canvasY: " + canvasHeight);
        // console.log(point);

    }
}

function retrievePoints(map, x, y) {
    return map.get(xyHash(x, y));
}

function xyGridHash(x, y) {
    return (x << 16) + y;
}

function xyHash(x, y) {
    return ((Math.floor(x / gridSize) << 16) + Math.floor(y / gridSize));
}

function containsRepeatingLines(lines) {
    let testMap = new Set();
    let i = 0
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
        if(testMap.has(hash)) {
            found = true;
        } else {
            testMap.add(hash)
        }
        i+=4
    }
    console.log((!found) ? "No repeating lines!" : "Repeating Lines Found!");
}

function xyxyHash(x1, y1, x2, y2) {
    return (x1 << 24) + (y1 << 16) + (x2 << 8) + y2;
}


