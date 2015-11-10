/* global $ */

import { setAssemblyProgress, }
  from '../actions/FileUploadingProgressActionCreators';

import CONFIG from '../config';

const API_ROOT =
  CONFIG.api ? `http://${CONFIG.api.address}/api` : '/api';

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
    callback(error);
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
    callback(error);
  });
}

function getReferenceCollection(speciesId) {
  return $.get(`${API_ROOT}/species/${speciesId}/reference`);
}

function getCollection(speciesId, collectionId) {
  console.log(`[WGSA] Getting collection ${collectionId}`);
  return $.get(`${API_ROOT}/species/${speciesId}/collection/${collectionId}`);
}

function requestFile(fileType, requestBody, callback) {
  console.log(`request url /download/type/collection/format/${fileType}`);
  $.ajax(
    postJson(`/download/type/collection/format/${fileType}`, requestBody)
  ).done(function (response) {
    console.log('req response', response);
    callback(null, response);
  })
  .fail(function (error) {
    console.log(error);
    callback(error);
  });
}

function getAntibiotics(speciesId) {
  return $.get(`${API_ROOT}/species/${speciesId}/antibiotics`);
}

export default {
  postAssembly,
  getCollectionId,
  getCollection,
  getReferenceCollection,
  requestFile,
  getAntibiotics,
};
