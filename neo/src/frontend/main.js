import * as THREE from "three";
import chunk from "chunk";
import shuffle from "shuffle-array";

import World from "./components/World";
import anime from "animejs";

import Loader from "./loaders";

window.addEventListener("load", () => {
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


    fetch("/words-10").then((response) => response.json()).then(data => {
        const collective = data;
        const marquees = chunk(shuffle([...chants, ...collective]))

        setTimeout(() => {
            console.log('should have uploaded')
            fetch('/add/words', {
                method: 'POST',
                credentials: "same-origin",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chants)
            }).then((response) => response.text()).then(data => { console.log(data) });
        }, 8000)
        console.log(marquees)
    })
})
