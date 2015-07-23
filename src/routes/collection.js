var express = require('express');
var router = express.Router();
var controller = require('controllers/collection.js');

router.get('/collection/reference/:id', controller.getReferenceCollection);
router.get('/collection/:id', controller.getCollection);
router.post('/collection/tree/merge', controller.mergeCollectionTrees);
router.post('/collection/merged', controller.getMergeTree);
router.post('/collection', controller.addCollection);

module.exports = router;
