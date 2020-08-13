const Bicicleta = require('../models/bicicleta');

module.exports = {
    list: function (req, res) {
        //OBTENER DATOS DE BICICLETA
        Bicicleta.find({})
            .then(objBicicleta => {
                res.render('bicicletas/index', { obj1: objBicicleta })
            })
            .catch(error => {
                console.log(error);
                res.render('bicicletas/index', { obj1: [] })
            });
    },
    create_get: function (req, res) {
        //OBTENER PANTALLA PARA CREAR BICICLETA
        res.render('bicicletas/create', { errors: {}, objBicicleta: new Bicicleta() });
    },
    create_post: function (req, res) {
        //Creamos el objeto bicicleta
        
        const objBicicleta = new Bicicleta({
            code: req.body.txtId, 
            color: req.body.txtColor, 
            modelo: req.body.txtModelo,
            ubicacion: [req.body.txtLatitud, req.body.txtLongitud]
        });       

        //CREAR BICICLETA
        Bicicleta.create(objBicicleta)
            .then(biciNew => {
                res.redirect('/bicicletas');
            }).catch(err => {
                res.render('bicicletas/create', { errors: err.errors, objBicicleta });
            });     
            
    },
    delete_post: function (req, res, next) {
        //BICICLETA A ELIMINAR
        Bicicleta.findByIdAndDelete(req.body.id)
            .then(success => {
                res.redirect('/bicicletas');
            }).catch(err => {
                next(err);
            });
    },
    update_get: function (req, res) {
        // OBTENER DATOS DE BICICLETA
        Bicicleta.findById(req.params.id)
            .then(bici => {
                console.log(bici);
                res.render('bicicletas/update', { errors: {}, objBicicleta: bici });
            }).catch(err => {
                req.redirect('/bicicletas');
            });
    },
    update_post: function (req, res) {
        // ACUTALIZAR DATOS DE BICICLETA
        const objBicicleta = {
            code: req.body.txtId,
            color: req.body.txtColor,
            modelo: req.body.txtModelo,
            ubicacion: [req.body.txtLatitud, req.body.txtLongitud]
        };

        Bicicleta.findByIdAndUpdate(req.params.id, objBicicleta)
            .then(bici => {
                res.redirect('/bicicletas');
            }).catch(err => {
                objBicicleta._id = req.params.id;
                res.render('bicicletas/update', { errors: err, objBicicleta });
            });
    }
}