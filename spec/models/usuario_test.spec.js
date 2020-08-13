const MongoDB = require('../../connection/conMongoDb');
const Usuario = require("../../models/usuario");
const Reserva = require("../../models/reserva");
const Bicicleta = require("../../models/bicicleta");

describe("Bicicleta Model", () => {

    // Realizar conexion a base de datos de test antes de cada spec
    beforeEach(function (done) {
        // Conexion a mongo
        MongoDB.test(done);
    });

    // Eliminar todos los datos del esquema despues de cada spec
    afterEach(function (done) {
        Reserva.deleteMany({})
        .then(function (value) {
            return Usuario.deleteMany({});
        }, error => {
            console.error('Error eliminar Reserva: ', error);
        }).then(function (value) {
            return Bicicleta.deleteMany({});            
        }, error => {
                console.error('Error eliminar Usuario: ', error);
        }).then(function (value) {
            done();
        }, error => {
                console.error('Error eliminar Bicicleta: ', error);
        });
    });

    //===========================BEGIN TEST 1 ========================
    describe("Reserva de una bicicleta", () => {
        it("Validar reservacion de un usuario", (done) => {
            const objBici = new Bicicleta({ code: 15, color: 'black', model: 'Urbana'});
            objBici.save();
            const objUsuario = new Usuario({ code: 1, nombre: 'UsuarioTest'});
            objUsuario.save();

            var datHoy = new Date();
            var datManiana = new Date();
            datManiana.setDate(datHoy.getDate()+1);
            objUsuario.reservar(objBici._id, datHoy, datManiana, function (error, reserva) {
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function (error2, reservas) {
                   //console.log(JSON.stringify(reservas));
                  
                   expect(reservas.length).toBe(1);
                   expect(reservas[0].diasReservacion()).toBe(2);
                   expect(reservas[0].bicicleta.code).toBe(15);
                   expect(reservas[0].usuario.code).toBe(1);
                   done();
               }); 
            });
        });
    });

});


