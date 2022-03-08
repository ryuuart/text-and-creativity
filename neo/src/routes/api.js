export function API(fastify, options, done) {
    fastify.register((fastify, options, done) => {
        fastify.get("/words-:num", async (req, rep) => {
            const { rows } = await fastify.dbGetNWords(req.params.num);
            rep.send(JSON.stringify(rows));
        })

        fastify.post("/add/words", async (req, rep) => {
            fastify.dbInsertWords(req.body);
            rep.send("Words Inserted");
        })

        done();
    })
    done();
}