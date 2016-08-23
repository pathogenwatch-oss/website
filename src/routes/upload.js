const fspath = require('path');

const express = require('express');
const router = express.Router();

const fastaStorage = require('wgsa-fasta-store');
const createMashSpecieator = require('mash-specieator');

const referencesDir = require('mash-sketches');
const sketchFilePath = fspath.join(referencesDir, 'refseq-archaea-bacteria-fungi-viral-k16-s400.msh');
const metadataFilePath = fspath.join(referencesDir, 'refseq-archaea-bacteria-fungi-viral-k16-s400.csv');
const specieator = createMashSpecieator(sketchFilePath, metadataFilePath);

const collectionModel = require('models/collection');
const assemblyModel = require('models/assembly');
const analyse = require('wgsa_front-end/universal/fastaAnalysis');

const LOGGER = require('utils/logging').createLogger('Upload');
const { maxCollectionSize = 0, fastaStoragePath } = require('configuration');

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

router.post('/collection', (req, res, next) => {
  const { speciesId, files } = req.body;

  LOGGER.info('Received request for new collection id');

  if (!speciesId || !files || !files.length ||
    (maxCollectionSize && files.length > maxCollectionSize)) {
    return res.sendStatus(400);
  }

  collectionModel.add(speciesId, files.map(_ => _.name), (error, result) => {
    if (error) {
      return next(error);
    }

    const { collectionId, assemblyNameToAssemblyIdMap } = result;

    const uploads =
      files.map(file => {
        const { storageId, metadata, metrics, name } = file;
        const assemblyId = assemblyNameToAssemblyIdMap[name];
        return (
          fastaStorage.retrieve(fastaStoragePath, storageId).
            then(sequences =>
              assemblyModel.beginUpload(
                { speciesId, collectionId, assemblyId },
                { sequences, metadata, metrics }
              )
            )
        );
      });

    Promise.all(uploads).
      then(() => res.json({ collectionId })).
      catch(e => next(e));
  });
});

module.exports = router;
