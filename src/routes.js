module.exports = function (app) {
  app.use('/api/v1/', [
    require('routes/collection'),
    require('routes/antibiotic'),
    require('routes/download')
  ]);

  // must be registered last
  app.use(require('routes/notFound'));
};
