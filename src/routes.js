module.exports = function (app) {
  app.use('/api/', [
    require('routes/upload'),
    require('routes/collection'),
    require('routes/resistance'),
    require('routes/download'),
  ]);

  app.use(require('routes/speciesDownloads'));

  app.use('/zika', (req, res) =>
    res.redirect('http://edge.wgsa.net/zikv/upload')
  );

  app.use('/rensm/brynildsrud', (req, res) =>
    res.redirect('https://edge.wgsa.net/rensm/collection/8eapb3glwwgh')
  );
};
