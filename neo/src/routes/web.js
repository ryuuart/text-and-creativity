export async function web(fastify, options) {
    fastify.get('/', async (req, rep) => {
        return "ehj!"
    })
}