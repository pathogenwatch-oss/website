var express = require('express');
var apiRouter = express.Router();
var projectRouter = express.Router();

var projectController = require('./server/controllers/project');

projectRouter
  .use('/:shortId', function (req, res, next) {
    if (!req.params.shortId) {
      return res.sendStatus(400);
    }
    next();
  })
  .get('/wgsa', projectController.getWgsa)
  .get('/:shortId', projectController.getProject)
  .get('/:shortId/download/csv', projectController.downloadProjectCsv)
  .get('/:shortId/download/nwk', projectController.downloadProjectNwk)
  .post('/', projectController.createProject)

apiRouter
  .use('/project', projectRouter)
  .use(function (req, res) {
    res.sendStatus(404);
  });

module.exports = function (app) {
  app.use('/api/1.0', apiRouter);

  app.use(function (req, res) {
    res.render('catch-all');
  });
};
