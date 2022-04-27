import FastifyWebsocket from "fastify-websocket";

import { websocket } from "../routes/index.js";

export default async function (app) {
    app.register(FastifyWebsocket);
    app.register(websocket);
}