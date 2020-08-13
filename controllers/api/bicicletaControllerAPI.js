var Bicicleta=require('../../models/bicicleta');
const { bicicleta_create_get } = require('../bicicleta');

exports.bicicleta_list=function (req,res) {
    Bicicleta.allBicis(function(err,bicis){
        res.status(200).json({
            bicicletas: bicis
        });
    });
    
}

exports.bicicleta_create= function (req,res) {
    var bici= new Bicicleta(req.body.code,req.body.color,req.body.modelo);
    bici.ubicacion=[req.body.latitud,req.body.longitud];

    Bicicleta.add(bici);

    res.status(200).json({
        bicicleta:bici
    });
}

exports.bicicleta_delete=function (req,res) {
    Bicicleta.removeBycode(req.body.code);
    res.status(204).send();
}

exports.bicicleta_edit=function (req,res) {
    var bici=Bicicleta.findBycode(req.body.code);
    bici.code=req.body.code;
    bici.color=req.body.color;
    bici.marca=req.body.marca;
    bici.ubicacion=[req.body.latitud,req.body.longitud];

    res.status(204).send();
}