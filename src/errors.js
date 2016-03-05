var assemblyModel = require('models/assembly');

var LOGGER = require('utils/logging').createLogger('Error handler');

var errorCodes = {
  KEY_DOES_NOT_EXIST: 13
};

function isNotFoundInStorage(error) {
  return (
    error.code === errorCodes.KEY_DOES_NOT_EXIST
  );
}

module.exports = function handleErrors(app) {
  app.use(function (error, req, res, next) {
    LOGGER.error(error);

    if (isNotFoundInStorage(error)) {
      return res.sendStatus(404);
    }

    if (error.msg === 'request aborted') {
      assemblyModel.sendUploadNotification(req.params, 'ABORTED');
    }

    res.sendStatus(500);
  });
};
