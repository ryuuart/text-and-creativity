import { MeshStandardMaterial } from "three";
import shuffle from "shuffle-array";

// import { TwoDVectorWorld, God } from "@18nguyenl/artificer";
import anime from "animejs";
import { Vector3 } from "three";
import Paper from "paper";

window.addEventListener("load", () => {
    const canvas = document.getElementById('canvas');
    Paper.setup(canvas)

    const firstCircle = new Paper.Path.Circle(new Paper.Point(100, 70), 32);
    firstCircle.strokeColor = (0, 0, 0);

    const secondCircle = new Paper.Path.Circle(new Paper.Point(200, 300), 32);
    secondCircle.strokeColor = (0, 0, 0);
})
