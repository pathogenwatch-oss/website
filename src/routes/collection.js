var express = require('express');
var router = express.Router();
var controller = require('controllers/collection.js');

router.post('/collection/', controller.getCollection);
router.post('/collection/add', controller.addCollection);
router.get('/collection/new', controller.renderNewCollection);
router.get('/api/collection/representative/metadata', controller.getRepresentativeCollection);
router.get('/collection/:id', controller.renderExistingCollection);
router.post('/api/collection/tree/merge', controller.mergeCollectionTrees);
router.post('/api/collection/merged', controller.getMergeTree);

module.exports = router;
