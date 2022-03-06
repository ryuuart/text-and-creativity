import * as THREE from "three";
import { getProject } from "@theatre/core"
import studio from "@theatre/studio"

// initialize the studio so the editing tools will show up on the screen
studio.initialize()

// create a project
const proj = getProject(
    // the ID of the project is "My first project"
    "First project"
)

// create a sheet
const sheet = proj.sheet(
    // Our sheet is identified as "Scene"
    "Scene"
)

// create an object
const obj = sheet.object(
    // The object's key is "Fist object"
    "First object",
    // These are the object's default values (and as we'll later learn, its props types)
    {
        // we pick our first props's name to be "foo". It's default value is 0.
        // Theatre will determine that the type of this prop is a number
        foo: 0,
        // Second prop is a boolean called "bar", and it defaults to true.
        bar: true,
        // Last prop is a string
        baz: "A string",
    }
)


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();