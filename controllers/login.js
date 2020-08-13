const Usuario = require('../models/usuario');
const passport = require('../config/passport');
const security = require('../security/security');

module.exports = {
    forgot_get: function (req, res) {
        res.render('session/forgotPassword');
    },
    forgot_post: function (req, res) {
        // recibe un token y lo quita
        if (!req.body.txtEmail){
            res.render('session/forgotPassword', { message: 'Ingresar el correo'});
        }

        Usuario.findOne({ email : req.body.txtEmail})
        .then(user =>{
            if (!user) res.render('session/forgotPassword', { message: 'Email no existe o incorrecto' });

            user.enviar_email_forgotPassword(function (err) {
              if (err) {
                res.render("session/forgotPassword", {
                  message: "No se logro enviar el correo para restaurar password",
                });
              }
                res.redirect("/login");  
            });            
        }).catch(err =>{
            res.render('session/forgotPassword', { message: err });
        });        
    },
    login_post: function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) next(err);
            if (!user) return res.render('session/login', { info });
            req.logIn(user, function (err2) {
                if (err2) return next(err2);
                return res.redirect('/');
            });
        })(req, res, next);// invocando la funcion de passport
            // res.send('Update the book');
    },
    login_get: function (req, res) {
        res.render('session/login', { info:{} })
    },
    restore_get: function (req, res){
        if (!req.params.email){
            res.redirect('/login');
        }     
        const str_id = security.decrypt(req.params.email);
        Usuario.findById(str_id)
        .then(user=>{
            res.render('session/restorePassword', { errors: {}, objUsuario: user });
        }).catch(err=>{
            console.log(err);
            res.redirect('/login');
        });        
    },
    restore_post: function (req, res) {
        if (!req.params.email) {
            res.redirect('/login');
        }
        //Creamos el objeto usuario
        const objUsuario = {
            password: req.body.txtPassword,
            _id: req.params.email,
            email: req.body.txtEmail
        };

        //Validamos password
        if (req.body.txtPassword !== req.body.txtPassword_Confirm) {
            return res.render('session/restorePassword', { errors: { passwordConfirm: 'No coinciden las contraseñas' }, objUsuario });
        }

        Usuario.findById(req.params.email)
            .then(user => {
                user.password = req.body.txtPassword;        
                user.save();      
                res.redirect('/login');
            }).catch(err => {
                console.log(err);
                return res.render('session/restorePassword', { errors: err, objUsuario });
            });       
    },
    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    }      
}