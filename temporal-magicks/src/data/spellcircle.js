import fastifyPlugin from "fastify"
import crypto from "crypto";

export default fastifyPlugin(async (fastify, options, done) => {
    let CURRENT_CIRCLE = {
        id: crypto.randomUUID(),
        objects: []
    }

})