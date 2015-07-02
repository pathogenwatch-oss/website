var request = require('./Http');

function getProject(projectId, callback) {
  var options = {
    url: '/api/1.0/project/' + projectId
  };

  if (!projectId) {
    return callback(new Error('Missing project ID'), null);
  }

  $.get(options.url)
    .done(function (project) {
      callback(null, project);
    })
    .fail(function (error) {
      callback(error, null);
    });
}

function postProject(projectData, callback) {
  $.ajax({
    type: 'POST',
    url: '/api/1.0/project',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(projectData, null, 4),
    dataType: 'json'
  })
  .done(function (projectMetadata) {
    var project = $.extend(projectData, projectMetadata);
    callback(null, project);
  })
  .fail(function (error) {
    callback(error, null);
  });
}

module.exports.getProject = getProject;
module.exports.postProject = postProject;
