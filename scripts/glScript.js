const canvasId = "#gl-canvas";
const canvas = document.querySelector(canvasId);
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
const gridSize = Math.floor(canvasHeight / 5);
const pointMap = new Map();
const pointCount = 1000;

// Initialize the GL context
const gl = canvas.getContext("webgl2");

//canvas size things

class Point {

    constructor(x, y, vel, theta) {
        this.x = x;
        this.y = y;
        this.vel = vel;
        this.theta = theta;
    }
    distTo(point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
    }
    angleTo(point) {
        return atan2(this.y - point.y, this.x - point.x); //This could be wrong
    }
    accVA(mag, angle) {
        let dX = Math.cos(this.theta) * this.vel + Math.cos(mag) * angle;
        let dY = Math.sin(this.theta) * this.vel + Math.sin(mag) * angle;
        this.vel = dX * dX + dY * dY;
        this.theta = Math.atan2(dY, dX);
    }
    accXY(dX1, dY1) {
        let dX = Math.cos(this.theta) * this.vel + dX1;
        let dY = Math.sin(this.theta) * this.vel + dY1;
        this.vel = dX * dX + dY * dY;
        this.theta = Math.atan2(dY, dX);
    }
    calcAllColl(time, map) {
        this.calcPointColl(time, map);
        this.calcCursorColl(map);
    }
    calcPointColl(time, map) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let points = map.get(xyGridHash(this.gridX + i, this.gridY + j));
                if (points != undefined) {
                    for (let p in points) {
                        this.accVA(.5 * time * this.calcForceFromPoint(this.distTo(p)), this.angleTo(p));
                    }
                }
            }
        }
    }
    calcForceFromPoint(distance) {
        return -10 * Math.cos(Math.PI * distance / (2 * .8 * 10));
    }
    calcCursorColl(map) {

    }
    move(time, map) {
        this.removeFromGrid(map);
        this.x += Math.cos(this.theta) * this.vel * time;
        this.x %= canvasWidth;
        this.y += Math.sin(this.theta) * this.vel * time;
        this.y %= canvasHeight;
        console.log("x: " + this.x + " y: " + this.y);

        this.placeOnGrid(map);
    }
    removeFromGrid(map) {
        let A = map.get(xyHash(this.x, this.y));
        let i = 0;
        while (i < A.length && A.at(i) != this) {
            i++;
        }
        (i < A.length) ? A.splice(i, i + 1) : console.log("Something went wrong when removing point from grid!!");
    }
    placeOnGrid(map) {
        map.get(xyHash(this.x, this.y)).push(this);
    }
    gridX() {
        return Math.floor(x / gridSize);
    }
    gridY() {
        return Math.floor(y / gridSize);
    }
}

window.addEventListener('resize', function(event) {
    updateWindowSize();
    main();
}, true);

function updateWindowSize() {
    canvas.width = this.window.innerWidth;
    canvas.height = this.window.innerHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

main();

function main() {



    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
    }



    const triangleVertecies = [
        0.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0
    ];
    const triangleVerteciesCpuBuffer = new Float32Array(triangleVertecies);
    const triangleGeoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVerteciesCpuBuffer, gl.STATIC_DRAW);

    const vertexShaderSourceCode = `#version 300 es 
    precision mediump float;
    
    in vec2 vertexPosition;

    uniform vec2 canvasSize;
    uniform vec2 shapeLocation;
    uniform float shapeSize;

    void main() {
        vec2 finalVertexPosition = vertexPosition * shapeSize + shapeLocation;
        vec2 clipPosition = (finalVertexPosition / canvasSize) * 2.0 - 1.0;
        gl_Position = vec4(clipPosition, 0.0, 1.0);
    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const compileError = gl.getShaderInfoLog(vertexShader);
        window.alert(`Failed to COMPILE vertex shader - ${compileError}`);
        return;
    }

    const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;

    out vec4 outputColor;

    void main() {
        outputColor = vec4(0.294, 0.0, 0.51, 1.0);
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(fragmentShader);
        window.alert(`Failed to compile fragment shader: ${errorMessage}`);
        return;
    }

    const triangleShaderProgram = gl.createProgram();
    gl.attachShader(triangleShaderProgram, vertexShader);
    gl.attachShader(triangleShaderProgram, fragmentShader);
    gl.linkProgram(triangleShaderProgram);

    if (!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(triangleShaderProgram);
        window.alert(`Failed to link shader: ${errorMessage}`);
        return;
    }

    const vertexPositionAttributeLocation = gl.getAttribLocation(triangleShaderProgram, `vertexPosition`);
    if (vertexPositionAttributeLocation < 0) {
        window.alert(`Failed to get attrib location for vertexPosition`);
        return;
    }


    const shapeLocationUniform = gl.getUniformLocation(triangleShaderProgram, 'shapeLocation');
    const shapeSizeUniform = gl.getUniformLocation(triangleShaderProgram, 'shapeSize');
    const canvasSizeUniform = gl.getUniformLocation(triangleShaderProgram, 'canvasSize');
    if (shapeLocationUniform === null || shapeSizeUniform === null || canvasSizeUniform === null) {
        window.alert(`Failed to get uniform locations (shapeLocations = ${!!shapeLocationUniform}` +
            `, shapeSize = ${!!shapeSizeUniform}` +
            `, cavasSize = ${!!canvasSizeUniform})`);
        return;
    }


    //output merger - how to merge the shaded pixel fragment with the existing output image
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // Set clear color to black, fully opaque
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Rasterizer - which pixels are part of a triangle
    gl.viewport(0, 0, canvas.width, canvas.height);

    //set GPU program (vertex + fragment shader pair)
    gl.useProgram(triangleShaderProgram);
    gl.enableVertexAttribArray(vertexPositionAttributeLocation);

    // Input assembler - how to read verticies from our GPU triangle buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.vertexAttribPointer(
        // index
        vertexPositionAttributeLocation,
        //size
        2,
        //type
        gl.FLOAT,
        //normalization
        false,
        //stride
        0,
        //offset
        0
    );

    gl.uniform2f(canvasSizeUniform, canvas.width, canvas.height);

    // gl.uniform1f(shapeSizeUniform, 50);
    // gl.uniform2f(shapeLocationUniform, canvas.width / 2, canvas.height / 2);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    // gl.uniform1f(shapeSizeUniform, 150);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);




    console.log("canvasWidth: " + canvasWidth + " canvasHeight: " + canvasHeight + " gridSize: " + gridSize);
    console.log("canvas.width: " + canvas.width + " canvas.height: " + canvas.height);
    initializePoints(pointCount, canvasWidth, canvasHeight, 1, 2);


    gl.uniform2f(shapeLocationUniform, 50, 50);
    gl.uniform1f(shapeSizeUniform, 20);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    let pointCoords = new Float32Array(getPoints(pointMap));

    gl.uniform1f(shapeSizeUniform, gridSize / 3);
    for (let i = 0; i < pointCoords.length; i+=2) {
        gl.uniform2f(shapeLocationUniform, pointCoords[i], pointCoords[i+1]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        console.log("drew a triangle at x: " + pointCoords[i] + " y: " + pointCoords[i+1]);
    }
}

function initializePoints(pointCount, width, height, minVel, maxVel) {

    let rowTiles = Math.floor(height / gridSize) + (height % gridSize == 0 ? 0 : 1);
    let colTiles = Math.floor(width / gridSize) + (width % gridSize == 0 ? 0 : 1);
    console.log("rowTiles: " + rowTiles + " colTiles: " + colTiles);
    console.log("width: " + width + " height: " + height);
    for (let i = 0; i < rowTiles; i++) {
        for (let j = 0; j < colTiles; j++) {
            pointMap.set(xyGridHash(j, i), new Array());
        }
    }
    for (let i = 0; i < pointCount; i++) {
        let point = new Point(Math.floor(Math.random() * width),
            Math.floor(Math.random() * height),
            (Math.random() * (maxVel - minVel)) + minVel,
            0);
        placePoint(pointMap, point);
    }
    console.log("Initalization Done!");
}


function updateAll(time) {
    pointMap.forEach(function (points, key) {
        console.log("points: " + points);
        console.log(points);
        console.log("pointsLength: " + points.length);
        for (let i = 0; i < points.length; i++) {
            points.at(i).move(time, pointMap);
        }
    });
}

function getPoints(map) {
    let A = [];
    let i = 0;
    map.forEach(function (points, key) {
        for (let j = 0; j < points.length; j++) {
            let point = points[j];
            A[i] = point.x;
            A[i+1] = point.y;
            console.log(point.x + " " + point.y);
            i += 2;
        }
    });
    return A;
}






// hashmap functions
function placePoint(map, point) {
    map.get(xyHash(point.x, point.y)).push(point);
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