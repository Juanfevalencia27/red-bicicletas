const Token = require('../models/token');
const Usuario = require('../models/usuario');

module.exports = {

    Confirmation_get: function (req, res) {
        //Buscamos el token
        const objToken = {
            token: req.params.token
        }
        Token.findOne(objToken)
        .then(tokensuccess => {
            if (!tokensuccess) return res.status(400).send({ type: 'not-verified', msg: 'No se encontro el usuario con ese token, puede ser que el token ha expirado y se debe solicitar uno nuevo.'});
            Usuario.findById(tokensuccess.user_id)
            .then(usuario=>{
                if(!usuario) return res.status(400).send({msg:'No se encontro los datos del usuario'});
                if (usuario.verificado) return res.redirect('/usuarios');

                usuario.verificado = true;
                usuario.save(function(err){
                    if(err) return res.status(500).send({ msg: err.message});
                    res.redirect('/');
                });

            }).catch(err=>{
                console.log(errr);
            })
        }).catch(err=>{
            console.log(err);
        });
    }
}