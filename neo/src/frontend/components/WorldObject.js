
export default class WorldObject {
    constructor(name, mesh, motionState) {
        this.name = name;
        this.mesh = mesh;
        this.motionState = motionState;

        this.motionState.onValuesChange(this.onChange.bind(this));
    }

    onChange(newValue) {
        const { x: xp, y: yp, z: zp } = newValue.position;
        this.mesh.position.set(xp, yp, zp);

        const { x: xr, y: yr, z: zr } = newValue.rotation;
        this.mesh.rotation.set(xr, yr, zr);
    }
}