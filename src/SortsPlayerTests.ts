"use strict";
let player: SortsPlayer | null; 
function spacingTest(canvas: HTMLCanvasElement) {
    console.log("w: " + canvas.clientWidth + "h: " + canvas.clientHeight);
    player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(10, 0, 20);
    player.renderFrame();
}

function randomAnimationTest(canvas: HTMLCanvasElement) {
    player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(10, 0, 20);
    for (let i = 0; i < 50; i++) {
        player.randomAnimation(); 
    }
}

runAnimation();
function runAnimation() {
    if (player != null) {
        player.run();
    }
    requestAnimationFrame(runAnimation);
}