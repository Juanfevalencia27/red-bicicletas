var express=require('express');
var router = express.Router();
var tokenController=require('../controllers/token');

router.get('/confirmation/:token', tokenController.list);

module.exports = router;