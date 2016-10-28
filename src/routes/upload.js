const express = require('express');
const router = express.Router();

const { getCountry } = require('country-reverse-geocoding');

const fastaStorage = require('wgsa-fasta-store');

const collectionModel = require('models/collection');

const LOGGER = require('utils/logging').createLogger('Upload');
const { maxCollectionSize = 0, fastaStoragePath } = require('configuration');

const speciesIds =
  new Set(require('wgsa-front-end/universal/species').map(_ => _.id));

function getWGSASpeciesId(taxId) {
  if (speciesIds.has(taxId)) return taxId;
  return null;
}

fastaStorage.setup(fastaStoragePath);

router.post('/upload', (req, res, next) => {
  LOGGER.info('Upload received', req.body.length);

  fastaStorage.store(fastaStoragePath, req)
    .then(({ fileId, metrics, specieator: { taxId, scientificName } }) => {
      let country;

      if (req.query.lat && req.query.lon) {
        country = getCountry(
          Number.parseFloat(req.query.lat), Number.parseFloat(req.query.lon)
        );
      }

      res.json({
        id: fileId,
        speciesId: getWGSASpeciesId(taxId),
        speciesName: scientificName,
        metrics,
        country,
      });
    }).
    catch(error => next(error));
});

router.post('/collection', (req, res, next) => {
  const { speciesId, title, description, files } = req.body;

  LOGGER.info('Received request for new collection id');

  if (!speciesId || !files || !files.length ||
    (maxCollectionSize && files.length > maxCollectionSize)) {
    return res.sendStatus(400);
  }

  return collectionModel.add({ title, description, speciesId, files }).
    then(collectionId => res.json({ collectionId })).
    catch(e => next(e));
});

module.exports = router;
