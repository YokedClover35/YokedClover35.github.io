"use strict";
var _a;
(_a = document.getElementById("config-form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", function (event) {
    event.preventDefault();
});
function fillForm(id, sim) {
    console.log("form filled");
    let config = sim.config;
    let form;
    if (id == "") {
        form = document.forms[0];
    }
    else {
        form = document.getElementById(id);
    }
    //config classes
    form.pointCount.value = sim.config.pointCount;
    form.physicsStepsPerFrame.value = sim.config.physicsStepsPerFrame;
    //point creation
    form.velMax.value = sim.pointCreationConfig.velMax;
    form.radiusMin.value = sim.pointCreationConfig.radiusMin;
    form.radiusMax.value = sim.pointCreationConfig.radiusMax;
    //physics
    form.timeStep.value = config.simPhysicsConfig.timeStep;
    form.interactionDistance.value = config.simPhysicsConfig.interactionDistance;
    form.bounceFactor.value = config.simPhysicsConfig.bounceFactor;
    form.maxVel.value = config.simPhysicsConfig.maxVel;
    form.frictionMultiplier.value = config.simPhysicsConfig.frictionMultiplier;
    form.pointToPointCollisions.checked = config.simPhysicsConfig.pointToPointCollisions;
    form.pointForceMultiplier.value = config.simPhysicsConfig.pointForceMultiplier;
    form.cursorCarryForceMultiplier.value = config.simPhysicsConfig.cursorCarryForceMultiplier;
    form.cursorForceMultiplier.value = config.simPhysicsConfig.cursorForceMultiplier;
    form.maxCursorInteractionDistance.value = config.simPhysicsConfig.maxCursorInteractionDistance;
    form.maxCursorCarryDistance.value = config.simPhysicsConfig.maxCursorCarryDistance;
    form.cursorRingDistance.value = config.simPhysicsConfig.cursorRingDistance;
    //display
    form.displayPoints.checked = config.simDisplayConfig.displayPoints;
    form.displayLines.checked = config.simDisplayConfig.displayLines;
    form.frameFade.checked = config.simDisplayConfig.frameFade;
    form.frameFadeFactor.value = config.simDisplayConfig.frameFadeFactor;
    //debug
    form.debug.checked = config.debugConfig.debug;
    form.showFps.checked = config.debugConfig.showFps;
}
function exportForm(id, sim) {
    console.log("form submitted");
    let config = sim.config;
    let form;
    if (id == "") {
        form = document.forms[0];
    }
    else {
        form = document.getElementById(id);
    }
    //config classes
    sim.config.pointCount = Number.parseInt(form.pointCount.value != "" ? form.pointCount.value : sim.config.pointCount);
    sim.config.physicsStepsPerFrame = Number.parseInt(form.physicsStepsPerFrame.value != "" ? form.physicsStepsPerFrame.value : sim.config.physicsStepsPerFrame);
    //pointcreation
    sim.pointCreationConfig.velMax = Number.parseFloat(form.velMax.value != "" ? form.velMax.value : sim.pointCreationConfig.velMax);
    sim.pointCreationConfig.radiusMin = Number.parseFloat(form.radiusMin.value != "" ? form.radiusMin.value : sim.pointCreationConfig.radiusMin);
    sim.pointCreationConfig.radiusMax = Number.parseFloat(form.radiusMax.value != "" ? form.radiusMax.value : sim.pointCreationConfig.radiusMax);
    //physics
    config.simPhysicsConfig.timeStep = Number.parseFloat(form.timeStep.value != "" ? form.timeStep.value : config.simPhysicsConfig.timeStep);
    config.simPhysicsConfig.interactionDistance = Number.parseFloat(form.interactionDistance.value != "" ? form.interactionDistance.value : config.simPhysicsConfig.interactionDistance);
    config.simPhysicsConfig.bounceFactor = Number.parseFloat(form.bounceFactor.value != "" ? form.bounceFactor.value : config.simPhysicsConfig.bounceFactor);
    config.simPhysicsConfig.maxVel = Number.parseFloat(form.maxVel.value != "" ? form.maxVel.value : config.simPhysicsConfig.maxVel);
    config.simPhysicsConfig.frictionMultiplier = Number.parseFloat(form.frictionMultiplier.value != "" ? form.frictionMultiplier.value : config.simPhysicsConfig.frictionMultiplier);
    config.simPhysicsConfig.pointToPointCollisions = form.pointToPointCollisions.checked;
    config.simPhysicsConfig.pointForceMultiplier = Number.parseFloat(form.pointForceMultiplier.value != "" ? form.pointForceMultiplier.value : config.simPhysicsConfig.pointForceMultiplier);
    config.simPhysicsConfig.cursorCarryForceMultiplier = Number.parseFloat(form.cursorCarryForceMultiplier.value != "" ? form.cursorCarryForceMultiplier.value : config.simPhysicsConfig.cursorCarryForceMultiplier);
    config.simPhysicsConfig.cursorForceMultiplier = Number.parseFloat(form.cursorForceMultiplier.value != "" ? form.cursorForceMultiplier.value : config.simPhysicsConfig.cursorForceMultiplier);
    config.simPhysicsConfig.maxCursorInteractionDistance = Number.parseFloat(form.maxCursorInteractionDistance.value != "" ? form.maxCursorInteractionDistance.value : config.simPhysicsConfig.maxCursorInteractionDistance);
    config.simPhysicsConfig.maxCursorCarryDistance = Number.parseFloat(form.maxCursorCarryDistance.value != "" ? form.maxCursorCarryDistance.value : config.simPhysicsConfig.maxCursorCarryDistance);
    config.simPhysicsConfig.cursorRingDistance = Number.parseFloat(form.cursorRingDistance.value != "" ? form.cursorRingDistance.value : config.simPhysicsConfig.cursorRingDistance);
    //display
    config.simDisplayConfig.displayPoints = form.displayPoints.checked;
    config.simDisplayConfig.displayLines = form.displayLines.checked;
    config.simDisplayConfig.frameFade = form.frameFade.checked;
    config.simDisplayConfig.frameFadeFactor = Number.parseFloat(form.frameFadeFactor.value != "" ? form.frameFadeFactor.value : config.simDisplayConfig.frameFadeFactor);
    //debug
    config.debugConfig.debug = form.debug.checked;
    config.debugConfig.showFps = form.showFps.checked;
    sim.createPoints();
    sim.createPointGrid();
}
