const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const aws = require('../services/aws')
const Salao = require('../models/salao');
const Servico = require('../models/servico');

router.post('/', async (req, res) => {
    try{
        let busboy = new Busboy({ headers: req.header });

    } catch (err) {
        res.json({ error: true, message: err.message })
    }
});

module.exports = router;