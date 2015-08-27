import { client as CONFIG } from '../../config.json';

const API_PATH = `http://${CONFIG.api.hostname}:${CONFIG.api.port}/api`;

function getCollectionId(speciesId, collectionData, callback) {
  $.ajax({
    type: 'POST',
    url: `${API_PATH}/species/${speciesId}/collection`,
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(collectionData, null, 4),
    dataType: 'json',
  })
  .done(function (data) {
    callback(null, data);
  })
  .fail(function (error) {
    callback(error, null);
  });
}

function postAssembly({ speciesId, collectionId, assemblyId }, assemblyData, callback) {
  $.ajax({
    type: 'POST',
    url: `${API_PATH}/species/${speciesId}/collection/${collectionId}/assembly/${assemblyId}`,
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(assemblyData, null, 4),
    dataType: 'json',
  })
  .done(function (data) {
    callback(null, data);
  })
  .fail(function (error) {
    callback(error, null);
  });
}

function getReferenceCollection(speciesId, callback) {
  const options = {
    url: `${API_PATH}/species/${speciesId}/reference`,
  };

  $.get(options.url)
    .done(function (collection) {
      // console.log('[Macroreact] Received reference collection:');
      // console.dir(collection);

      callback(null, collection);
    })
    .fail(function (error) {
      callback(error, null);
    });
}

function getCollection(speciesId, collectionId, callback) {
  console.log(`[Macroreact] Getting collection ${collectionId}`);

  const options = {
    url: `${API_PATH}/species/${speciesId}/collection/${collectionId}`,
  };

  if (!collectionId) {
    return callback(new Error('Missing collection ID'), null);
  }

  $.get(options.url)
    .done(function (response) {
      // console.log(`[Macroreact] Received collection ${response.collection.collectionId}:`);
      // console.dir(response);

      callback(null, response);
    })
    .fail(function (error) {
      callback(error, null);
    });
}

module.exports = {
  postAssembly: postAssembly,
  getCollectionId: getCollectionId,
  getCollection: getCollection,
  getReferenceCollection: getReferenceCollection,
};
