import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DB_DATABASE, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

export const connection = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mysql",
    port: DB_PORT,
    logging: false,
});
