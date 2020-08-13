const MongoDB = require('../../connection/conMongoDb');
const Bicicleta = require('../../models/bicicleta');
const request = require('request');
const server = require('../../bin/www');

const varURL_Test = "http://localhost:3000/api/bicicletas";

describe("Bicicleta API", () => {

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
	describe("Get bicicleta /", () => {
		it("status 200 ok", (done) => {
			request.get(varURL_Test, function (error, resp, body) {
        const objResult = JSON.parse(body);
        expect(resp.statusCode).toBe(200);
				expect(objResult.bicicletas.length).toBe(0);
				done();
			});
		});
  });
  
  //===========================BEGIN TEST 2 ========================
  describe("Post bicicleta /CREATE", () => {
    it("status 200 ok", (done) => {
      const objHeader = {
        "content-type": "application/json",
      };
      const objBici = {
        id: 5,
        color: "Green",
        modelo: "urbano",
        lat: -73.97,
        lng: 40.77,
      };

      request.post({
        headers: objHeader,
        url: varURL_Test + "/create",
        body: JSON.stringify(objBici),
      },
        function (error, resp, body) {
          expect(resp.statusCode).toBe(200);
          var objResult = JSON.parse(body);
          expect(objResult.bicicleta.code).toEqual(objBici.id);
          expect(objResult.bicicleta.color).toBe("Green");
          expect(objResult.bicicleta.modelo).toBe("urbano");
          done();
        }
      );
    });
  });

  //===========================BEGIN TEST 3 ========================
  describe("Post bicicleta /UPDATE", () => {
    it("status 200 ok", (done) => {

      const objHeader = {
        "content-type": "application/json",
      };

      var objBici = {
        id: 1,
        color: "Green",
        modelo: "urbano",
        lat: -73.97,
        lng: 40.77,
      };

      //2DA PETICION PARA ACTUALZIAR
      const objFunctionUpdate = function () {
        objBici.color = 'ligth gray';
        objBici.modelo = 'MTB';
        request.post(
          {
            headers: objHeader,
            url: varURL_Test + "/update",
            body: JSON.stringify(objBici),
          },
          function (error, resp, body) {
            expect(resp.statusCode).toBe(200);
            var objResult = JSON.parse(body);
            expect(objResult.code).toEqual(objBici.id);
            //expect(Bicicleta.findById(1).modelo).toBe("MTB");
            done();
          }
        );
      };

      // 1RA PETICIO PARA CREAR
      request.post(
        {
          headers: objHeader,
          url: varURL_Test + "/create",
          body: JSON.stringify(objBici),
        },
        function (error, resp, body) {
          expect(resp.statusCode).toBe(200);
          objFunctionUpdate();
        }
      );
    });
  });  

  //===========================BEGIN TEST 4 ========================
  describe("Post bicicleta /DELETE", () => {
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

      //2DA PETICION PARA eliminar
      const objFunctionDelete = function () {
        request.delete(
          {
            headers: objHeader,
            url: varURL_Test + "/delete",
            body: JSON.stringify({
              id: 1,
            }),
          },
          function (error, resp, body) {
            expect(resp.statusCode).toBe(200);
            Bicicleta.allBicicletas(function (error2, success2) {
              if (error2) console.log(error2)
              expect(success2.length).toBe(0);
              done();
            })            
          }
        );
      };

      // 1RA PETICIO PARA CREAR
      request.post(
        {
          headers: objHeader,
          url: varURL_Test + "/create",
          body: JSON.stringify(objBici),
        },
        function (error, resp, body) {
          expect(resp.statusCode).toBe(200);
          objFunctionDelete();
        }
      );
    });
  });

	
});




