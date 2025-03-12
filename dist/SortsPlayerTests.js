"use strict";
function spacingTest(canvas) {
    console.log("w: " + canvas.clientWidth + "h: " + canvas.clientHeight);
    let player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(10, 0, 20);
    player.renderFrame();
}