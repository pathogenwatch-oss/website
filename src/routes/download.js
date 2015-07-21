var express = require('express');
var router = express.Router();
var controller = require('controllers/download.js');

router.get(
  '/download/assembly/:id/metadata/:format',
  controller.downloadAssemblyMetadata
);

module.exports = router;
