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
      res.json(Object.assign({
        metrics: analyse(req.body),
        country:
          req.query.lat ?
            getCountry(
              Number.parseFloat(req.query.lat), Number.parseFloat(req.query.lon)
            ) : null,
      }, result));
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

  collectionModel.add(speciesId, { assemblyNames: files.map(_ => _.name) }, (error, result) => {
    if (error) {
      return next(error);
    }

    const { collectionId, assemblyNameToAssemblyIdMap } = result;

    const uploads =
      files.map(file => {
        const { id, name, metadata = { assemblyName: name }, metrics } = file;
        const assemblyId = assemblyNameToAssemblyIdMap[name];
        return (
          fastaStorage.retrieve(fastaStoragePath, id).
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
