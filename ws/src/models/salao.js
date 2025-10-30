const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salao = new Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório.' ]
    },
    foto: String,
    capa: String,
    email: String,
    senha:  {
        type: String,
        default: null,
    },
    telefone:  {
        type: String,
        required: [true, 'Telefone é obrigatório.' ]
    },
    endereco: {
        cidade: String,
        uf: String,
        cep: String,
        cep: String,
        numero: String,
        pais: String,
    },
    geo: {
        tipo: String,
        coordinates: [Number],
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    }
});

salao.index({ geo: '2dsphere'});

module.exports = mongoose.model('Salao', salao);