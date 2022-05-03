import Config from "../../util/config.js";
import { fileURLToPath } from 'url';
import fastifyStatic from "fastify-static";
import path from "node:path";
import { API } from "../routes/index.js";

export default async function (app) {
    await Config();

    app.register(fastifyStatic, {
        root: path.join(path.dirname(fileURLToPath(import.meta.url)), "../public"),
    });

    app.register(API);
}