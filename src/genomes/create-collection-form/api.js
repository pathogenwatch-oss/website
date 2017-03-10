import { API_ROOT } from '../../utils/Api';

export function createCollectionRequest(genomes, organismId, metadata) {
  return $.ajax({
    type: 'PUT',
    url: `${API_ROOT}/collection`,
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify({
      organismId,
      ...metadata,
      genomeIds: genomes.map(_ => _.id),
    }),
    dataType: 'json',
  });
}
