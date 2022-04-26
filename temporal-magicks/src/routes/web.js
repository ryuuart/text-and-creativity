export default function async(fastify, options, done) {
    fastify.get("/", async (req, rep) => {
        rep.view("/src/views/index.pug", {
            title: "Temporal Magicks"
        })
    })

    done();
}