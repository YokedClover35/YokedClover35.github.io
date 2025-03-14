"use strict";
let player: SortsPlayer | null;
function spacingTest(canvas: HTMLCanvasElement) {
    console.log("w: " + canvas.clientWidth + "h: " + canvas.clientHeight);
    player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(10, 0, 20);
    player.renderFrame();
}

function randomAnimationTest(canvas: HTMLCanvasElement) {
    if (player === null || player === undefined) {
        player = new SortsPlayer(canvas, "insertion");
        player.loadRandomArray(10, 1, 20);
    }
    for (let i = 0; i < 10; i++) {
        player.randomAnimation(); 
    }
}

function initializeRandom(canvas: HTMLCanvasElement) {
    player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(200, 1, 150);
    player.renderFrame();
    setAnimationSpeed(.1);
}

function playPause() {
    player?.playPause();
}

function stepForward(n: number = 1) {
    player?.stepForward(n);
}

function stepBackward(n: number = 1) {
    player?.stepBackward(n);
}

function reset() {
    player?.reset()
}

function setAnimationSpeed(ms: number) {
    player?.setAnimationSpeed(ms);
}

runAnimation();
function runAnimation() {
    if (player != null) {
        player.run();
    }
    requestAnimationFrame(runAnimation);
}