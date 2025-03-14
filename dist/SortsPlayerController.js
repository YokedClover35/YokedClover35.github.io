"use strict";
let players = new Map();
function randomAnimationTest(canvas, id) {
    let player = players.get(id);
    if (player === null) {
        player = new SortsPlayer(canvas, "insertion", id);
        players.set(id, player);
        player.loadRandomArray(10, 1, 20);
    }
    for (let i = 0; i < 10; i++) {
        player.randomAnimation();
    }
}
function initializeRandom(canvas, sortType, id) {
    let player = new SortsPlayer(canvas, sortType, id);
    players.set(id, player);
    player.loadRandomArray(100, 1, 200);
    player.renderFrame();
    player.setAnimationSpeed(.1);
    player.repeat = false;
}
function initializeMiniPlayer(canvas, sortType, id) {
    let player = new SortsPlayer(canvas, sortType, id);
    players.set(id, player);
    player.loadRandomArray(6, 1, 10);
    player.renderFrame();
    player.setAnimationSpeed(200);
    player.repeat = true;
    player.play();
}
function playPause(id) {
    var _a;
    (_a = players.get(id)) === null || _a === void 0 ? void 0 : _a.playPause();
}
function stepForward(n = 1, id) {
    var _a;
    (_a = players.get(id)) === null || _a === void 0 ? void 0 : _a.stepForward(n);
}
function stepBackward(n = 1, id) {
    var _a;
    (_a = players.get(id)) === null || _a === void 0 ? void 0 : _a.stepBackward(n);
}
function reset(id) {
    var _a;
    (_a = players.get(id)) === null || _a === void 0 ? void 0 : _a.reset();
}
function setAnimationSpeed(ms, id) {
    var _a;
    (_a = players.get(id)) === null || _a === void 0 ? void 0 : _a.setAnimationSpeed(ms);
}
function stop(id) {
    let player = players.get(id);
    if (player !== undefined) {
        player.running = false;
    }
    else {
        console.error(`Cannot stop sorts player id:"${id}" because no such player exsists`);
    }
}
function start(id) {
    let player = players.get(id);
    if (player !== undefined) {
        player.running = true;
    }
    else {
        console.error(`Cannot stop sorts player id:"${id}" because no such player exsists`);
    }
}
runAnimation();
function runAnimation() {
    players.forEach(function (value, key) {
        if (value.running) {
            value.run();
        }
    });
    requestAnimationFrame(runAnimation);
}
