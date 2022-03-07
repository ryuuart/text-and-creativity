import * as THREE from "three";

import World from "./components/World";

import Loader from "./loaders";

const MainWorld = new World({
    theatreProjectName: "NEO",
    animating: true,
    colors: {
        activeBackgroundColor: 0xf6fffd,
        activeContentColor: 0x2a5f90,
        loadingBackgroundColor: 0x2a5f90,
        loadingContentColor: 0xf6fffd,
        accent: 0xfb627e,
    }
})

// MainWorld.god.addAmbientLight(MainWorld.colors.activeBackgroundColor);
MainWorld.god.addPointLight();
MainWorld.god.addSphere()
MainWorld.god.addBox("transparent cube", {
    material: new THREE.MeshStandardMaterial({
        emissive: MainWorld.colors.accent,
        color: MainWorld.colors.accent,
        transparent: true,
        opacity: 0.5,
    })
});
MainWorld.god.addBox("transparent cube 2", {
    material: new THREE.MeshStandardMaterial({
        emissive: MainWorld.colors.accent,
        color: MainWorld.colors.accent,
        transparent: true,
        opacity: 0.5,
    })
});
MainWorld.theatre.project.ready.then(() => {
    MainWorld.currentMotionScene.sequence.play({ range: [0, 4], iterationCount: Infinity, direction: "alternateReverse" })
})

const chants = [];
const prompt = document.getElementById("neo-console-prompt");
const consoleTextContainer = document.getElementById("console-text");
prompt.addEventListener("keyup", (ev) => {
    if (ev.code === "Enter") {
        chants.push(prompt.value);

        const prayer = document.createElement("div");
        prayer.textContent = prompt.value;
        consoleTextContainer.appendChild(prayer);

        prompt.value = "";
        console.log(chants);
    }
})
// MainWorld.scene.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0x00ff00 })))
