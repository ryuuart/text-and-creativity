export function API(fastify, options, done) {
    fastify.register((fastify, options, done) => {
        fastify.get("/words-:num", async (req, rep) => {
            const { rows } = await fastify.dbGetNWords(req.params.num);
            rep.send(req.params.num + " words: " + JSON.stringify(rows));
        })

        fastify.post("/add/words", async (req, rep) => {

        })

        done();
    })
    done();
}