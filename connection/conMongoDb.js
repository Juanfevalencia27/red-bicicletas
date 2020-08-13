const mongodb = require('mongoose');
const config = require('../config/config')

module.exports = {
    test: function (callback) {
        mongodb.connect(config.configMongo.urlBdTest, { useNewUrlParser: true, useCreateIndex: true,});
        const db = mongodb.connection;

        db.on('error', console.error.bind(console, 'MongoDb Connection error;'));

        db.once('open', function () {
            console.log('Conexion Exitosa a mongo testDb');
            callback();
        });
        return db;
    },
    dev: function () {

        mongodb.connect(config.configMongo.urlBdDesa, {
          useNewUrlParser: true,
          useCreateIndex: true,
        });
        mongodb.Promise = global.Promise;
        const db = mongodb.connection;

        db.on('error', console.error.bind(console, 'MongoDb Connection error;'));

        db.on('connected', () => {
            console.log('Conexion Exitosa');
        });
        return db;
    }
}
