import fastifyPlugin from "fastify-plugin";
import fastifyPostgres from "fastify-postgres"

export default fastifyPlugin(async (fastify, options, done) => {
    await fastify.register(fastifyPostgres, {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    const client = await fastify.pg.connect();
    fastify.decorate("dbClient", client);

    async function getNWords(n) {
        return await fastify.dbClient.query('SELECT text FROM words LIMIT ' + n);
    }
    fastify.decorate("dbGetNWords", getNWords);

    async function query(query) {
        return await fastify.dbClient.query(query);
    }
    fastify.decorate("dbQuery", query);

    function insertWords() {
        // TODO
    }

    fastify.addHook('onClose', async (request, reply, payload, done) => {
        await fastify.dbClient.release();
        done();
    })

    done();
});