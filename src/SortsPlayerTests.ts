"use strict";
function spacingTest(canvas: HTMLCanvasElement) {
    console.log("w: " + canvas.clientWidth + "h: " + canvas.clientHeight);
    let player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(10, 0, 20);
    player.renderFrame();
}

function randomAnimationTest(canvas: HTMLCanvasElement) {
    let player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(10, 0, 20);
    for (let i = 0; i < 10; i++) {
        player.randomAnimation(); 
    }
}