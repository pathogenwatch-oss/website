const fspath = require('path');

const express = require('express');
const router = express.Router();

const { getCountry } = require('country-reverse-geocoding');

const fastaStorage = require('wgsa-fasta-store');
const createMashSpecieator = require('mash-specieator');
const referencesDir = require('mash-sketches');
const sketchFilePath = fspath.join(referencesDir, 'refseq-archaea-bacteria-fungi-viral-k16-s400.msh');
const metadataFilePath = fspath.join(referencesDir, 'refseq-archaea-bacteria-fungi-viral-k16-s400.csv');
const specieator = createMashSpecieator(sketchFilePath, metadataFilePath);

const collectionModel = require('models/collection');
const assemblyModel = require('models/assembly');
const analyse = require('wgsa-front-end/universal/fastaAnalysis');

const LOGGER = require('utils/logging').createLogger('Upload');
const { maxCollectionSize = 0, fastaStoragePath } = require('configuration');

const speciesIds =
  new Set(require('wgsa-front-end/universal/species').map(_ => _.id));

function getWGSASpeciesId(...ids) {
  for (const id of ids) {
    if (speciesIds.has(id)) return id;
  }
  return null;
}

router.post('/upload', (req, res, next) => {
  LOGGER.info('Upload received', req.body.length);
  fastaStorage.store(fastaStoragePath, req.body).
    then(({ path, id }) =>
      specieator.queryFile(path).then(({ speciesTaxId, taxId, scientificName }) => ({
        speciesId: getWGSASpeciesId(speciesTaxId, taxId),
        speciesName: scientificName,
        id,
      }))
    ).
    then(result => {
      let country;

      if (req.query.lat && req.query.lon) {
        try {
          country = getCountry(
            Number.parseFloat(req.query.lat), Number.parseFloat(req.query.lon)
          );
        } catch (e) { return e; }
      }

      res.json(Object.assign({ country, metrics: analyse(req.body) }, result));
      req.body = null; // prevent memory leak
    }).
    catch(error => next(error));
});

router.post('/collection', (req, res, next) => {
  const { speciesId, files } = req.body;

  LOGGER.info('Received request for new collection id');

  if (!speciesId || !files || !files.length ||
    (maxCollectionSize && files.length > maxCollectionSize)) {
    return res.sendStatus(400);
  }

  return collectionModel.add({ speciesId, files }).
    then(collectionId => res.json({ collectionId })).
    catch(e => next(e));
});

module.exports = router;
