module.exports = function (app) {
  app.use('/api/', [
    require('routes/genome'),
    require('routes/collection'),
    require('routes/download-request'),
    require('routes/summary'),
  ]);

  app.use('/download/', [
    require('routes/download'),
    require('routes/speciesDownloads'),
  ]);

  app.use('/zika', (req, res) =>
    res.redirect('http://demo.wgsa.net/zikv/collection/vwcofr0w6v07')
  );

  app.use('/rensm/brynildsrud', (req, res) =>
    res.redirect('https://demo.wgsa.net/rensm/collection/ybdr2i0l6hmv')
  );
};
