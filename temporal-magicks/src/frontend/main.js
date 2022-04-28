import { World } from "@18nguyenl/artificer";
import { Communi, Visio } from "./gods";

window.addEventListener("load", () => {
    const MainWorld = new World();
    MainWorld.assignGod(new Visio());
    MainWorld.assignGod(new Communi());
})
