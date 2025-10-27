const express = require('express');
const router = express.Router();
//const Busboy = require('busboy');
const aws = require('../services/aws')
const Arquivo = require('../models/arquivo');
const Servico = require('../models/servico');


    router.post('/', async (req, res) => {
        try{
            const { salaoId, servico } = req.body;
            let errors = [];
            let arquivos = [];

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

            let Arquivos = arquivos.map((arquivo) => ({
                referenciaId: servicoCadastrado._id,
                model: "Servico",
                caminho: arquivo,
            }));

            await Arquivo.insertMany(Arquivos); 

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

router.put('/:id', async (req, res) => {
    try{
        const { salaoId, servico } = req.body;
        let errors = [];
        let arquivos = [];


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
            res.json(errors[0]);
            return false;
        }

        const jsonServico = JSON.parse(servico);
        await Servico.findByIdAndUpdate(req.params.id, jsonServico);

        let Arquivos = arquivos.map((arquivo) => ({
            referenciaId: req.params.id,
            model: "Servico",
            caminho: arquivo,
        }));

        await Arquivo.insertMany(Arquivos); 

        res.status(201).json({ error: false  });    
      } catch (err) {
        console.error('Erro na rota PUT /servico:', err.message); 
        res.status(500).json({ 
            error: true, 
            message: err.message 
    });
}
// req.pipe(busboy);    
});

router.post('/delete-arquivo', async (req, res) => {
    try {
        const { id } = req.body;

        await aws.deleteFileS3(id);

        await Arquivo.findOneAndDelete({
            caminho: id,
        });
        
        res.json({ error: false });

    } catch (err) {
        console.error('Erro na rota POST /servico:', err.message); 
            res.status(500).json({ 
                error: true, 
                message: err.message 
            });
        }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Servico.findByIdAndUpdate(id, { status: 'E' });
        
        res.json({ error: false });

    } catch (err) {
        console.error('Erro na rota POST /servico:', err.message); 
            res.status(500).json({ 
                error: true, 
                message: err.message 
            });
        }
})

module.exports = router;