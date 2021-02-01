import { fetchJson } from '~/utils/Api';

import { formatGenomeRecords } from './utils';

export function getCollection(collectionId) {
  console.log(`[Pathogenwatch] Getting collection ${collectionId}`);
  return fetchJson('GET', `/api/collection/${collectionId}`)
    .then(result => {
      const collection = result.collection || result;
      return {
        ...collection,
        genomes: formatGenomeRecords(collection.genomes),
      };
    });
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
