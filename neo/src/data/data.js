import fastifyPlugin from "fastify-plugin";
import fastifyPostgres from "fastify-postgres"

export default fastifyPlugin(async (fastify, options, done) => {
    await fastify.register(fastifyPostgres, {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    let dbClient;
    fastify.addHook('onRequest', async (request, reply, payload, done) => {
        let client = await fastify.pg.connect();
        dbClient = client;
    })

    fastify.addHook('onResponse', async (request, reply, payload, done) => {
        await dbClient.release();
    })

    async function getNWords(n) {
        const words = await dbClient.query('SELECT text FROM words ORDER BY random() LIMIT ' + n);
        return words;
    }
    fastify.decorate("dbGetNWords", getNWords);

    async function query(query) {
        const words = await fastify.dbClient.query(query);
        return words;
    }
    fastify.decorate("dbQuery", query);

    async function insertWords(words) {
        try {
            await dbClient.query('BEGIN')
            const queryText = 'INSERT INTO words VALUES($1)'
            words.forEach(async word => {
                console.log("Attempt insert " + word.text)
                await dbClient.query(queryText, [word.text])
            })
            await dbClient.query('COMMIT')
        } catch (e) {
            await dbClient.query('ROLLBACK')
            throw e
        }
    }
    fastify.decorate("dbInsertWords", insertWords)

    done();
});