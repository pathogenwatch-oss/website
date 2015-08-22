module.exports = function (app) {
  app.use('/api/', [
    require('routes/collection'),
    require('routes/antibiotic'),
    require('routes/download')
  ]);

  // must be registered last
  app.use(require('routes/notFound'));
};
