"use strict";

let players = new Map<String, SortsPlayer>();

function randomAnimationTest(canvas: HTMLCanvasElement, id:string) {
    let player = players.get(id);
    if (player === null) {
        player = new SortsPlayer(canvas, "insertion", id);
        players.set(id, player);
        player.loadRandomArray(10, 1, 20);
    }
    for (let i = 0; i < 10; i++) {
        player!.randomAnimation(); 
    }
}

function initializeRandom(canvas: HTMLCanvasElement, sortType:string, id: string, entries: number, animationSpeed: number) {
    let player = new SortsPlayer(canvas, sortType, id);
    players.set(id, player);
    player.loadRandomArray(entries, 1, entries * 2);
    player.renderFrame();
    player.setAnimationSpeed(animationSpeed);
    player.repeat = false;
}

function initializeMiniPlayer(canvas: HTMLCanvasElement, sortType:string, id: string) {
    let player = new SortsPlayer(canvas, sortType, id);
    players.set(id, player);
    player.loadRandomArray(6, 1, 10);
    player.renderFrame();
    player.setAnimationSpeed(200);
    player.repeat = false;
    player.play();
}

function playPause(id: string) {
    players.get(id)?.playPause();
}

function stepForward(n: number = 1, id: string) {
    players.get(id)?.stepForward(n);
}

function stepBackward(n: number = 1, id: string) {
    players.get(id)?.stepBackward(n);
}

function reset(id: string) {
    players.get(id)?.reset()
}

function skipToUnsorted(id: string) {
    players.get(id)?.skipToUnsorted();
}

function skipToSorted(id: string) {
    players.get(id)?.skipToSorted();
}

function setAnimationSpeed(ms: number, id: string) {
    players.get(id)?.setAnimationSpeed(ms);
}

function stop(id: string) {
    let player = players.get(id);
    if (player !== undefined) {
        player.running = false;
    } else {
        console.error(`Cannot stop sorts player id:"${id}" because no such player exsists`);
    }
}

function start(id: string) {
    let player = players.get(id);
    if (player !== undefined) {
        player.running = true;
    } else {
        console.error(`Cannot stop sorts player id:"${id}" because no such player exsists`);
    }
}

runAnimation();
function runAnimation() {
    players.forEach (function(value, key) {
        if (value.running) {
            value.run()
        }
    })
    requestAnimationFrame(runAnimation);
}