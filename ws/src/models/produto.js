const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produto = new Schema({
   codigoProduto: {
        type: String,
        required: true,
    },
    categoria: {
        type: String,
        required: true,
    },
    marca: {
        type: String,
        required: true,
    },
    nome: {
        type: String,
        required: true,
    },
    custo: {
        type: Number,
        required: true,
    },
    valor: {
        type: Number,
        required: true,
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Produto', produto);