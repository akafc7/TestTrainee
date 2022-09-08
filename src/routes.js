import express from "express";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";
import moment from "moment";
import { Empresa } from "./models/Empresa.js";
import { Feriado } from "./models/Feriado.js";
import Op from "sequelize";

import { isValueInvalid, getWorkingDays } from "./utils.js";

const routes = express.Router();

routes.post("/empresas", async (req, res) => {
    const data = req.body;
    const requiredFields = ["nome", "cnpj", "data_fundacao", "valor_hora"];
    for (const field of requiredFields) {
        if(!data[field]) {
            return res.status(400).json({
                statusCode: 400,
                error: `O campo ${field} é obrigatório`
            });
        }
    }
    const { nome, cnpj, data_fundacao, valor_hora } = data;

    try {
        if (nome.length > 50) {
            throw new Error("Nome da empresa deve ter até 50 caracteres");
        }
        if (!cnpjValidator.isValid(cnpj)) {
            throw new Error("Cnpj inválido");
        }
        // Verificar se é o unico na tabela
        if (!moment(data_fundacao, "YYYY-MM-DD", true).isValid()) {
            throw new Error(
                "Formato de Data inválido. Tente pelo formato ISO (YYYY-MM-DD)"
            );
        }
        if (isValueInvalid(valor_hora)) {
            throw new Error("Formato inválido");
        }

        const empresa = await Empresa.findOne({
            where: {
                cnpj: cnpj,
            },
        });
        if (empresa) {
            throw new Error("Cnpj já registrado.");
        }
        await Empresa.create({
            nome: nome,
            cnpj: cnpj,
            valor_hora: valor_hora,
            data_fundacao: data_fundacao,
        });

        return res.sendStatus(200);
    } catch (err) {
        return res.status(400).json({
            statusCode: 400,
            error: err.message,
        });
    }
});

routes.post("/calculo", async (req, res) => {
    const data = req.body;
    const requiredFields = ["cnpj", "data_inicio", "data_fim"];
    for (const field of requiredFields) {
        if(!data[field]) {
            return res.status(400).json({
                statusCode: 400,
                error: `O campo ${field} é obrigatório`
            });
        }
    }
    const { cnpj, data_inicio, data_fim } = data;

    try {
        const empresa = await Empresa.findOne({
            where: {
                cnpj: cnpj,
            },
        });
        const feriados = await Feriado.findAll({
            where: {
                data: {
                    [Op.between]: [data_inicio, data_fim]
                }
            },
        });
        if (!empresa) {
            throw new Error("Cnpj não encontrado");
        }
        const workingDays = getWorkingDays(data_inicio, data_fim, feriados);
        const salaryValue = parseFloat(workingDays * 8) * empresa.valor_hora;

        return res.status(200).json({
            valor_calculado: salaryValue,
        });
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            error: err.message,
        });
    }
});

export { routes as default };
