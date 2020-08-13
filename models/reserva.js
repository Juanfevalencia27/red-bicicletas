const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;


// Definicion de objetos schema con indice
const objReservaSchema = new Schema({
    desde: Date,
    hasta: Date,
    bicicleta: {
        type: mongoose.Schema.Types.ObjectId, //Referencia a objeto
        ref: 'Bicicleta'
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId, //Referencia a objeto
        ref: 'Usuario'
    }
});

// Relacionar fechas de reservas
objReservaSchema.methods.diasReservacion = function () {
    return moment(this.hasta).diff(moment(this.desde), 'days') + 1;
};

module.exports = mongoose.model('Reserva', objReservaSchema);