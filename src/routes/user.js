var express = require('express');
var router = express.Router();
var controller = require('../controllers/user.js');

//
// User routes
//
router.post('/user/', controller.test);

module.exports = router;
