import dotenv from "dotenv";
import path from "path"

export default async function () {
    dotenv.config({ path: path.resolve(process.cwd(), "./.env") });
}