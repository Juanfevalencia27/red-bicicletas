const Usuario = require('../models/usuario');

module.exports = {
    list: function (req, res) {
        //Obtener datos de usuario
        Usuario.find({})
        .then( user =>{
            res.render('usuarios/index', { obj1: user })
        })
        .catch(error =>{
            console.log(error);
            res.render('usuarios/index', { obj1: [] })
        });       
    },
    create_get : function (req, res) {
        //Obtener pantalla para crear nuevo usuario
        res.render('usuarios/create', {errors: {}, objUsuario: new Usuario()});
    },
    create_post: function (req, res) {
        console.log(req.body);
        //Creamos el objeto usuario
        const objUsuario = {
            nombre: req.body.txtNombre,
            email: req.body.txtEmail,
            password: req.body.txtPassword
        };

        //Validamos password
        if (req.body.txtPassword != req.body.txtPassword_Confirm){
            return res.render('usuarios/create', { errors: { passwordConfirm: 'No coinciden las contraseñas' }, objUsuario });
        }

        //CREAR USUARIO
        Usuario.create(objUsuario)
        .then(userNew =>{
            //ENVIAR CORREO
            userNew.enviar_email_bienvenida();
            res.redirect('/usuarios');
        }).catch(err=>{
            console.log(err);
            res.render('usuarios/create', { errors: err.errors, objUsuario });
        });      
    },
    delete_post : function (req, res, next) {
        //USUARIO A ELIMINAR
        Usuario.findByIdAndDelete(req.body.id)
        .then(success =>{
            res.redirect('/usuarios');
        }).catch(err =>{
            next(err);
        });
    },
    update_get : function (req, res) {
        // OBTENER DATOS DEL USUARIO
        Usuario.findById(req.params.id)
        .then(user =>{
            res.render('usuarios/update',{errors : {}, objUsuario: user} );
        }).catch(err =>{
            req.redirect('/usuarios');
        });
    },
    update_post : function (req, res) {
        // ACUTALIZAR DATOS DEL USUARIO
        const objUsuario = {
            nombre: req.body.txtNombre,
            email: req.body.txtEmail
        };

        const boolChange_email = req.body.txtEmail_old != req.body.txtEmail;

        Usuario.findByIdAndUpdate(req.params.id, objUsuario)
            .then(user => {
                if (boolChange_email) user.enviar_email_bienvenida();
                res.redirect('/usuarios');
            }).catch(err => {
                console.log(err);
                res.render('usuarios/update', { errors: err.errors, objUsuario: new Usuario(objUsuario) });
            });
    }

}