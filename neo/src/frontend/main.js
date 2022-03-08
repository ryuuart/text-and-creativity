import * as THREE from "three";

import World from "./components/World";
import anime from "animejs";

import Loader from "./loaders";

const MainWorld = new World({
    theatreProjectName: "NEO",
    animating: true,
    timeRate: 0.01,
    colors: {
        activeBackgroundColor: 0x262C27,
        activeContentColor: 0x2a5f90,
        accent: 0xfb627e,
    }
})

MainWorld.lightGod.addPointLight();
const box = MainWorld.creationGod.addBox("transparent cube", {
    width: 2,
    height: 2,
    depth: 2,
    material: new THREE.MeshStandardMaterial({
        emissive: MainWorld.colors.accent,
        color: MainWorld.colors.accent,
        transparent: true,
        opacity: 0.5,
    })
})

box.animate((obj) => {
    obj.rotation.y += MainWorld.timeRate
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
