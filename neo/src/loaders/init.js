import Config from "../../util/config.js";
import { Model } from "../data/index.js";
import { API } from "../routes/index.js";

export default async function (app) {
    await Config();
    app.register(Model);
    app.register(API);
}