var express = require('express');
var router = express.Router();
var controller = require('controllers/assembly.js');

router.get('/assembly/:id', controller.getAssembly);
router.post('/api/assembly', controller.getCompleteAssembly);
router.post('/api/assemblies', controller.getMultipleAssemblies);
router.post('/api/assembly/table-data', controller.getAssemblyTableData);
router.post('/assembly/add', controller.addAssembly);
router.post('/api/assembly/resistance-profile', controller.getResistanceProfile);
router.get('/api/assembly/:id/core-result', controller.getCoreResult);

module.exports = router;
