const fspath = require('path');

const express = require('express');
const router = express.Router();

const fastaStorage = require('wgsa-fasta-store');
const createMashSpecieator = require('mash-specieator');

const referencesDir = require('mash-sketches');
const sketchFilePath = fspath.join(referencesDir, 'refseq-archaea-bacteria-fungi-viral-k16-s400.msh');
const metadataFilePath = fspath.join(referencesDir, 'refseq-archaea-bacteria-fungi-viral-k16-s400.csv');
const specieator = createMashSpecieator(sketchFilePath, metadataFilePath);

const analyse = require('wgsa_front-end/universal/fastaAnalysis');

const LOGGER = require('utils/logging').createLogger('Upload');
const { fastaStoragePath } = require('configuration');

router.post('/upload', (req, res) => {
  fastaStorage.store(fastaStoragePath, req.body).
    then(({ path, id }) =>
      specieator.queryFile(path).then(({ speciesTaxId, taxId, scientificName }) => ({
        speciesId: speciesTaxId || taxId || null,
        speciesName: scientificName,
        id,
      }))
    ).
    then(result => res.json(Object.assign({ metrics: analyse(req.body) }, result)));
});

module.exports = router;
