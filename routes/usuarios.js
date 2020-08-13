const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario');
const middlewareSecurity = require('../middleware/verifyAcceso');

router.get('/', usuarioController.list);

router.get('/create', usuarioController.create_get);

router.post('/create', usuarioController.create_post);

router.post('/delete/:id', middlewareSecurity.loggedIn,  usuarioController.delete_post);

router.get('/update/:id', middlewareSecurity.loggedIn, usuarioController.update_get);

router.post('/update/:id', middlewareSecurity.loggedIn, usuarioController.update_post);

module.exports = router;
