import pug from "pug";
import pointOfView from "point-of-view";
import { web } from "../routes/index.js";

export default async function (app) {
    app.register(pointOfView, {
        engine: { pug }
    })

    app.register(web);
}