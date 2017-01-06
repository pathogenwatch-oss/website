module.exports = function (app) {
  app.use('/api/', [
    require('routes/collection'),
    require('routes/antibiotic'),
    require('routes/download'),
  ]);

  app.use('/zika', (req, res) =>
    res.redirect('http://demo.wgsa.net/zikv/upload')
  );

  app.use('/rensm', (req, res) =>
    res.redirect('https://edge.wgsa.net/rensm/collection/8eapb3glwwgh')
  );
};
