const express = require('express');
const router = express.Router();

const userModel = require('models/user');
const mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('User');
const { COLLECTION_METADATA } = require('utils/documentKeys');

router.get('/user/collections', (req, res) => {
  const { user } = req;
  if (!user) return res.sendStatus(401);
  const documentKeys =
    user.collectionIds.map(id => `${COLLECTION_METADATA}_${id}`);
  LOGGER.info(`Getting collections for user: ${user.id}`);
  mainStorage.retrieveMany(
    documentKeys,
    (error, { results }) => {
      if (error) {
        LOGGER.error(error, results);
        return res.sendStatus(500);
      }
      return (
        res.json(
          documentKeys.map(id => {
            const { status, collectionSize, uploadStarted, speciesId }
              = results[id];
            return {
              id,
              status,
              collectionSize,
              uploadStarted,
              speciesId,
            };
          })
        )
      );
    }
  );
});

module.exports = router;
