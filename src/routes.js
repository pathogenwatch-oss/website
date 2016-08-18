module.exports = function (app) {
  app.use('/api/', [
    require('routes/collection'),
    require('routes/antibiotic'),
    require('routes/download'),
  ]);

  app.use(require('routes/speciesDownloads'));

  app.use('/zika', (req, res) =>
    res.redirect('http://wgsadev.pathogensurveillance.net/zikv/upload')
  );
};
