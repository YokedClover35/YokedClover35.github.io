"use strict";
function spacingTest(canvas) {
    console.log("w: " + canvas.clientWidth + "h: " + canvas.clientHeight);
    let player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(10, 0, 20);
    player.renderFrame();
}
let permPlayer;
function randomAnimationTest(canvas) {
    permPlayer = new SortsPlayer(canvas, "insertion");
    permPlayer.loadRandomArray(10, 0, 20);
    for (let i = 0; i < 10; i++) {
        permPlayer.randomAnimation();
    }
    permPlayer.run();
}
