export async function web(fastify, options) {
    fastify.get('/', async (req, rep) => {
        const client = await fastify.pg.connect();
        const { rows } = await client.query('SELECT text FROM words LIMIT 50');
        client.release();
        return rows;
    })
}