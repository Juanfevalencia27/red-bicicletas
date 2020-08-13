const Usuario = require("../../models/usuario");
const Auth = require('../../middleware/authAccess');


module.exports = {
    authenticate: function (req, res, next) {
        Usuario.findOne({email: req.body.email})
        .then(user =>{
            if (!user)
              return res
                .status(401)
                .json({
                  status: "Error",
                  message: "Usuario invalido",
                  data: null,
                });

            if (!user.VerificarPassword(req.body.password))
              return res.status(401).json({
                status: "Error",
                message: "Password invalido",
                data: null,
              });               
                    
            const objToken = Auth.generateToken(user._id, req);
            res.status(200).json({message:'Login exitoso', data: { usuario: user, token: objToken}});
        })
        .catch(err=>{
            console.log(err)
            next(err);
        });        
        
    },
    forgotPassword: function (req, res, next) {
        Usuario.findOne({ email: req.body.email})
        .then(user =>{
            if(!user) return res.status(401).json({message:'No existe el usuario', data: null});
            user.enviar_email_forgotPassword(function (err) {
                if(err) { return next(err)}
                res.status(200).json({ message: 'Se envio un email para restablecer el password', data: null});
            });
        })
        .catch(err=>{
            next(err);
        });        
    }
}

