
function prefilterValidation(req, res, next) {
  const { query = {}, user } = req;
  const { prefilter } = query;

  if (prefilter === 'user' || prefilter === 'bin') {
    if (!user || !user._id) {
      res.sendStatus(401);
    }
  }

  next();
}

module.exports = function (app) {
  app.use('/api/', [
    prefilterValidation,
    require('routes/genome'),
    require('routes/collection'),
    require('routes/download-request'),
    require('routes/summary'),
    require('routes/organism'),
  ]);

  app.use('/download/', [
    require('routes/download'),
    require('routes/organism-download'),
  ]);

  app.use('/zika', (req, res) =>
    res.redirect('http://demo.wgsa.net/zikv/collection/vwcofr0w6v07')
  );

  app.use('/rensm/brynildsrud', (req, res) =>
    res.redirect('https://demo.wgsa.net/rensm/collection/ybdr2i0l6hmv')
  );
};
