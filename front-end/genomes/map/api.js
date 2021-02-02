import { stringify } from 'query-string';

import { fetchJson } from '../../utils/Api';

export function fetchByCoordinates(coordinates, filter) {
  const query = stringify(filter);
  return fetchJson('POST', `/api/genome/at-locations?${query}`, {
    coordinates,
  });
}
