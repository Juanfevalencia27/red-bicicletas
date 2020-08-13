const Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function (req, res) {
    Bicicleta.allBicicletas(function (error, success) {
        if (error) console.log(error)
        res.status(200).json({ bicicletas: success});    
    });        
}

exports.bicicleta_create = function (req, res) {
    let objBicicleta = new Bicicleta({ 
        code: req.body.id, 
        color: req.body.color, 
        modelo: req.body.modelo, 
        ubicacion: [req.body.lat, req.body.lng]});

    objBicicleta.save(function (error, sucess) {
        if (error) console.log(error)
        res.status(200).json({
            bicicleta: sucess
        });        
    });    
}

exports.bicicleta_delete = function (req, res) {

    Bicicleta.removeByCode(req.body.id, function (error, objresult) {
        if(error)console.log(error);
        res.status(200).json({
            message: "Procesado exitosamente"
        });
    });   
}

exports.bicicleta_update = function (req, res) {
    Bicicleta.updateOne({ code: req.body.id}, {
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng]
    }, function (error, success) {
            if (error) console.log(error);
            if(success.ok){
                res.status(200).json({ 
                    code: req.body.id,
                    message: "Procesado exitosamente"
                });
            }else{
                res.status(404);
            }            
    });    
}


