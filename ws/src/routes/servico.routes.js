const express = require('express');
const router = express.Router();
//const Busboy = require('busboy');
const aws = require('../services/aws')
const Salao = require('../models/salao');
const Servico = require('../models/servico');


    router.post('/', async (req, res) => {
        try{
            const { salaoId, servico } = req.body;
            let errors = [];
            let arquivos = [];

            console.log(req.files);

            if (req.files && Object.keys(req.files).length > 0) {
                for (let key of Object.keys(req.files)) {
                    const file = req.files[key];
                    const nameParts = file.name.split('.');
                    const fileName = `${new Date().getTime()}.${
                        nameParts[nameParts.length -1]
                    }`;
                    const path = `servicos/${salaoId}/${fileName}`;

                    const response = await aws.uploadToS3(file, path);

                    if (response.error) {
                        errors.push({ error: true, message: response.message });
                    } else {
                        arquivos.push(path);

                    }
                }
            }
            if (errors.length > 0 ) {
                return res.json(errors[0]);
            }

            let jsonServico = JSON.parse(servico);

            const servicoCadastrado = await Servico(jsonServico).save();

            arquivos = arquivos.map((arquivo) => ({
                referenciaId: servicoCadastrado._id,
                model: "Servico",
                caminho: arquivo,
            }));

            res.status(201).json({ 
                error: false, 
                message: 'Serviço e arquivos processados com sucesso!',
                servico: servicoCadastrado
            });    

        } catch (err) {
            console.error('Erro na rota POST /servico:', err.message); 
            res.status(500).json({ 
                error: true, 
                message: err.message 
        });
    }
    // req.pipe(busboy);    
});

module.exports = router;