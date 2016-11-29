const assemblyModel = require('models/assembly');

const LOGGER = require('utils/logging').createLogger('Error handler');

const errorCodes = {
  KEY_DOES_NOT_EXIST: 13,
};

function isNotFoundInStorage(error) {
  return (
    error.code === errorCodes.KEY_DOES_NOT_EXIST
  );
}

process.on('uncaughtException', error => {
  console.error(error);
  process.exit(1);
});

module.exports = function handleErrors(app) {
  app.use((error, req, res, next) => {
    LOGGER.error(error);

    if (isNotFoundInStorage(error)) {
      return res.sendStatus(404);
    }

    if (error.message === 'request aborted') {
      assemblyModel.sendUploadNotification(req.params, 'ABORTED');
      return res.status(400).send(error.message);
    }

    return res.sendStatus(500);
  });
};
