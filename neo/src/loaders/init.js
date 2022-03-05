import Config from "../../util/config.js";
import fastifyPostgres from "fastify-postgres"

export default async function (app) {
    await Config();

    app.register(fastifyPostgres, {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? true : false,
        sslmode: process.env.NODE_ENV === "production" ? "require" : "disable",
    })
}