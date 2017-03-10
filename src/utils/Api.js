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

export function fetchJson(method, path, data) {
  return ajax({
    type: method,
    url: `${SERVER_ADDRESS}${path}`,
    contentType: 'application/json; charset=UTF-8',
    data: method === 'GET' ? data : JSON.stringify(data),
    dataType: 'json',
    xhrFields: {
      withCredentials: true,
    },
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
    xhrFields: {
      withCredentials: true,
    },
  });
}

export function getCollection(collectionId) {
  console.log(`[WGSA] Getting collection ${collectionId}`);
  return fetchJson('GET', `/api/collection/${collectionId}`);
}

export function requestFile({ organismId, idType = 'genome', format }, requestBody) {
  return postJson(
    `/organisms/${organismId}/download/type/${idType}/format/${format}`,
    requestBody
  );
}

export function makeFileRequest(format, id, organismId) {
  return () => requestFile(
    { organismId, format },
    { idList: Array.isArray(id) ? id : [ id ] }
  );
}
