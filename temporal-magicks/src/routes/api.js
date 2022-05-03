export function API(fastify, options, done) {
    fastify.register((fastify, options, done) => {
        const connections = [];
        fastify.get("/circle/initialize", async (req, rep) => {
            const CurrentCircle = await fastify.getCurrentCircle();

            rep.send({ data: CurrentCircle.objects });
        })

        fastify.get("/circle", { websocket: true }, async (connection, req) => {
            await connections.push(connection);
            await connection.socket.on('message', async message => {
                const msg = JSON.parse(message);
                console.log("MESSAGE RECEIVED");
                console.log(msg)
                await fastify.addSpellAction(msg.data);
                connections.forEach(con => {
                    con.socket.send(JSON.stringify({ action: msg.action, data: msg.data }))
                })
            })
        })

        done();
    })
    done();
}