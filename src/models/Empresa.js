import { Sequelize, DataTypes } from "sequelize";
import { connection } from "../database/db.js";

export const Empresa = connection.define(
    "Empresa",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        cnpj: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        data_fundacao: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        valor_hora: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: false,
        },
    },
    {
        tableName: "Empresa",
        timestamps: false,
    }
);

Empresa.sync({ force: false }).then(() => {});
