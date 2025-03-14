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
function initializeRandom(canvas, sortType, id, entries, animationSpeed) {
    let player = new SortsPlayer(canvas, sortType, id);
    players.set(id, player);
    player.loadRandomArray(entries, 1, entries * 2);
    player.renderFrame();
    player.setAnimationSpeed(animationSpeed);
    player.repeat = false;
}
function initializeMiniPlayer(canvas, sortType, id) {
    let player = new SortsPlayer(canvas, sortType, id);
    players.set(id, player);
    player.loadRandomArray(7, 1, 20);
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
function skipToUnsorted(id) {
    var _a;
    (_a = players.get(id)) === null || _a === void 0 ? void 0 : _a.skipToUnsorted();
}
function skipToSorted(id) {
    var _a;
    (_a = players.get(id)) === null || _a === void 0 ? void 0 : _a.skipToSorted();
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
