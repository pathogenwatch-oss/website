import { client as CONFIG } from '../../config.json';

const API_PATH = `http://${CONFIG.api.hostname}:${CONFIG.api.port}/api/v1`;

function getCollectionId(collectionData, callback) {
  $.ajax({
    type: 'POST',
    url: `${API_PATH}/collection`,
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

function postAssembly(assemblyData, callback) {
  $.ajax({
    type: 'POST',
    url: `${API_PATH}/assembly`,
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

function getReferenceCollection(callback) {
  const options = {
    url: `${API_PATH}/collection/reference/1280`,
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

function getCollection(collectionId, callback) {
  console.log(`[Macroreact] Getting collection ${collectionId}`);

  const options = {
    url: `${API_PATH}/collection/${collectionId}`,
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
