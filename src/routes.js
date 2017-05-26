
function prefilterValidation(req, res, next) {
  const { query = {}, user } = req;
  const { prefilter } = query;

  if (prefilter === 'user' || prefilter === 'bin') {
    if (!user || !user._id) {
      res.sendStatus(401);
      return;
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
    require('routes/account'),
  ]);

  app.use('/download/', [
    require('routes/download'),
    require('routes/organism-download'),
  ]);

  app.use(require('routes/redirects'));
};
