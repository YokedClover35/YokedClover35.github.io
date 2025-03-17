"use strict";
class Tile {
    constructor() {
        this.points = new LinkedList(null, null);
    }
    addPoint(p) {
        this.points.appendItem(p);
    }
    removePoint(p) {
        this.points.removeItem(p);
    }
    drawPoints(ctx) {
        let sublist = this.points;
        while (sublist !== null && !sublist.isEmpty()) {
            let p = sublist.item;
            // let vel = Math.sqrt(p.velX * p.velX + p.velY * p.velY);
            // DrawHelper.drawCircle(p.x, p.y, p.radius, [Math.max(255 - (vel) * 10, 0), 0, 0]);
            DrawHelper.drawCircle(ctx, p.x, p.y, p.radius, [230, 111, 92]); //[(p.velX > 1) ? 255 : 0, (p.velX < -1) ? 255 : 0, 0]);
            sublist = sublist.next;
        }
    }
}
// class Line {
//     x1: number;
//     y1: number;
//     x2: number;
//     y2: number;
//     constructor(x1: number, y1: number, x2: number, y2: number) {
//         this.x1 = x1;
//         this.y1 = y1;
//         this.x2 = x2;
//         this.y2 = y2;
//     }
//     draw(ctx: CanvasRenderingContext2D, width: number) {
//         DrawHelper.drawLine(ctx, this.x1, this.y1, this.x2, this.y2, width, 'round', [254, 155, 98]);
//     }
// }
class PointGrid {
    constructor(tileSize) {
        this.tiles = [];
        // this.lines = [];
        this.xLength = 0;
        this.yLength = 0;
        this.tileSize = tileSize;
    }
    resize(width, height) {
        let oldXLength = this.xLength;
        let oldYLength = this.yLength;
        this.xLength = Math.floor(width / this.tileSize) + (width % this.tileSize == 0 ? 0 : 1) + 1;
        this.yLength = Math.floor(height / this.tileSize) + (height % this.tileSize == 0 ? 0 : 1) + 1;
        //add new tiles if needed
        /**
         * OOOXX
         * OOOXX
         * YYYXX
         * YYYXX
         * O = old
         * X = new x tiles
         * Y = new y tiles
         */
        //X - add new x tiles in old y columns/rows
        if (this.xLength > oldXLength) {
            for (let x = oldXLength; x < this.xLength; x++) {
                //create new column
                if (this.tiles[x] == null) {
                    this.tiles.push(new Array(this.yLength));
                    for (let y = 0; y < this.yLength; y++) {
                        this.tiles[x][y] = new Tile();
                    }
                }
            }
        }
        else if (this.xLength !== oldXLength) {
            //remove tiles out of screen and relocate points out of screen
            while (this.tiles.length > this.xLength) {
                let removedTiles = this.tiles.pop();
                if (removedTiles !== undefined) {
                    for (let y = 0; y < removedTiles.length; y++) {
                        this.relocatePoints(removedTiles[y]);
                    }
                }
                else {
                    console.log("something went wrong when removing tiles along the x axis!");
                }
            }
        }
        if (this.yLength > oldYLength) {
            //Y - add new y tiles in old x columns/rows
            for (let x = 0; x < oldXLength; x++)
                for (let y = oldYLength; y < this.yLength; y++) {
                    if (this.tiles[x][y] == null) {
                        this.tiles[x].push(new Tile());
                    }
                }
        }
        else if (this.yLength !== oldYLength) {
            for (let x = 0; x < this.xLength; x++) {
                while (this.tiles[x].length > this.yLength) {
                    let tile = this.tiles[x].pop();
                    if (tile !== undefined) {
                        this.relocatePoints(tile);
                    }
                    else {
                        console.log("something went wrong when removing tiles along the y axis!");
                    }
                }
            }
        }
    }
    relocatePoints(tile) {
        // console.log("Relocating points!");
        let sublist = tile.points;
        while (sublist !== null && !sublist.isEmpty()) {
            let p = sublist.item;
            p.x = Math.min(p.x, canvas.width - p.radius);
            p.y = Math.min(p.y, canvas.height - p.radius);
            this.addPointac(p);
            sublist = sublist.next;
        }
    }
    applyPhysicsPoint(dt, point, physicsConfig) {
        let gx = this.toGridCoord(point.x);
        let gy = this.toGridCoord(point.y);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let gx1 = i + gx;
                let gy1 = j + gy;
                if (gx1 >= 0 && gy1 >= 0 && gx1 < this.xLength && gy1 < this.yLength) {
                    let tile = this.tiles[gx1][gy1];
                    this.applyPhysicsFromTile(dt, point, tile, physicsConfig);
                }
            }
        }
    }
    applyPhysicsFromTile(dt, point, tile, physicsConfig) {
        let sublist = tile.points;
        while (sublist !== null && !sublist.isEmpty()) {
            if (point != sublist.item) {
                point.collideWithPoint(dt, sublist.item, physicsConfig);
            }
            sublist = sublist.next;
        }
    }
    /*
    numPointsOnGridAt returns the number of points at the given location
    Precondition: gx, gy >= 0; gx <= grid.length; gy <= grid[0].length
    Postcondition: nothing is changed
    */
    numPointsAt(gx, gy) {
        return this.tiles[gx][gy].points.length();
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
        // if (gx1 != gx2 || gy1 != gy2) {
        this.removePointgc(p, gx1, gy1);
        this.addPointgc(p, gx2, gy2);
        return true;
        // }
        // return false;
    }
    /*
    addPointgc adds the given point to the given grid cordinates
    Precondition: gx, gy >= 0; gx <= grid.length; gy <= grid[0].length
    Postcondition: a new point is added to grid[gx][gy]
    */
    addPointgc(p, gx, gy) {
        // console.log(this.tiles);
        if (this.tiles[gx][gy] !== undefined) {
            this.tiles[gx][gy].addPoint(p);
        }
        else {
            console.log("could not add point at x: " + gx + " y: " + gy + "!");
        }
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
        try {
            this.tiles[gx][gy].removePoint(p);
        }
        catch (error) {
            console.log(this.tiles);
            console.log(p);
            console.log(gx);
            console.log(gy);
            console.log(this.tileSize);
            console.log(this.tiles[gx][gy]);
        }
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
    drawPoints(ctx) {
        for (let i = 0; i < this.xLength; i++) {
            for (let j = 0; j < this.yLength; j++) {
                this.tiles[i][j].drawPoints(ctx);
            }
        }
    }
    drawLines(ctx, maxLines) {
        let lineCount = 0;
        for (let i = 0; lineCount <= maxLines && i < this.xLength; i++) {
            for (let j = 0; lineCount <= maxLines && j < this.yLength; j++) {
                lineCount = this.drawLinesForTile(ctx, this.tiles[i][j], i, j, lineCount, maxLines);
            }
        }
    }
    drawLinesForTile(ctx, tile, gx, gy, lineCount, maxLines) {
        let tilesToCheck = [
            1, 0,
            -1, -1,
            0, -1,
            1, -1
        ];
        //do same tile connections
        for (let subArray1 = tile.points; lineCount <= maxLines && subArray1 !== null && !subArray1.isEmpty(); subArray1 = subArray1.next) {
            for (let subArray2 = subArray1.next; lineCount <= maxLines && subArray2 !== null && !subArray2.isEmpty(); subArray2 = subArray2.next) {
                this.drawLine(ctx, subArray1.item, subArray2.item);
                lineCount++;
            }
        }
        //do other tile connections
        for (let i = 0; i < tilesToCheck.length; i += 2) {
            let cx = tilesToCheck[i] + gx;
            let cy = tilesToCheck[i + 1] + gy;
            if (cx >= 0 && cx < this.xLength && cy >= 0 && cy < this.yLength) {
                let tile1 = this.tiles[cx][cy];
                for (let subArray1 = tile.points; lineCount <= maxLines && subArray1 !== null && !subArray1.isEmpty(); subArray1 = subArray1.next) {
                    for (let subArray2 = tile1.points; lineCount <= maxLines && subArray2 !== null && !subArray2.isEmpty(); subArray2 = subArray2.next) {
                        this.drawLine(ctx, subArray1.item, subArray2.item);
                        lineCount++;
                    }
                }
            }
        }
        return lineCount;
    }
    drawLine(ctx, p1, p2) {
        if (p1.distToPoint(p2) <= this.tileSize) {
            DrawHelper.drawLine(ctx, p1.x, p1.y, p2.x, p2.y, 2, 'square', [59, 0, 23]);
        }
    }
    drawDebug(ctx, ct) {
        let margin = 0.05;
        let marginTrue = margin * this.tileSize;
        ctx.font = "20px serif";
        for (let i = 0; i < this.yLength; i++) {
            for (let j = 0; j < this.xLength; j++) {
                ctx.globalAlpha = 0.25;
                ctx.fillStyle = 'green';
                ctx.fillRect(this.tileSize * j + marginTrue, this.tileSize * i + marginTrue, this.tileSize - marginTrue * 2, this.tileSize - marginTrue * 2);
                ctx.globalAlpha = 1;
                ctx.fillStyle = 'black';
                ctx.fillText(`${this.numPointsAt(j, i)}`, this.tileSize * j + marginTrue, this.tileSize * i + marginTrue + 20);
            }
        }
        ctx.globalAlpha = 1.0;
        DrawHelper.drawCircle(ctx, ct.x, ct.y, 10, [0, 0, 0]);
        DrawHelper.drawLine(ctx, ct.x, ct.y, ct.x + 10 * ct.getdx(), ct.y + 10 * ct.getdy(), 3, 'round', [0, 255, 0]);
    }
}
class DrawHelper {
    // drawing helper functions
    static drawCircle(ctx, x, y, size, color) {
        ctx.beginPath();
        ctx.fillStyle = this.colorToString(color);
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    static drawLine(ctx, x1, y1, x2, y2, lineWidth, lineCap, color) {
        ctx.strokeStyle = this.colorToString(color);
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
}
class Point {
    constructor(x, y, velX, velY, radius) {
        this.lineCount = 0;
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.radius = radius;
    }
    static newRandom(minX, maxX, minY, maxY, maxVel, radiusMin, radiusMax) {
        return new Point((Math.random() * (maxX - minX - radiusMax * 2)) + minY + radiusMax, (Math.random() * (maxY - minY - radiusMax * 2)) + minY + radiusMax, (Math.random() * maxVel * 2) - maxVel, (Math.random() * maxVel * 2) - maxVel, (Math.random() * (radiusMax - radiusMin)) + radiusMin);
    }
    static newFromConfig(config) {
        return Point.newRandom(config.xMin, config.xMax, config.yMin, config.yMax, config.velMax, config.radiusMin, config.radiusMax);
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
    collideWithPoint(dt, point, physicsConfig) {
        let distTo = this.distToPoint(point);
        if (distTo < physicsConfig.interactionDistance) {
            this.accVA(.5 * dt * this.calcForceFromPoint(distTo, physicsConfig), this.angleToPoint(point));
        }
    }
    calcForceFromPoint(distance, physicsConfig) {
        return -physicsConfig.pointForceMultiplier * Math.cos(Math.PI * distance / (2 * .8 * physicsConfig.interactionDistance));
        // return -pointForceMultiplier * (1 - distance / pointGrid.tileSize);
    }
    cursorColl(dt, physicsConfig, ct) {
        if (ct.button1) {
            let distTo = this.distToXY(ct.x, ct.y);
            let force = dt * this.calcCursorAttractionForce(distTo, physicsConfig.maxCursorInteractionDistance, physicsConfig.cursorForceMultiplier);
            let angle = this.angleToXY(ct.x, ct.y);
            this.accVA(force, angle);
        }
        else if (ct.button2) {
            let distTo = this.distToXY(ct.x, ct.y);
            let force = dt * this.calcCursorAttractionForce(distTo, physicsConfig.maxCursorInteractionDistance, physicsConfig.cursorForceMultiplier) * (distTo < physicsConfig.cursorRingDistance ? -1 : 1);
            let angle = this.angleToXY(ct.x, ct.y);
            this.accVA(force, angle);
        }
        else if (ct.button3) {
            let distTo = this.distToXY(ct.x, ct.y);
            let force = dt * -this.calcCursorAttractionForce(distTo, physicsConfig.maxCursorInteractionDistance, physicsConfig.cursorForceMultiplier);
            let angle = this.angleToXY(ct.x, ct.y);
            this.accVA(force, angle);
        }
        else {
            let distTo = this.distToXY(ct.x, ct.y);
            let force = dt * this.calcCursorCarryForce(distTo, physicsConfig.maxCursorCarryDistance, physicsConfig.cursorCarryForceMultiplier);
            // this.accXY((this.velX - ct.getdx()) * force, (this.velY - ct.getdy()) * force);
            // this.accXY((Math.sign(ct.getdx()) === Math.sign(this.velX) && Math.abs(ct.getdx() * force) > Math.abs(this.velX)) ? 0 : (ct.getdx() - this.velX) * force,
            //            (Math.sign(ct.getdy()) === Math.sign(this.velY) && Math.abs(ct.getdy() * force) > Math.abs(this.velY)) ? 0 : (ct.getdy() - this.velY) * force);
            this.applyCursorFriction(dt, force, 10 + physicsConfig.maxVel - (ct.getdx() * ct.getdx() + ct.getdy() * ct.getdy()), ct.getdx(), ct.getdy());
        }
    }
    calcCursorCarryForce(distance, maxDistance, cursorCarryForceMultiplier) {
        // return 1 * ((distance >= maxDistance) ? 0 : Math.sqrt(maxDistance - distance) / maxDistance);
        return cursorCarryForceMultiplier * ((distance >= maxDistance) ? 0 : (Math.cos(0.5 * maxDistance * distance / Math.PI) + 1));
    }
    calcCursorAttractionForce(distance, maxDistance, cursorForceMultiplier) {
        //return Math.max(-(distance / maxDistance) + 0.25, 0); 
        // return Math.atan(-2 * Math.PI - distance) + Math.PI / 2;
        return (distance >= maxDistance) ? 0 : (1 - distance / maxDistance) * 0.5 * cursorForceMultiplier;
        // return Math.min(maxDistance * 100 / (distance * distance), 1000);
    }
    move(time, physicsConfig) {
        //handle wall collisions x
        let dX = this.velX * time;
        if (this.x + dX > canvas.width - this.radius) {
            this.x += canvas.width - this.radius - this.x - dX;
            this.velX *= -physicsConfig.bounceFactor;
        }
        else if (this.x + dX < this.radius) {
            this.x += this.radius - dX - this.x;
            this.velX *= -physicsConfig.bounceFactor;
        }
        else {
            this.x += dX;
        }
        //handle wall colisions y
        let dY = this.velY * time;
        if (this.y + dY > canvas.height - this.radius) {
            this.y += canvas.height - this.radius - this.y - dY;
            this.velY *= -physicsConfig.bounceFactor;
        }
        else if (this.y + dY < this.radius) {
            this.y += this.radius - dY - this.y;
            this.velY *= -physicsConfig.bounceFactor;
        }
        else {
            this.y += dY;
        }
        //apply friction
        this.applyFriction(time, physicsConfig);
    }
    applyCursorFriction(time, factor, maxVel, relX, relY) {
        if (Math.abs(this.velX) > maxVel) {
            this.velX += -(factor * time) * (this.velX - relX);
        }
        if (Math.abs(this.velX) > maxVel) {
            this.velY += -(factor * time) * (this.velY - relY);
        }
    }
    applyFriction(time, physicsConfig) {
        if (Math.abs(this.velX) > physicsConfig.maxVel) {
            this.velX -= (physicsConfig.frictionMultiplier * time) * (this.velX);
        }
        if (Math.abs(this.velX) > physicsConfig.maxVel) {
            this.velY -= (physicsConfig.frictionMultiplier * time) * (this.velY);
        }
    }
    reduceLinear(factor, val) {
        return val / (factor + 1);
    }
}
class CursorTracker {
    constructor(historySize) {
        this.button1 = false;
        this.button2 = false;
        this.button3 = false;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.coolDown = false;
        this.averaged = false;
        this.i = 0;
        this.dxHist = new Int32Array(historySize);
        this.dyHist = new Int32Array(historySize);
    }
    addVelocityEntries(dx, dy) {
        if (!this.coolDown) {
            this.i = (this.i + 1) % this.dxHist.length;
            this.dxHist[this.i] = dx;
            this.dyHist[this.i] = dy;
            this.averaged = false;
            this.coolDown = true;
        }
    }
    getdx() {
        if (!this.averaged) {
            this.calculateAverage();
        }
        return this.dx;
    }
    getdy() {
        if (!this.averaged) {
            this.calculateAverage();
        }
        return this.dy;
    }
    calculateAverage() {
        let length = this.dxHist.length;
        if (length === 0) {
            return;
        }
        let sumdx = 0;
        let sumdy = 0;
        for (let i = 0; i < length; i++) {
            sumdx += this.dxHist[i];
            sumdy += this.dyHist[i];
        }
        this.dx = sumdx / length;
        this.dy = sumdy / length;
        this.averaged = true;
    }
    reset() {
        this.coolDown = false;
    }
}
//config classes
class PointCreationConfig {
    constructor(canvas) {
        this.xMin = 0;
        this.xMax = 0;
        this.yMin = 0;
        this.yMax = 0;
        this.velMax = 1;
        this.radiusMin = 5;
        this.radiusMax = 5;
        this.xMax = canvas.width;
        this.yMax = canvas.height;
    }
}
class SimPhysicsConfig {
    constructor() {
        this.timeStep = .05;
        this.interactionDistance = 10;
        this.bounceFactor = 0.5;
        this.maxVel = 0;
        this.frictionMultiplier = 0.02;
        this.pointToPointCollisions = true;
        this.pointForceMultiplier = 10;
        this.cursorCarryForceMultiplier = 1;
        this.cursorForceMultiplier = 3;
        this.maxCursorInteractionDistance = 10000;
        this.maxCursorCarryDistance = 100;
        this.cursorRingDistance = this.maxCursorInteractionDistance / 4;
    }
}
class SimDisplayConfig {
    constructor() {
        this.displayPoints = true;
        this.displayLines = false;
        this.frameFade = true;
        this.frameFadeFactor = 0.05;
    }
}
class DebugConfig {
    constructor() {
        this.debug = false;
        this.showFps = true;
    }
}
class ParticleSimConfig {
    constructor() {
        this.pointCount = 4000;
        this.physicsStepsPerFrame = 2;
        this.simPhysicsConfig = new SimPhysicsConfig();
        this.simDisplayConfig = new SimDisplayConfig();
        this.debugConfig = new DebugConfig();
    }
}
//main particle sim class
class ParticleSim {
    constructor(canvas, config) {
        this.running = true;
        this.ct = new CursorTracker(5);
        this.simStats = new SimStats();
        this.points = [];
        this.pointsLength = 0;
        this.config = config;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.pointCreationConfig = new PointCreationConfig(canvas);
        this.pointGrid = new PointGrid(config.simPhysicsConfig.interactionDistance);
        this.loadConfig(config);
    }
    run(dt) {
        this.updateWindowSize(canvas);
        this.simStats.addFrameTime(this.simStats.frametime, dt);
        if (this.running) {
            this.pointGrid.resize(this.canvas.width, this.canvas.height);
            //clear previous frame
            if (this.config.simDisplayConfig.frameFade) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${this.config.simDisplayConfig.frameFadeFactor})`;
                this.ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            else {
                this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            // add an empty entry to mouse velocity (does nothing if an entry has already been added this frame)
            this.ct.addVelocityEntries(0, 0);
            // reset to allow more entries to be added
            this.ct.reset();
            // apply x physics steps
            for (let i = 0; i < this.config.physicsStepsPerFrame; i++) {
                this.step(dt * this.config.simPhysicsConfig.timeStep / this.config.physicsStepsPerFrame);
            }
            // draw all the things
            if (this.config.simDisplayConfig.displayLines) {
                this.pointGrid.drawLines(this.ctx, Infinity);
            }
            if (this.config.simDisplayConfig.displayPoints) {
                this.drawPoints(this.ctx);
            }
            if (this.config.debugConfig.debug) {
                this.pointGrid.drawDebug(this.ctx, this.ct);
            }
            if (this.config.debugConfig.showFps) {
                this.simStats.drawAll(this.ctx, 30, 0);
            }
        }
    }
    drawPoints(ctx) {
        for (let i = 0; i < this.pointsLength; i++) {
            let p = this.points[i];
            DrawHelper.drawCircle(ctx, p.x, p.y, p.radius, [0, 0, 0]);
        }
    }
    step(timeStep) {
        let start = performance.now();
        if (this.config.simPhysicsConfig.pointToPointCollisions) {
            this.applyPointPhysics(timeStep);
        }
        this.applyCursorPhysics(timeStep);
        this.moveAll(timeStep);
        let dt = performance.now() - start;
        if (this.config.debugConfig.showFps) {
            this.simStats.addFrameTime(this.simStats.steptime, dt);
        }
    }
    updateWindowSize(canvas) {
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            console.log("resize");
            this.pointGrid.resize(width, height);
        }
    }
    loadConfig(config) {
        this.config = config;
        this.createPoints();
    }
    createPoints() {
        if (this.pointsLength < this.config.pointCount) {
            while (this.points.length < this.config.pointCount) {
                this.points.push(Point.newFromConfig(this.pointCreationConfig));
            }
            this.pointsLength = this.points.length;
        }
        else {
            this.pointsLength = this.config.pointCount;
        }
    }
    moveAll(time) {
        for (let i = 0; i < this.pointsLength; i++) {
            let p = this.points[i];
            let prevX = p.x;
            let prevY = p.y;
            p.move(time, this.config.simPhysicsConfig);
            this.pointGrid.moveOnGrid(p, prevX, prevY, p.x, p.y);
        }
    }
    applyPointPhysics(time) {
        for (let i = 0; i < this.pointsLength; i++) {
            let p = this.points[i];
            this.pointGrid.applyPhysicsPoint(time, p, this.config.simPhysicsConfig);
        }
    }
    applyCursorPhysics(dt) {
        for (let i = 0; i < this.pointsLength; i++) {
            let p = this.points[i];
            p.cursorColl(dt, this.config.simPhysicsConfig, this.ct);
        }
    }
}
class SimStats {
    constructor() {
        this.frametime = new Int32Array(51);
        this.steptime = new Int32Array(51);
    }
    addFrameTime(A, dt) {
        A[(A[0] %= (A.length - 1)) + 1] = dt;
        A[0]++;
    }
    drawAll(ctx, margin, y) {
        ctx.fillStyle = 'black';
        ctx.font = "20px serif";
        ctx.fillText("Main ms: " + this.avgArray(this.frametime, 1, this.frametime.length), margin, margin + y);
        ctx.fillText("Main fps: " + (1000 / this.avgArray(this.frametime, 1, this.frametime.length)), margin, margin + y + 30);
        ctx.fillText("Step ms: " + this.avgArray(this.steptime, 1, this.steptime.length), margin, margin + y + 60);
        ctx.fillText("Step fps: " + (1000 / this.avgArray(this.steptime, 1, this.steptime.length)), margin, margin + y + 90);
    }
    avgArray(A, start, end) {
        let sum = 0;
        for (let i = start; i < end; i++) {
            sum += A[i];
        }
        return sum / A.length;
    }
}
