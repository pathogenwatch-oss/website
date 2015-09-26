import { setAssemblyProgress } from '../actions/FileUploadingProgressActionCreators';

import CONFIG from '../config';

const API_ROOT =
  CONFIG.api ? `http://${CONFIG.api.hostname}:${CONFIG.api.port}/api` : '/api';

function postJson(path, data, progressFn) {
  return {
    type: 'POST',
    url: `${API_ROOT}${path}`,
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(data),
    dataType: 'json',
    xhr() {
      const xhr = new window.XMLHttpRequest();

      if (progressFn) {
        xhr.upload.addEventListener('progress', function (evt) {
          if (evt.lengthComputable) {
            const percentComplete = (evt.loaded / evt.total) * 100;
            progressFn(percentComplete);
          }
        }, false);
      }

      return xhr;
    },
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

function postAssembly({ speciesId, collectionId, assemblyId }, requestBody, callback) {
  $.ajax(
    postJson(
      `/species/${speciesId}/collection/${collectionId}/assembly/${assemblyId}`,
      requestBody,
      setAssemblyProgress.bind(null, assemblyId)
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

function requestFile(fileType, requestBody, callback) {
  console.log(`request url /download/type/collection/format/${fileType}`)
  $.ajax(
    postJson(`/download/type/collection/format/${fileType}`, requestBody)
  ).done(function (response) {
    console.log('req response', response);
    callback(null, response);
  })
  .fail(function (error) {
    console.log(error);
    callback(error, null);
  });
}

function getAntibiotics(speciesId, callback) {
  $.get(`${API_ROOT}/species/${speciesId}/antibiotics`)
    .done(function (antibiotics) {
      callback(null, antibiotics);
    })
    .fail(function (error) {
      callback(error, null);
    });
}

export default {
  postAssembly,
  getCollectionId,
  getCollection,
  getReferenceCollection,
  requestFile,
  getAntibiotics,
};
