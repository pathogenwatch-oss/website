var express = require('express');
var router = express.Router();
var controller = require('../controllers/landing.js');

//
// Landing routes
//
router.get('/', controller.landing);
router.post('/feedback', controller.feedback);
router.post('/subscribe', controller.subscribe);

module.exports = router;
