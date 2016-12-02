/* global $ */

import CONFIG from '../app/config';

export const SERVER_ADDRESS =
  CONFIG.api ? `http://${CONFIG.api.address}` : '';

export const API_ROOT = `${SERVER_ADDRESS}/api`;

function ajax(config) {
  return new Promise((resolve, reject) => {
    $.ajax(config).
      done(data => resolve(data)).
      fail(error => reject(error));
  });
}

export function postJson(path, data, progressFn) {
  return ajax({
    type: 'POST',
    url: `${API_ROOT}${path}`,
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(data),
    dataType: 'json',
    xhr() {
      const xhr = new window.XMLHttpRequest();

      if (progressFn) {
        xhr.upload.addEventListener('progress', evt => {
          if (evt.lengthComputable) {
            const percentComplete = (evt.loaded / evt.total) * 100;
            progressFn(percentComplete);
          }
        }, false);
      }

      return xhr;
    },
  });
}

export function getCollectionId(speciesId, collectionData, callback) {
  postJson(`/species/${speciesId}/collection`, collectionData)
    .then(data => callback(null, data), error => callback(error));
}

export function getReferenceCollection(speciesId) {
  return $.get(`${API_ROOT}/species/${speciesId}/reference`);
}

export function getCollection(speciesId, collectionId) {
  console.log(`[WGSA] Getting collection ${collectionId}`);
  return $.get(`${API_ROOT}/species/${speciesId}/collection/${collectionId}`);
}

export function requestFile({ speciesId, idType = 'assembly', format }, requestBody) {
  return postJson(
    `/species/${speciesId}/download/type/${idType}/format/${format}`,
    requestBody
  );
}

export function makeFileRequest(format, id, speciesId) {
  return () => requestFile(
    { speciesId, format },
    { idList: Array.isArray(id) ? id : [ id ] }
  );
}

export function getResistanceData(speciesId) {
  return $.get(`${API_ROOT}/species/${speciesId}/resistance`);
}

export function getSubtree(speciesId, collectionId, subtreeId) {
  return ajax({
    type: 'GET',
    url: `${API_ROOT}/species/${speciesId}/collection/${collectionId}/subtree/${subtreeId}`,
  });
}

export function checkCollectionStatus(collectionId) {
  return $.get(`${API_ROOT}/collection/${collectionId}`);
}
