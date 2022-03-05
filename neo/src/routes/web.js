export default function async(fastify, options, done) {
    fastify.get("/", async (req, rep) => {
        rep.view("/src/views/index.pug", {
            words: JSON.stringify((await fastify.dbGetNWords(2)).rows)
        })
    })

    done();
}