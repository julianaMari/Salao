const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const estoqueSalao = new Schema({
    salaoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Salao',
        required: true,
    },
    produtoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Produto',
        required: true,
    },
    quantidade: {
        type: Number,
        required: true,
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('EstoqueSalao', estoqueSalao);