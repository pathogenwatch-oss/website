var request = require('./Http');

function getCollectionId(collectionData, callback) {
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:8080/collection/add',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(collectionData, null, 4),
    dataType: 'json'
  })
  .done(function (data) {
    callback(null, data);
  })
  .fail(function (error) {
    callback(error, null);
  });
}

function getCollection(assemblyData, callback) {
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:8080/collection',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(assemblyData, null, 4),
    dataType: 'json'
  })
  .done(function (data) {
    callback(null, data);
  })
  .fail(function (error) {
    callback(error, null);
  });
}

function postAssembly(assemblyData, callback) {
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:8080/assembly/add',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(assemblyData, null, 4),
    dataType: 'json'
  })
  .done(function (data) {
    callback(null, data);
  })
  .fail(function (error) {
    callback(error, null);
  });
}

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

module.exports = {
  postAssembly: postAssembly,
  getCollectionId: getCollectionId,
  getCollection: getCollection,
  getProject: getProject,
  postProject: postProject
};
