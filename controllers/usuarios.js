var Usuario=require('../models/usuario');
module.export={
    list: function(req,res,next){
        Usuario.find({}, (err,usuarios)=>{
            res.render('usuarios/index',{usuarios:usuarios});
        });
    },
    update_get: function(req,res,next){
        Usuario.findById(req.param.id,(err,usuario)=>{
            res.render('usuarios/update',{errors:{},usuario:usuario});
        });
    },
    update_post: function(req,res,next){
        var updateValue={nombre:req.body.nombre};
        Usuario.findByIdAndUpdate(req.params.id,updateValue,function(err, usuario){
            if(err)
            {
                console.log(err);
                req.render('usuarios/update',{errors:err.errors, usuario: new Usuario({nombre:req.body.nombre,email:req.body.email})});
            }else{
                res.redirect('usuarios');
                return;
            }
        });
    },
    create_get: function(req,res,next){
        res.render('usuarios/create',{errors:{},usuario: new Usuario()})
    },
    create_post: function(){
        if(req.body.password!=req.body.confirm_password){
            res.render('usuarios/create',{confirm_password:{message:'No coinciden las contraseñas'}});
            return;
        }
        Usuario.create({nombre:req.body.nombre,email:req.body.email,password:req.body.password},function(err,nuevoUsuario){
            if(err){
                res.render('usuarios/create',{errors:err.errors,usuario: new Usuario({nombre:req.body.nombre,email:req.body.email,})});
            }else{
                nuevoUsuario.enviar_email_bienvenida();
                res.redirect('/usuarios');
            }
        });
    },
    delete:function(req,res,next){
        Usuario.findByIdAndDelete(req.body.id,function(err){
            if(err){
                next(err);
            }
            else{
                res.redirect('/usuarios')
            }
        });
    } 
};


