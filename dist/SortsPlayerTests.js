"use strict";
let player;
let paused = true;
function spacingTest(canvas) {
    console.log("w: " + canvas.clientWidth + "h: " + canvas.clientHeight);
    player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(10, 0, 20);
    player.renderFrame();
}
function randomAnimationTest(canvas) {
    if (player === null || player === undefined) {
        player = new SortsPlayer(canvas, "insertion");
        player.loadRandomArray(10, 1, 20);
    }
    for (let i = 0; i < 10; i++) {
        player.randomAnimation();
    }
    paused = false;
}
function initializeRandom(canvas) {
    player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(10, 1, 15);
    player.renderFrame();
}
function playPause() {
    if (player !== null) {
        paused = !paused;
    }
}
function stepForward(n = 1) {
    player === null || player === void 0 ? void 0 : player.stepForward(n);
}
function stepBackward(n = 1) {
    player === null || player === void 0 ? void 0 : player.stepBackward(n);
}
function reset() {
    player === null || player === void 0 ? void 0 : player.reset();
}
runAnimation();
function runAnimation() {
    if (player != null) {
        player.run();
    }
    requestAnimationFrame(runAnimation);
}
