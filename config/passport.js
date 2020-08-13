const passport = require('passport');
const localStrategy= require('passport-local').Strategy;
const Usuario = require('../models/usuario');

passport.use(new localStrategy({ // or whatever you want to use
    usernameField: 'strEmail',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'strPassword'
},
    function (strEmail, strPassword, done) {
        Usuario.findOne({ email: strEmail })
        .then(user =>{            
            if(!user) return done(null, false,  { message: 'Email no existe o incorrecto'});

            if (!user.VerificarPassword(strPassword)) return done(null, false, { message: 'Contraseña no coincide' });
            // asegurar que el usuario ha verificado su correo
            return done(null, user);
        }).catch(err =>{
            return done(err);
        });
    }
));

passport.serializeUser(function (user, callback) {
    console.log('serializar')
    callback(null, user.id);
});

passport.deserializeUser(function (id, callback) {
    console.log('deserializar')
    console.log(id);
    Usuario.findById(id, function (err, usuario) {
        callback(err, usuario);
    });
});

module.exports = passport;

