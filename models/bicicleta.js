var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definicion de objetos schema con indice
const objBicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion:{
        type: [Number], 
        index: {
            type: '2dsphere',
            sparse: true
        }
    }
});

// GET STRING
objBicicletaSchema.methods.toString = function () {
    return 'Codigo: ' + this.code + ", Color: " + this.color;   
};

//FIND ALL BICICLETAS
objBicicletaSchema.statics.allBicicletas = function (callback) {
    return this.find({}, callback)
};

//CREATE INSTANCE
objBicicletaSchema.statics.createInstance = function (intCode, strColor, strModelo, arrUbicacion) {
    return new this({
        code: intCode,
        color: strColor,
        modelo: strModelo,
        ubicacion: arrUbicacion
    });
};

//ADD BICICLETA
objBicicletaSchema.statics.add = function (objBici, callback) {
    this.create(objBici, callback);
};

//FIND ONE BICICLETA
objBicicletaSchema.statics.findByCode = function (intCode, callback) {
    return this.findOne({code: intCode}, callback);
};

//DELETE BICICLETA
objBicicletaSchema.statics.removeByCode = function (intCode, callback) {
    return this.deleteOne({code: intCode}, callback);
};

module.exports = mongoose.model('Bicicleta', objBicicletaSchema);

