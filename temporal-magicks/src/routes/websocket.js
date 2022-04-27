export default async function (fastify, options, done) {
    fastify.get("/circle", { websocket: true }, (connection, req) => {
        connection.socket.on('message', message => {
            // message.toString() === 'hi from client'
            connection.socket.send('hi from server')
        })
    })
}