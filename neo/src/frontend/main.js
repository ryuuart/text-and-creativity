import * as THREE from "three";

import World from "./components/World";

import Loader from "./loaders";

const MainWorld = new World({
    theatreProjectName: "NEO",
    animating: true,
})

// MainWorld.god.addSphere(1, 10, 10)
MainWorld.god.addBox();
MainWorld.theatre.project.ready.then(() => {
    MainWorld.currentMotionScene.sequence.play({ range: [0, 4], iterationCount: Infinity, direction: "alternateReverse" })
})
// MainWorld.scene.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0x00ff00 })))
