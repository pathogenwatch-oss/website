module.exports = function (app) {
  app.use('/api/', [
    require('routes/genome'),
    require('routes/collection'),
    require('routes/download-request'),
    require('routes/user'),
    require('routes/summary'),
  ]);

  app.use('/download/', [
    require('routes/download'),
    require('routes/speciesDownloads'),
  ]);

  app.use('/zika', (req, res) =>
    res.redirect('http://edge.wgsa.net/zikv/upload')
  );

  app.use('/rensm/brynildsrud', (req, res) =>
    res.redirect('https://edge.wgsa.net/rensm/collection/8eapb3glwwgh')
  );
};
