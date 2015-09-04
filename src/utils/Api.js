import CONFIG from '../config';

const API_ROOT = `http://${CONFIG.api.hostname}:${CONFIG.api.port}/api`;

function postJson(path, data) {
  return {
    type: 'POST',
    url: `${API_ROOT}${path}`,
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(data),
    dataType: 'json',
  };
}

function getCollectionId(speciesId, collectionData, callback) {
  $.ajax(
    postJson(`/species/${speciesId}/collection`, collectionData)
  ).done(function (data) {
    callback(null, data);
  })
  .fail(function (error) {
    callback(error, null);
  });
}

function postAssembly({ speciesId, collectionId, assemblyId }, assemblyData, callback) {
  $.ajax(
    postJson(
      `/species/${speciesId}/collection/${collectionId}/assembly/${assemblyId}`,
      assemblyData
    )
  ).done(function (data) {
    callback(null, data);
  })
  .fail(function (error) {
    callback(error, null);
  });
}

function getReferenceCollection(speciesId, callback) {
  $.get(`${API_ROOT}/species/${speciesId}/reference`)
    .done(function (collection) {
      callback(null, collection);
    })
    .fail(function (error) {
      callback(error, null);
    });
}

function getCollection(speciesId, collectionId, callback) {
  console.log(`[Macroreact] Getting collection ${collectionId}`);

  if (!collectionId) {
    return callback(new Error('Missing collection ID'), null);
  }

  $.get(`${API_ROOT}/species/${speciesId}/collection/${collectionId}`)
    .done(function (response) {
      callback(null, response);
    })
    .fail(function (error) {
      callback(error, null);
    });
}

function requestFile({ assembly, idType, fileType, speciesId }, callback) {
  const requestBody = {
    speciesId,
    idToFilenameMap: {
      [assembly.metadata.assemblyId]: assembly.metadata.assemblyFilename,
    },
  };

  $.ajax(
    postJson(`/download/type/${idType}/format/${fileType}`, requestBody)
  ).done(function (response) {
    console.log(response);
    callback(null, response);
  })
  .fail(function (error) {
    console.log(error);
    callback(error, null);
  });
}

export default {
  postAssembly,
  getCollectionId,
  getCollection,
  getReferenceCollection,
  requestFile,
};
