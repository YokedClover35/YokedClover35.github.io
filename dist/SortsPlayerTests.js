"use strict";
let player;
function spacingTest(canvas) {
    console.log("w: " + canvas.clientWidth + "h: " + canvas.clientHeight);
    player = new SortsPlayer(canvas, "insertion");
    player.loadRandomArray(10, 0, 20);
    player.renderFrame();
}
function randomAnimationTest(canvas) {
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
