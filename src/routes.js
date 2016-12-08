module.exports = function (app) {
  app.use('/api/', [
    require('routes/assembly'),
    require('routes/upload'),
    require('routes/collection'),
    require('routes/resistance'),
    require('routes/download'),
    require('routes/user'),
  ]);

  app.use(require('routes/speciesDownloads'));

  app.use('/zika', (req, res) =>
    res.redirect('http://wgsadev.pathogensurveillance.net/zikv/upload')
  );
};
