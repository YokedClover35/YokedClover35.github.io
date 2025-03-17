"use strict";

document.getElementById("config-form")?.addEventListener("submit", function(event) {
    event.preventDefault();
});

function fillForm(id:string, sim: ParticleSim) {
    console.log("form filled");
    let config = sim.config;
    let form: HTMLFormElement;
    if (id == "") {
        form = document.forms[0];
    } else {
        form = document.getElementById(id) as HTMLFormElement;
    }
    

    //config classes
    form.pointCount.value = sim.config.pointCount;
    form.physicsStepsPerFrame.value = sim.config.physicsStepsPerFrame;
    form.velMax.value = sim.pointCreationConfig.velMax;
    form.radiusMin.value = sim.pointCreationConfig.radiusMin;
    form.radiusMax.value = sim.pointCreationConfig.radiusMax;
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

    form.displayPoints.checked = config.simDisplayConfig.displayPoints;
    form.displayLines.checked = config.simDisplayConfig.displayLines;
    form.frameFade.checked = config.simDisplayConfig.frameFade;
    form.frameFadeFactor.value = config.simDisplayConfig.frameFadeFactor;
}

function exportForm(id: string, sim: ParticleSim) {
    console.log("form submitted");
    let config = sim.config;
    let form: HTMLFormElement;
    if (id == "") {
        form = document.forms[0];
    } else {
        form = document.getElementById(id) as HTMLFormElement;
    }
    

    //config classes
    sim.config.pointCount = form.pointCount.value != "" ? form.pointCount.value : sim.config.pointCount;
    sim.createPoints();
    sim.config.physicsStepsPerFrame = form.physicsStepsPerFrame.value != "" ? form.physicsStepsPerFrame.value : sim.config.physicsStepsPerFrame;

    //pointcreation
    sim.pointCreationConfig.velMax = form.velMax.value != "" ? form.velMax.value : sim.pointCreationConfig.velMax;
    sim.pointCreationConfig.radiusMin = form.radiusMin.value != "" ? form.radiusMin.value : sim.pointCreationConfig.radiusMin;
    sim.pointCreationConfig.radiusMax = form.radiusMax.value != "" ? form.radiusMax.value : sim.pointCreationConfig.radiusMax;

    //physics
    config.simPhysicsConfig.timeStep = form.timeStep.value != "" ? form.timeStep.value : config.simPhysicsConfig.timeStep;
    config.simPhysicsConfig.interactionDistance = form.interactionDistance.value != "" ? form.interactionDistance.value : config.simPhysicsConfig.interactionDistance;
    sim.createPointGrid();
    config.simPhysicsConfig.bounceFactor = form.bounceFactor.value != "" ? form.bounceFactor.value : config.simPhysicsConfig.bounceFactor;
    config.simPhysicsConfig.maxVel = form.maxVel.value != "" ? form.maxVel.value : config.simPhysicsConfig.maxVel;
    config.simPhysicsConfig.frictionMultiplier = form.frictionMultiplier.value != "" ? form.frictionMultiplier.value : config.simPhysicsConfig.frictionMultiplier;
    config.simPhysicsConfig.pointToPointCollisions = form.pointToPointCollisions.checked;
    config.simPhysicsConfig.pointForceMultiplier = form.pointForceMultiplier.value != "" ? form.pointForceMultiplier.value : config.simPhysicsConfig.pointForceMultiplier; 
    config.simPhysicsConfig.cursorCarryForceMultiplier = form.cursorCarryForceMultiplier.value != "" ? form.cursorCarryForceMultiplier.value : config.simPhysicsConfig.cursorCarryForceMultiplier;
    config.simPhysicsConfig.cursorForceMultiplier = form.cursorForceMultiplier.value != "" ? form.cursorForceMultiplier.value : config.simPhysicsConfig.cursorForceMultiplier;
    config.simPhysicsConfig.maxCursorInteractionDistance = form.maxCursorInteractionDistance.value != "" ? form.maxCursorInteractionDistance.value : config.simPhysicsConfig.maxCursorInteractionDistance;
    config.simPhysicsConfig.maxCursorCarryDistance = form.maxCursorCarryDistance.value != "" ? form.maxCursorCarryDistance.value : config.simPhysicsConfig.maxCursorCarryDistance;
    config.simPhysicsConfig.cursorRingDistance = form.cursorRingDistance.value != "" ? form.cursorRingDistance.value : config.simPhysicsConfig.cursorRingDistance;

    //display
    config.simDisplayConfig.displayPoints = form.displayPoints.checked;
    config.simDisplayConfig.displayLines = form.displayLines.checked;
    config.simDisplayConfig.frameFade = form.frameFade.checked;
    config.simDisplayConfig.frameFadeFactor = form.frameFadeFactor.value != "" ? form.frameFadeFactor.value : config.simDisplayConfig.frameFadeFactor;



    // debug = false;
    // showFps = true;


    // pointCount = 4000;
    // physicsStepsPerFrame = 2;
}
