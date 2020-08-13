const express = require('express');
const router = express.Router();
const bicicletaController = require('../controllers/bicicleta');

router.get('/', bicicletaController.list);

router.get('/create', bicicletaController.create_get);

router.post('/create', bicicletaController.create_post);

router.post('/delete/:id', bicicletaController.delete_post);

router.get('/update/:id', bicicletaController.update_get);

router.post('/update/:id', bicicletaController.update_post);

module.exports = router;



