module.exports = function (app) {
  app.use('/api/', [
    require('routes/genome'),
    require('routes/collection'),
    require('routes/resistance'),
    require('routes/user'),
  ]);

  app.use(require('routes/download'));
  app.use(require('routes/speciesDownloads'));

  app.use('/zika', (req, res) =>
    res.redirect('http://wgsadev.pathogensurveillance.net/zikv/upload')
  );
};
