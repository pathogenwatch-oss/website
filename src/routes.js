module.exports = function (app) {
  app.use('/api/', [
    require('routes/genome'),
    require('routes/collection'),
    require('routes/download-request'),
    require('routes/user'),
  ]);

  app.use('/download/', [
    require('routes/download'),
    require('routes/speciesDownloads'),
  ]);

  app.use('/zika', (req, res) =>
    res.redirect('http://wgsadev.pathogensurveillance.net/zikv/upload')
  );
};
