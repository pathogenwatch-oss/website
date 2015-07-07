var express = require('express');
var router = express.Router();
var controller = require('controllers/download.js');

router.get(
  '/api/download/assembly/:id/metadata/:format',
  controller.downloadAssemblyMetadata
);

module.exports = router;
