import fastifyPlugin from "fastify"
import crypto from "crypto";

export default fastifyPlugin(async (fastify, options, done) => {
    let CURRENT_CIRCLE = {
        id: crypto.randomUUID(),
        objects: []
    }

    async function addSpellAction(data) {
        this.objects.push(data.object)
        console.log(CURRENT_CIRCLE.objects);
    }
    fastify.decorate("addSpellAction", addSpellAction);

    done();
})