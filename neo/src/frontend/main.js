import * as THREE from "three";
import shuffle from "shuffle-array";

import World from "./components/World";
import anime from "animejs";
import chunk from "chunk";

import Loader from "./loaders";
import Marquee from "./motion/marquee3000";
import { Timeline } from "gsap/gsap-core";

window.addEventListener("load", () => {
    const MainWorld = new World({
        theatreProjectName: "NEO",
        animating: true,
        timeRate: 0.005,
        colors: {
            activeBackgroundColor: 0xECF2FF,
            activeContentColor: 0x2a5f90,
            accent: 0xfb627e,
        }
    })

    MainWorld.lightGod.addPointLight();
    const box = MainWorld.creationGod.addBox("transparent cube", {
        width: 8,
        height: 8,
        depth: 8,
        material: new THREE.MeshStandardMaterial({
            emissive: MainWorld.colors.accent,
            color: MainWorld.colors.accent,
            transparent: true,
            opacity: 0.5,
        })
    })
    box.position.x = 4;
    box.position.z = -2;

    setInterval(() => {
        box.position.y = 8
        box.position.x = -2
        setTimeout(() => {
            box.position.y = -2
            box.position.z = 1
        }, 2000)
        setTimeout(() => {
            box.position.x = -2
            box.position.y = 5
        }, 4000)
        setTimeout(() => {
            box.position.z = -4
            box.position.y = 9
        }, 6000)
        setTimeout(() => {
            box.position.y = 0
            box.position.x = 4
            box.position.z = -2
        }, 8000)
    }, 10000)

    box.animate((obj) => {
        obj.rotation.y += MainWorld.timeRate
    })

    const sphere = MainWorld.creationGod.addSphere("transparent sphere", {
        radius: 3,
        widthSegments: 5,
        heightSegments: 5,
        material: new THREE.MeshStandardMaterial({
            emissive: 0x1704FF,
            color: 0x1704FF,
            transparent: true,
            opacity: 0.5,
        })
    })
    sphere.position.x = -0.5
    sphere.position.z = 5
    sphere.animate((obj) => {
        obj.rotation.z += MainWorld.timeRate
        obj.rotation.x += MainWorld.timeRate
    })

    const chants = [];
    const prompt = document.getElementById("neo-console-prompt");
    const consoleTextContainer = document.getElementById("console-text");
    prompt.addEventListener("keyup", (ev) => {
        if (ev.code === "Enter") {
            chants.push({ text: prompt.value });

            const prayer = document.createElement("div");
            prayer.textContent = prompt.value;
            consoleTextContainer.appendChild(prayer);

            prompt.value = "";
            console.log(chants);
        }
    })

    function chunk3(collection, size) {
        var result = [];

        // default size to two item
        size = parseInt(size) || 2;

        // add each chunk to the result
        for (var x = 0; x < 3; x++) {
            var start = x * size;
            var end = start + size;

            result.push(collection.slice(start, end));
        }

        return result;
    }
    const URL = (process.env.NODE_ENV === "production") ? "https://uta-text-creativity-p-1.herokuapp.com/" : ""
    fetch("/words-50").then((response) => response.json()).then(data => {
        const collective = data;

        setTimeout(() => {
            const marqueess = chunk([...chants, ...shuffle(collective)], 10)
            console.log("MARQUEE", marqueess)
            fetch('add/words', {
                method: 'POST',
                credentials: "same-origin",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chants)
            }).then((response) => response.text()).then(data => {
                prompt.setAttribute("disabled", "")
                console.log("UPLOADED")
                const marquee = document.querySelector("#climax .row")

                marqueess.forEach((row, i) => {
                    const marqueeRow = document.createElement("div")
                    const marqueeWordContainer = document.createElement("div")
                    marqueeWordContainer.className = "marquee-container"
                    row.forEach(word => {
                        const marqueeItem = document.createElement("span")
                        marqueeItem.textContent = word.text
                        marqueeWordContainer.appendChild(marqueeItem)
                    })
                    marqueeRow.className = "marquee"
                    marqueeRow.setAttribute("data-speed", "0.5")
                    if (i % 2 !== 0) {
                        marqueeRow.setAttribute("data-reverse", "R to L")
                    }
                    marqueeRow.appendChild(marqueeWordContainer)
                    marquee.appendChild(marqueeRow)

                    if (marqueeWordContainer.childElementCount >= 1) {
                        const now = new Marquee({
                            element: marqueeRow,
                            gsap: Timeline,
                            name: "marquee-climax-word"
                        })
                        now.timeline.timeScale(0.075)
                    }
                })
            });
        }, 60000)

        const backgroundMarquee = new Marquee({
            element: document.querySelector("section.background"),
            gsap: Timeline,
            name: "background"
        })
        backgroundMarquee.timeline.timeScale(0.25)
    })
})
