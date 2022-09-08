import { Sequelize, DataTypes } from "sequelize";
import { connection } from "../database/db.js";

export const Feriado = connection.define(
    "Feriado",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        data: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "Feriado",
        timestamps: false,
    }
);

Feriado.sync({ force: false }).then(() => {});
