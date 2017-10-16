import { fetchJson } from '../utils/Api';

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

export function makeFileRequest({ format, id, organismId, idType }) {
  return () => requestFile(
    { organismId, idType, format },
    { uuids: Array.isArray(id) ? id : [ id ] }
  );
}
