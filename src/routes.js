module.exports = function (app) {
  app.use('/api/', [
    require('routes/upload'),
    require('routes/collection'),
    require('routes/antibiotic'),
    require('routes/download'),
  ]);

  app.use(require('routes/speciesDownloads'));
};
