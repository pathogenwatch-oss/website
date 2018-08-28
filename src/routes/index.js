module.exports = function (app) {
  app.use('/api/', require('./api'));

  app.use('/download/', require('./download'));

  app.use(require('./redirects'));
};
