const MongoDB = require('../../connection/conMongoDb');
const Bicicleta = require("../../models/bicicleta");


describe("Bicicleta Model", () => {

    // Realizar conexion a base de datos de test antes de cada spec
    beforeEach(function (done) {
        // Conexion a mongo
        MongoDB.test(done);
    });

    // Eliminar todos los datos del esquema antes de cada spec
    afterEach(function (done) {
        Bicicleta.deleteMany({}, function (err, success) {
            if (err) console.log(err);
            done();
        });
    });

    //===========================BEGIN TEST 1 ========================
    describe("Create Instance bicicleta", () => {
        it("Crea una instancia de bicicleta", (done) => {
            const bici = Bicicleta.createInstance(1, 'Red', 'Urbana', [14.641380, -90.508187]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe('Red');
            expect(bici.modelo).toBe('Urbana');
            expect(bici.ubicacion[0]).toEqual(14.641380);
            expect(bici.ubicacion[1]).toEqual(-90.508187);

            done();
        });
    });

    //===========================BEGIN TEST  2========================
    describe("Get all bicicleta", () => {
        it("bicicletas vacias", (done) => {
            Bicicleta.allBicicletas( function (error, success) {
                if(error) console.log(error)
                expect(success.length).toBe(0);
                done();
            })
        });       
    });

    //===========================BEGIN TEST 3 ========================
    describe("Add bicicleta", () => {
        it("agregar una bicicleta", (done) => {            
            const objBicicleta = new Bicicleta({ code: 1, color: 'Gray', modelo: 'bmx'});
            Bicicleta.add(objBicicleta, function (error, newBicicleta) {
                if(error) console.log(error);
                //BUSCAR BICICLETAS
                Bicicleta.allBicicletas(function (err, bici) {
                    expect(bici.length).toBe(1);
                    expect(bici[0].code).toEqual(objBicicleta.code);
                    done();                                        
                });
            });           
        });
    });

    //===========================BEGIN TEST 5 ========================
    describe("Find bicicleta", () => {
        it("Buscar una bicicleta por codigo", (done) => {
            //NUEVAS BICICLETAS
            const objBicicleta1 = new Bicicleta({ code: 10, color: 'Gray', modelo: 'bmx' });
            const objBicicleta2 = new Bicicleta({ code: 20, color: 'Green', modelo: 'urbana' });

            //VERIFICAR QUE LAS BICICLETAS SEAN 0
            Bicicleta.allBicicletas(function (err, bici) {
                expect(bici.length).toBe(0);

                // PRIMERA BICICLETA
                Bicicleta.add(objBicicleta1, function (error1, newBicicleta1) {
                    if (error1) console.log(error1);

                    // SEGUNDA BICICLETA
                    Bicicleta.add(objBicicleta2, function (error2, newBicicleta12) {
                        if (error2) console.log(error2);
                        Bicicleta.findByCode(10, function (error3, objBicicleta) {
                            expect(objBicicleta.code).toBe(objBicicleta1.code);
                            expect(objBicicleta.color).toBe(objBicicleta1.color);
                            expect(objBicicleta.modelo).toBe(objBicicleta1.modelo);
                            done();    
                        });
                    });                    
                });
            });            
        });
    });

    describe("eliminar bicicleta", () => {
        it("elimina una bicicleta con id 20", (done) => {

            //NUEVAS BICICLETAS
            const objBicicleta1 = new Bicicleta({ code: 10, color: 'Gray', modelo: 'bmx' });
            const objBicicleta2 = new Bicicleta({ code: 20, color: 'Green', modelo: 'urbana' });
            const objBicicleta3 = new Bicicleta({ code: 30, color: 'light blue', modelo: 'bmx' });

            const addBicicleta1 = () =>{
                // PRIMERA BICICLETA
                Bicicleta.add(objBicicleta1, function (error1, newBicicleta1) {
                    //VALIDAR ERROR
                    if (error1) console.log(error1);
                    addBicicleta2();
                });
            }

            const addBicicleta2 = () => {
                // PRIMERA BICICLETA
                Bicicleta.add(objBicicleta2, function (error1, newBicicleta1) {
                    //VALIDAR ERROR
                    if (error1) console.log(error1);
                    addBicicleta3();
                });
            }

            const addBicicleta3 = () => {
                // PRIMERA BICICLETA
                Bicicleta.add(objBicicleta3, function (error1, newBicicleta1) {
                    //VALIDAR ERROR
                    if (error1) console.log(error1);

                    removeBicicleta();
                });
            }

            const removeBicicleta = ()=>{

                Bicicleta.removeByCode(20, function (error, objresult) {
                    //VALIDAR ERROR
                    if (error) console.log(error);

                    //VERIFICAR QUE LAS BICICLETAS SEAN 0
                    Bicicleta.allBicicletas(function (err, bici) {
                        expect(bici.length).toBe(2);
                        done();
                    });
                });
            }

            addBicicleta1();

        });
    });

});


