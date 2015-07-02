var Project = require('../models/project');

function getWgsa(req, res, next) {
  var project = {
    data: null,
    tree: null,
    raw: null
  };

  res.json(project);
}

function getProject(req, res, next) {
  Project.findOne({ shortId: req.params.shortId }, function (error, project) {
    if (error) {
      return next(error);
    }
    if (!project) {
      return res.sendStatus(404);
    }

    project.raw = null;

    res.json(project);
  });
}

function downloadProjectCsv(req, res, next) {
  Project.findOne({ shortId: req.params.shortId }, function (error, project) {
    if (error) {
      return next(error);
    }
    if (!project) {
      return res.sendStatus(404);
    }

    res.setHeader('Content-disposition', 'attachment; filename=project_data.csv');
    res.setHeader('Content-type', 'text/csv');
    res.charset = 'UTF-8';
    res.write(project.raw.csv);
    res.end();
  });
}

function downloadProjectNwk(req, res, next) {
  Project.findOne({ shortId: req.params.shortId }, function (error, project) {
    if (error) {
      return next(error);
    }
    if (!project) {
      return res.sendStatus(404);
    }

    res.setHeader('Content-disposition', 'attachment; filename=project_tree.nwk');
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    res.write(project.tree);
    res.end();
  });
}

function createProject(req, res, next) {

  if (!req.body || !req.body.tree || !req.body.data || !req.body.metadata || !req.body.raw) {
    return res.sendStatus(400);
  }

  new Project(req.body).save(function (error, project) {
    if (error) {
      return next(error);
    }
    // client already has this data, no need to return it
    project.tree = null;
    project.isolates = null;

    res.json(project);
  });
}

module.exports = {
  getWgsa: getWgsa,
  getProject: getProject,
  createProject: createProject,
  downloadProjectCsv: downloadProjectCsv,
  downloadProjectNwk: downloadProjectNwk
};
