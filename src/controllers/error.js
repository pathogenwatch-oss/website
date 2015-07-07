var errorCodes = {
  KEY_DOES_NOT_EXIST: 13
};

function notAServerError(error) {
  return (
    error.code === errorCodes.KEY_DOES_NOT_EXIST
  );
}

function handleErrors(app) {
  app.use(function (error, req, res, next) {
    if (notAServerError(error)) {
      // continue routing
      return next();
    }
    res.status(500);
    res.render('500');
  });
}

module.exports.handleErrors = handleErrors;
