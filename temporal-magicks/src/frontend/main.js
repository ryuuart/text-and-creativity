import { World } from "@18nguyenl/artificer";
import { Visio } from "./gods";

window.addEventListener("load", () => {
    const wsButton = document.getElementById("websocket");
    const websocket = new WebSocket(`ws://${window.location.host}/circle/`)
    wsButton.addEventListener("click", (ev) => {
    })

    const MainWorld = new World();
    MainWorld.assignGod(new Visio());

    MainWorld.pantheon["Visio"].act((visio) => {
        const firstCircle = visio.createCircle(100, 100);
        visio.createAlignedText("YHesso", firstCircle, { fontSize: 10 }, 1.25);
    })
    // create a PointText object for a string and a style


    // createAlignedText("Testin the wonderful magic circle let's not ask questions", firstCircle, { fontSize: 10 }, 1.25);
    // createAlignedText("One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them", secondCircle, { fontSize: 10 }, 1.25);
    // createAlignedText("Potato one two three four", finalLine, { fontSize: 10 }, 1.0);
    // line.onClick = () => {
    // }
})
