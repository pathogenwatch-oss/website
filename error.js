var Ouch = require('ouch');

module.exports = function (app) {

  app.use(function (error, req, res, next) {
    new Ouch().pushHandler(
      new Ouch.handlers.PrettyPageHandler('blue', null, 'sublime')
    ).handleException(error, req, res, function () {
      console.log(error);
      next();
    });
  });

};
