import express from "express";
import routes from "./routes.js";
import dotenv from "dotenv";

import { connection } from "./database/db.js";

dotenv.config();

try {
    await connection.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}

const app = express();

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3000, () =>
    console.log('Servidor rodando na porta ' + process.env.PORT)
);
