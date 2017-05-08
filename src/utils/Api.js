/* global $ */

import CONFIG from '../app/config';

export function getServerPath(path) {
  return (
    CONFIG.api ? `${CONFIG.api.address}${path}` : path
  );
}

function ajax(config) {
  return new Promise((resolve, reject) => {
    $.ajax(
      process.env.NODE_ENV === 'production' ?
        config :
        { ...config, xhrFields: { withCredentials: true } }
    )
    .done(data => resolve(data))
    .fail(error => reject(error));
  });
}

export function fetchJson(method, path, data) {
  return ajax({
    type: method,
    url: getServerPath(path),
    contentType: 'application/json; charset=UTF-8',
    data: method === 'GET' ? data : JSON.stringify(data),
    dataType: 'json',
  });
}

export function fetchBinary(method, path, data, progressFn) {
  return ajax({
    type: method,
    url: getServerPath(path),
    contentType: 'application/zip',
    data,
    processData: false,
    dataType: 'json',
    xhr: progressFn ? function () {
      const xhr = new window.XMLHttpRequest();

      let previousPercent = 0;

      xhr.upload.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          const percentComplete = (evt.loaded / evt.total) * 100;
          const percentRounded =
            Math.floor(percentComplete / 10) * 10;

          if (percentRounded > previousPercent) {
            progressFn(percentRounded);
            previousPercent = percentRounded;
          }
        }
      }, false);

      return xhr;
    } : undefined,
  });
}

export function getCollection(collectionId) {
  console.log(`[WGSA] Getting collection ${collectionId}`);
  return fetchJson('GET', `/api/collection/${collectionId}`);
}

export function requestFile({ organismId, idType = 'genome', format }, requestBody) {
  return fetchJson(
    'POST',
    `/api/organism/${organismId}/download/type/${idType}/format/${format}`,
    requestBody
  );
}

export function makeFileRequest(format, id, organismId) {
  return () => requestFile(
    { organismId, format },
    { idList: Array.isArray(id) ? id : [ id ] }
  );
}
