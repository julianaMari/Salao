const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const pagarme = require("../services/pagarme");
const Colaborador = require("../models/colaborador");
const SalaoColaborador = require("../models/relationship/salaoColaborador");
const salaoColaborador = require("../models/relationship/salaoColaborador");

router.post("/", async (req, res) => {
    const db = mongoose.connection;
    const session = await db.startSession();

    try {
        const { colaborador, salaoId } = req.body;
        let newColaborador = null;

//VERIFICAR SE O COLABORADOR EXITE
        const existentColaborador = await Colaborador.findOnde({
            $or: [{ email: colaborador.email }, { telefone: colaborador.telefone }, { cpf: colaborador.cpf }]
        });
        //SE NÃO EXISTIR
        if (!existentColaborador) {
// CRIAR CONTA BANCARIA
            const { contaBancaria } = colaborador;
            const pagarmeBankAccount = await pagarme('bank_accounts', {
                agencia: contaBancaria.agencia,
                bank_code: contaBancaria.banco,
                conta: contaBancaria.numero,
                conta_dv: contaBancaria.dv,
                document_number: contaBancaria.cpfCnpj,
                legal_name: contaBancaria.titular,
            });
            if (pagarmeBankAccount.error) {
                throw pagarmeBankAccount;
            }



            //CRIAR RECEBEDOR
            const pagarmeRecipient = await pagarme('/recipients', {
                transfer_interval: 'day',
                transfer_enabled: true,
                bank_account_id: pagarmeBankAccount.id,
            });

            if (pagarmeRecipient.error) {
                throw pagarmeRecipient;
            }

            //CRIAR COLABORADOR
            newColaborador = await Colaborador({
                ...colaborador,
                recipientId: pagarmeRecipient.id
            }).save({ session });


        }

        // RELACIONAMENTO
        const colaboradorId = existentColaborador 
        ? existentColaborador_id
        : newColaborador_id;

        //verifica se já existe relacionamento com o salão
        const existentRelationship = await salaoColaborador.findOne({
            salaoId,
            colaboradorId,
            status: { $ne: 'E'},
        });

        //SE NÃO ESTÁ VINCULADO
        if(!existentRelationship) {
            await new salaoColaborador({
            salaoId,
            colaboradorId,
            status: colaborador.vinculo,
            }).save({ session });
        }

        if(existentColaborador) {
            const existentRelationship = await salaoColaborador.findOneAndUpdate({
                salaoId,
                colaboradorId,
            },
            { status: colaborador.vinculo },
            { session }
            );
        }
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.json({ error: true, message: err.message})

    };
});

module.exports = router;