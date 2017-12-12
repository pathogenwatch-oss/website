
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
    require('./genome'),
    require('./collection'),
    require('./download-request'),
    require('./summary'),
    require('./organism'),
    require('./account'),
    notFound,
  ]);

  app.use('/download/', [
    require('./download'),
    require('./organism-download'),
    notFound,
  ]);

  app.use(require('./redirects'));
};
