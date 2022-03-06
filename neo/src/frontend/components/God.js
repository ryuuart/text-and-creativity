import { Mesh, SphereGeometry, BoxGeometry, MeshBasicMaterial } from "three";
import { PointLight } from "three";
import shortid from "shortid";

import WorldObject from "./WorldObject";

export default class God {
    constructor(world, options) {
        Object.assign(this, {
            defaultMaterialColor: 0xdddddd,
        }, options)

        this.world = world;
    }

    addBox(name = "box", settings, material) {
        const params = {};
        Object.assign(params, { width: 1, height: 1, depth: 1, widthSegments: 1, heightSegments: 1 }, settings);
        this.addWorldObject(name, new BoxGeometry(params.width, params.height, params.depth, params.widthSegments, params.heightSegments), material);
    }

    addSphere(name = "sphere", settings, material) {
        const params = {};
        Object.assign(params, { radius: 1, widthSegments: 10, heightSegments: 10 }, settings)
        this.addWorldObject(name, new SphereGeometry(params.radius, params.widthSegments, params.heightSegments), material);
    }

    addWorldObject(name, geometry, material = new MeshBasicMaterial({ color: this.defaultMaterialColor })) {
        const mesh = new Mesh(geometry, material);
        const motionState = this.world.currentMotionScene.object(name, {
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
        const object = new WorldObject(name, mesh, motionState);
        this.world.objects.push(object);

        this.world.scene.add(object.mesh)
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