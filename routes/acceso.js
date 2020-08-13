const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

router.route('/login')
  .get(loginController.login_get)
  .post(loginController.login_post);

router.get('/logout', loginController.logout);

router.route('/forgotPassword')
  .get(loginController.forgot_get)
  .post(loginController.forgot_post);

router.route('/resetPassword/:email')
  .get(loginController.restore_get)
  .post(loginController.restore_post);


module.exports = router;
