import { web } from "../routes/web.js";

export default async function (app) {
    app.register(web);
}