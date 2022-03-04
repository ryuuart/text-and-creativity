// Require the framework and instantiate it
import Fastify from "fastify";
import Initializer from "./loaders/index.js";

const fastify = Fastify({ logger: true })

// Run the server!
const start = async () => {
    try {
        Initializer(fastify)

        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()