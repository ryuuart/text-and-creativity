import { getProject } from "@theatre/core"
import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import God from "./God";
import studio from "@theatre/studio"
import state from "../motion/state.json";

export default class World {
    constructor(options) {
        // initialize the studio so the editing tools will show up on the screen
        if (process.env.NODE_ENV === "development") {
            studio.initialize()
        }

        Object.assign(this, {
            theatreProjectName: "Project",
            animating: false,
        }, options)

        this.objects = [];

        const config = { state }
        this.theatre = {};
        this.theatre.project = getProject(this.theatreProjectName, config);
        this.theatre.sheets = {
            mainScene: this.theatre.project.sheet("Main Scene"),
        };
        this.currentMotionScene = this.theatre.sheets.mainScene;

        this.three = {};
        this.camera = this.three.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.scene = this.three.scene = new Scene();

        this.renderer = this.three.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", (e) => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        })

        this.god = new God(this);

        document.body.appendChild(this.renderer.domElement);

        if (this.animating) {
            this.animate();
        } else {
            this.renderFrame();
        }
    }

    setScene(motionScene, worldScene) {
        this.currentMotionScene = this.theatre.sheets[motionScene];
        this.scene = this.three.scene = worldScene;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))

        this.renderer.render(this.scene, this.camera);
    }

    renderFrame() {
        this.renderer.render(this.scene, this.camera);
    }
}
