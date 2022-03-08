import { Mesh } from "three";

export default class WorldObject extends Mesh {
    constructor(name, geometry, material, motionState) {
        super(geometry, material)
        this.name = name;
        this.motionState = motionState;
        this.behavior = (worldObject) => { }
        this.action = () => this.behavior(this)
        this.animated = false;

        if (motionState) {
            this.motionState.onValuesChange(this.onChange.bind(this));
        }
    }

    onChange(newValue) {
        const { x: xp, y: yp, z: zp } = newValue.position;
        this.position.set(xp, yp, zp);

        const { x: xr, y: yr, z: zr } = newValue.rotation;
        this.rotation.set(xr, yr, zr);
    }

    stopAnimating() {
        this.animated = false;
    }

    animate(behavior = this.behavior) {
        this.behavior = behavior
        this.animated = true;
    }
}