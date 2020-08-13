var express = require('express');
var router = express.Router();
var authController = require('../../controllers/api/authControllerAPI');

router.post("/authenticate", authController.authenticate);

router.post("/forgotPassword", authController.forgotPassword);

module.exports = router;
//https>//api.giphy.com/v1/gifs