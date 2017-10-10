
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

function notFound(req, res) {
  res.sendStatus(404);
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
    notFound,
  ]);

  app.use('/download/', [
    require('routes/download'),
    require('routes/organism-download'),
    notFound,
  ]);

  app.use(require('routes/redirects'));
};
