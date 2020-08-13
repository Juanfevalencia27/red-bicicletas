const MongoDB = require('../../connection/conMongoDb');
const Usuario = require('../../models/usuario');
const Bicicleta = require('../../models/bicicleta');
const Reserva = require('../../models/reserva');
const request = require('request');
const server = require('../../bin/www');

const varURL_Test = "http://localhost:3000/api/usuarios";
const varRL_Bici = "http://localhost:3000/api/bicicletas";

describe('Usuario api', ()=>{
    // Realizar conexion a base de datos de test antes de cada spec
    beforeEach(function (done) {
        // Conexion a mongo
        MongoDB.test(done);
    });

    // Eliminar todos los datos del esquema antes de cada spec
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
    describe("Get usuario /", () => {
        it("status 200 ok", (done) => {
            request.get(varURL_Test, function (error, resp, body) {
                const objResult = JSON.parse(body);
                expect(resp.statusCode).toBe(200);
                expect(objResult.usuarios.length).toBe(0);
                done();
            });
        });
    });

    //===========================BEGIN TEST 2 ========================
    describe("Post usuario /CREATE", () => {
        it("status 200 ok", (done) => {
            const objHeader = {
                "content-type": "application/json",
            };
            const objUsuario = {
                code: 5,
                nombre: "SMITH"
            };

            request.post({
                headers: objHeader,
                url: varURL_Test + "/create",
                body: JSON.stringify(objUsuario),
            },
                function (error, resp, body) {
                    expect(resp.statusCode).toBe(200);
                    var objResult = JSON.parse(body);
                    expect(objResult.code).toEqual(objUsuario.code);
                    expect(objResult.nombre).toBe(objUsuario.nombre);
                    done();
                }
            );
        });
    });

    //===========================BEGIN TEST 3 ========================
    describe("Post reservar /RESERVAR", () => {
        it("status 200 ok", (done) => {

            const objHeader = {
                "content-type": "application/json",
            };

            const objBici = {
                id: 1,
                color: "Green",
                modelo: "urbano",
                lat: -73.97,
                lng: 40.77,
            };

            //2DA PETICION PARA ACTUALZIAR
            const objFunctionCrearUsuario = function (idBicicleta){
                const objUsuario = {
                    code: 5,
                    nombre: "SMITH"
                };

                request.post({
                    headers: objHeader,
                    url: varURL_Test + "/create",
                    body: JSON.stringify(objUsuario),
                },
                    function (error, resp, body) {
                        expect(resp.statusCode).toBe(200);
                        var objResult = JSON.parse(body);
                        expect(objResult.code).toEqual(objUsuario.code);
                        objFunctionReservar(idBicicleta, objResult._id);
                    }
                );
            }

            //3ra PETICION PARA RESERVAR
            const objFunctionReservar = function (idBicicleta, idUsuario) {
                var datHoy = new Date();
                var datManiana = new Date();
                datManiana.setDate(datHoy.getDate() + 1);
                const objReserv = {
                    id: idUsuario,
                    bici_id: idBicicleta,
                    desde: datHoy,
                    hasta: datManiana
                }                
                request.post(
                    {
                        headers: objHeader,
                        url: varURL_Test + "/reservar",
                        body: JSON.stringify(objReserv),
                    },
                    function (error, resp, body) {
                        expect(resp.statusCode).toBe(200);
                        var objResult = JSON.parse(body);
                    
                        expect(objResult.code).toBe("ok");
                        done();
                    }
                );
            };

            // 1RA PETICIO PARA CREAR
            request.post(
                {
                    headers: objHeader,
                    url: varRL_Bici + "/create",
                    body: JSON.stringify(objBici),
                },
                function (error, resp, body) {
                    expect(resp.statusCode).toBe(200);
                    var objResult = JSON.parse(body);
                    objFunctionCrearUsuario(objResult.bicicleta._id);
                }
            );
        });
    });  

});



