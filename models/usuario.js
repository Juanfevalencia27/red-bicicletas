const mongoose = require('mongoose');
const Reserva = require('./reserva');
const bcrypt = require('bcrypt');
const Token = require('./token');
const Mailer = require('../mailer/mailer');
const Security = require('../security/security');

const Schema = mongoose.Schema;

const  saltRounds = 10;

const validateEmail= function(email) {
    const expr = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/;
    return expr.test(email);
}

// Definicion de objetos schema con indice
const objUsuarioSchema = new Schema({
  code: Number,
  nombre: {
    type: String,
    trim: true,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "El email es obligatorio"],
    lowercase: true,
    unique: true,
    validate: [validateEmail, "Ingrese un correo valido"],
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/]
  },
  password: {
      type: String,
      required: [true, 'El password es obligatorio']
  },
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  verificado: {
      type: Boolean,
      default: false
  }
});

//Funcion que se ejecuta antes de ejecutar la accion 
objUsuarioSchema.pre('save', function (next) {
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

objUsuarioSchema.methods.VerificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

// GET STRING
objUsuarioSchema.methods.toString = function () {
    return 'Codigo: ' + this.code + ", Color: " + this.nombre;
};

// RESERVAR
objUsuarioSchema.methods.reservar = function (codeBicicleta, desde, hasta, callback) {
    const objReserva = new Reserva({ usuario: this._id, bicicleta: codeBicicleta, desde: desde, hasta: hasta});
    // Guardadno datos en bd
    objReserva.save(callback);
};

objUsuarioSchema.methods.enviar_email_bienvenida = function (callback) {
    const token = new Token({ user_id: this._id, token: Security.valToken(null) });
    const email_dest = this.email;

    token.save()
    .then(success1 =>{
        const mailOption = {
            from : 'no-reply@unknow.com',
            to: email_dest,
            subject: 'Verificacion de cuenta',
            text: 'Hola, \n\n Por favor, para verificar su cuenta haga click en el siguiente enlace \n '+'http://localhost:3000'+'\/token/confirmation\/'+token.token+'\n'
        }

        Mailer.sendMail(mailOption)
        .then(success2 =>{
            console.log('A verification email has been sent to '+ email_dest+'.');
        }).catch(err =>{
            console.log(err.message);
        });

    }).catch(err =>{
        console.log(err.message);
    });    
}

objUsuarioSchema.methods.enviar_email_forgotPassword = function (callback) {
    const email_dest = this.email;
    const crypt_id = Security.encrypt(this._id.toString());
    const mailOption = {
        from: 'no-reply@unknow.com',
        to: email_dest,
        subject: 'Recuperación de contraseña',
        text: 'Hola, \n\n Por favor, para recuperar su contraseña haga click en el siguiente enlace \n ' + 'http://localhost:3000/resetPassword/' + crypt_id + '\n'
    }

    Mailer.sendMail(mailOption)
        .then(success2 => {
            callback();
            console.log('A verification email has been sent to ' + email_dest + '.');
        }).catch(err => {
            callback(err);
            console.log(err.message);
        });
}
usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback){
    const self= this;
    console.log(condition);
    self.findOne({
        $or: [
            {'googleId': condition.id }, {'email': condition.emails[0].value}
        ]},(err,result)=>{
            if(result){
                callback(err, result)
            }else{
                console.log('_________CONDITION_______');
                console.log(condition);
                let values = {};
                values.googleId= condition.id;
                values.email= condition.emails[0].value;
                values.nombre = condition.displayName || 'SIN NOMBRE';
                values.verificado= true;
                values.password= crypto.randomBytes(16).toString('hex');
                console.log('_______VALUES______');
                console.log(values);
                self.create(values, (err, result)=>{
                    if (err) {console.log(err);}
                    return callback(err, result);
                });
            }
        }
    );
}

module.exports = mongoose.model('Usuario', objUsuarioSchema);


