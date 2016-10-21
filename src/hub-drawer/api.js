import { API_ROOT } from '../utils/Api';

function removeViewModel({ id, name, speciesId, metrics, metadata }) {
  return { id, name, speciesId, metrics, metadata };
}

export function createCollectionRequest(files, speciesId, metadata) {
  return $.ajax({
    type: 'POST',
    url: `${API_ROOT}/collection`,
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify({
      speciesId,
      ...metadata,
      files: files.map(removeViewModel),
    }),
    dataType: 'json',
  });
}
