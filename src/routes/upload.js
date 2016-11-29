const express = require('express');
const iso31661Codes = require('geo-data/iso-3166-1.json');

const router = express.Router();

const { getCountry } = require('country-reverse-geocoding');

const fastaStorage = require('wgsa-fasta-store');

const collectionModel = require('models/collection');

const LOGGER = require('utils/logging').createLogger('Upload');
const { maxCollectionSize = 0, fastaStoragePath } = require('configuration');

fastaStorage.setup(fastaStoragePath);

function getCountryCode({ lat, lon }) {
  if (lat && lon) {
    const country = getCountry(Number.parseFloat(lat), Number.parseFloat(lon));
    if (country.code && iso31661Codes[country.code]) {
      return iso31661Codes[country.code].toLowerCase();
    }
  }
  return null;
}

router.post('/upload', (req, res, next) => {
  LOGGER.info('Upload received');

  fastaStorage.store(fastaStoragePath, req)
    .then(({ fileId, metrics, specieator: { taxId, scientificName } }) => {
      const country = getCountryCode(req.query);
      res.json({
        id: fileId,
        speciesId: taxId,
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
