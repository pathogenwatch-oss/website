var ensureEarssData = require('../earss');
var Project = require('../server/models/project');

var fixture = require('./fixture.json');

module.exports = function (done) {
  Project.remove({}, function () {
    var project = new Project(fixture);
    project.save(function (error) {
      if (error) {
        throw error;
      }
      ensureEarssData(done);
    });
  });
};
