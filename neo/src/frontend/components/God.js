import { Mesh, SphereGeometry, BoxGeometry, MeshBasicMaterial, AmbientLight } from "three";
import { PointLight } from "three";
import WorldObject from "./WorldObject";

import state from "../motion/state.json";
import studio from "@theatre/studio"
import { getProject } from "@theatre/core"

export class God {
    constructor(world, options) {
        Object.assign(this, {
        }, options)

        this.world = world;
    }
}

export class Audion extends God {
    constructor(world, options) {
        super(world, options)

        Object.assign(this, {
            // backgroundMusicURL: "/VOLANT - NEOY2K.mp3",
            backgroundMusicURL: "/DVI-i PARAMETER.mp3",
        }, options)

        this.backgroundMusic = new Audio(this.backgroundMusicURL)
        this.backgroundMusic.setAttribute("autoplay", "")
        let playAttempt = setInterval(() => {
            this.backgroundMusic.play()
                .then(() => {
                    clearInterval(playAttempt);
                })
                .catch(error => {
                    console.log('Unable to play the video, User has not interacted yet.');
                });
        }, 3000);
    }
}

export class Creatio extends God {
    constructor(world, options) {
        super(world, options)

        Object.assign(this, {
            defaultMaterialColor: 0xdddddd,
        }, options)
    }

    addBox(name = "box", settings) {
        const params = {};
        Object.assign(params, { width: 1, height: 1, depth: 1, widthSegments: 1, heightSegments: 1 }, settings);
        return this.addWorldObject(name, new BoxGeometry(params.width, params.height, params.depth, params.widthSegments, params.heightSegments), params.material);
    }

    addSphere(name = "sphere", settings, material) {
        const params = { material: material };
        Object.assign(params, { radius: 1, widthSegments: 10, heightSegments: 10 }, settings)
        return this.addWorldObject(name, new SphereGeometry(params.radius, params.widthSegments, params.heightSegments), params.material);
    }

    addWorldObject(name, geometry, material = new MeshBasicMaterial({ color: this.defaultMaterialColor })) {
        let motionState = undefined;
        if (this.world.animating && this.world.motionGod.theatre) {
            motionState = this.world.motionGod.currentMotionScene.object(name, {
                position: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0,
                }
            });
        }
        const object = new WorldObject(name, geometry, material, motionState);
        this.world.objects.push(object);

        this.world.scene.add(object)

        return object;
    }
}

export class Movementur extends God {
    constructor(world, options) {
        super(world, options)

        // initialize the studio so the editing tools will show up on the screen
        if (process.env.NODE_ENV === "development" && this.world.theatre) {
            studio.initialize()
        }

        Object.assign(this, {
            theatreProjectName: "Project",
        }, options)

        if (this.world.animating) {
            this.animate();
        } else {
            this.renderFrame();
        }

        const config = { state }
        const fourthWall = [];
        this.theatre = {};
        this.theatre.project = getProject(this.theatreProjectName, config);
        this.theatre.sheets = {
            mainScene: this.theatre.project.sheet("Main Scene"),
        };
        this.world.currentMotionScene = this.theatre.sheets["mainScene"];

        this.currentMotionScene = this.theatre.sheets.mainScene;
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this))

        this.world.time += this.world.timeRate;
        this.world.objects.forEach((obj) => {
            if (obj.animated)
                obj.action()
        })

        this.world.renderer.render(this.world.scene, this.world.camera);
    }

    renderFrame() {
        this.world.renderer.render(this.scene, this.camera);
    }
}

export class Lumina extends God {
    constructor(world, options) {
        super(world, options)


    }

    addAmbientLight(color, intensity) {
        this.world.scene.add(new AmbientLight(color, intensity));
    }

    addPointLight(options) {
        const params = {};
        Object.assign(params, {
            color: 0xffffff,
            intensity: 1,
            distance: 0,
            decay: 1,
            position: {
                x: 50, y: 50, z: 50,
            }
        }, options)
        const { color, intensity, distance, decay } = params;
        const { x, y, z } = params.position;

        const light = new PointLight(color, intensity, distance, decay);

        light.position.set(x, y, z);

        this.world.scene.add(light);
    }
}