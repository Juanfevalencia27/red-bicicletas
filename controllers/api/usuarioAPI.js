const Usuario = require('../../models/usuario');

exports.usuario_list = function (req, res) {
    Usuario.find({}, function (error, success) {
        if (error) console.log(error)
        res.status(200).json({ usuarios: success });
    });
}

exports.usuario_create = function (req, res) {
    const objUsuario = new Usuario ({code: req.body.code, nombre: req.body.nombre});
    
    objUsuario.save(function (error, success) {
        res.status(200).json(objUsuario); 
    });
}

exports.usuario_reservar = function (req, res) {
    Usuario.findById( req.body.id, function (error, usuario) {
        usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta, function (err, success) {
            if(err)console.log(err);
            res.status(200).json({code: 'ok', message: 'Reservado exitosamente'});            
        }) 
    });
}

exports.usuario_delete = function (req, res) {

   Usuario.deleteOne({ code: req.body.id}, function (err, success) {
       res.status(200).json({
           message: "Procesado exitosamente"
       });       
   });   
}

exports.usuario_update = function (req, res) {
   

}


