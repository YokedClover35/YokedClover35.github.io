
let canvas = document.getElementById("particle-sim") as HTMLCanvasElement;
let particleSim = new ParticleSim(canvas, new ParticleSimConfig());
let prevTime = performance.now();


function configureSim(config: ParticleSimConfig) {

}

function stop() {
    particleSim.running = false;
}

function run() {
    let now = performance.now();
    // console.log(now - prevTime);
    particleSim.run(now - prevTime);
    prevTime = now;
    requestAnimationFrame(run);
}
run()

function setMousePosVel(e: MouseEvent) {
    var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;
    particleSim.ct.x = (e.clientX - rect.left) * scaleX;
    particleSim.ct.y = (e.clientY - rect.top) * scaleY;
    particleSim.ct.addVelocityEntries(e.movementX, e.movementY);
    //console.log("x: " + cursorX + " y: " + cursorY + "\nvelX: " + cursorDX + " velY: " + cursorDY);
}
// canvas.setAttribute('width', `${canvas.clientWidth}`);
// canvas.setAttribute('height', `${canvas.clientHeight}`);

// event listeners
canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

window.addEventListener("mousemove", setMousePosVel);

window.addEventListener("mousedown", function (e) {
    switch (e.button) {
        case 0:
            particleSim.ct.button1 = true;
            break;
        case 1:
            e.preventDefault();
            particleSim.ct.button2 = true;
            break;
        case 2:
            particleSim.ct.button3 = true;
            break;
    }
});

window.addEventListener("mouseup", function (e) {
    switch (e.button) {
        case 0:
            particleSim.ct.button1 = false;
            break;
        case 1:
            particleSim.ct.button2 = false;
            break;
        case 2:
            e.preventDefault();
            particleSim.ct.button3 = false;
            break;
    }
});

let prevX = 0;
let prevY = 0
window.addEventListener("touchstart", function(e) {
    particleSim.ct.button1 = true;

    var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

    let prevPos = e.touches.item(e.touches.length - 1);

    prevX = (prevPos!.clientX - rect.left) * scaleX;
    prevY = (prevPos!.clientY - rect.top) * scaleY;
    particleSim.ct.x = prevX;
    particleSim.ct.y = prevY;
});
window.addEventListener("touchend", function(e) {
    particleSim.ct.button1 = false;
});
// el.addEventListener("touchcancel", handleCancel);

canvas.addEventListener("touchmove", function(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

    let currentPos = e.touches.item(e.touches.length - 1);

    let currentX = (currentPos!.clientX - rect.left) * scaleX;
    let currentY = (currentPos!.clientY - rect.top) * scaleY;
    particleSim.ct.x = currentX;
    particleSim.ct.y = currentY;

    let dx = currentX - prevX;
    let dy = currentY - prevY;
    particleSim.ct.addVelocityEntries(dx, dy);
    
});


