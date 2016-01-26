/* global $ */

import FileUploadingProgressActionCreators
  from '../actions/FileUploadingProgressActionCreators';

import CONFIG from '../config';

export const API_ROOT =
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

export function getCollectionId(speciesId, collectionData, callback) {
  $.ajax(
    postJson(`/species/${speciesId}/collection`, collectionData)
  ).done(function (data) {
    callback(null, data);
  })
  .fail(function (error) {
    callback(error);
  });
}

export function postAssembly(params, requestBody, callback) {
  const { speciesId, collectionId, assemblyId } = params;
  $.ajax(
    postJson(
      `/species/${speciesId}/collection/${collectionId}/assembly/${assemblyId}`,
      requestBody,
      FileUploadingProgressActionCreators.setAssemblyProgress.bind(null, assemblyId)
    )
  ).done(function (data) {
    callback(null, data);
  })
  .fail(function (error) {
    callback(error);
  });
}

export function getReferenceCollection(speciesId) {
  return $.get(`${API_ROOT}/species/${speciesId}/reference`);
}

export function getCollection(speciesId, collectionId) {
  console.log(`[WGSA] Getting collection ${collectionId}`);
  return $.get(`${API_ROOT}/species/${speciesId}/collection/${collectionId}`);
}

export function requestFile(fileType, idType, requestBody) {
  console.log(`request url /download/type/collection/format/${fileType}`);
  return $.ajax(
    postJson(`/download/type/${idType}/format/${fileType}`, requestBody)
  );
}

export function getAntibiotics(speciesId) {
  return $.get(`${API_ROOT}/species/${speciesId}/antibiotics`);
}

export function getSubtree(speciesId, collectionId, subtreeId) {
  return $.get(`${API_ROOT}/species/${speciesId}/collection/${collectionId}/subtree/${subtreeId}`);
}
