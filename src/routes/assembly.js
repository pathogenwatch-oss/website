var express = require('express');
var router = express.Router();
var controller = require('controllers/assembly.js');

router.get('/assembly/:id', controller.getCompleteAssembly);
router.get('/assembly/:id/core-result', controller.getCoreResult);
router.get('/assemblies', controller.getMultipleAssemblies);
router.get('/assemblies/resistance-profile', controller.getResistanceProfile);
router.get('/assemblies/table-data', controller.getAssemblyTableData);
router.post('/assembly/add', controller.addAssembly);

module.exports = router;
