import fastifyPlugin from "fastify-plugin";
import fastifyPostgres from "fastify-postgres"

export default fastifyPlugin(async (fastify, options, done) => {
    await fastify.register(fastifyPostgres, {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    // let dbClient = await fastify.pg.connect();
    let dbClient;
    fastify.addHook('onRequest', async (request, reply, payload, done) => {
        let client = await fastify.pg.connect();
        dbClient = client;
    })

    async function getNWords(n) {
        return await dbClient.query('SELECT text FROM words LIMIT ' + n);
    }
    fastify.decorate("dbGetNWords", getNWords);

    async function query(query) {
        return await fastify.dbClient.query(query);
    }
    fastify.decorate("dbQuery", query);

    async function insertWords(words) {
        try {
            await dbClient.query('BEGIN')
            const queryText = 'INSERT INTO words VALUES($1)'
            words.forEach(async word => {
                console.log("Attempt insert " + word)
                await dbClient.query(queryText, [word])
            })
            await dbClient.query('COMMIT')
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            dbClient.release()
        }
    }
    fastify.decorate("dbInsertWords", insertWords)

    fastify.addHook('onClose', async (request, reply, payload, done) => {
        await dbClient.release();
        done();
    })

    done();
});