import init from "./init.js";
import views from "./views.js";

export default async function (app) {
    await init(app);
    await views(app);
}