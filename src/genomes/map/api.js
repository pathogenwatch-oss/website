import { fetchJson } from '../../utils/Api';

export function fetchByCoordinates(coordinates) {
  return fetchJson('POST', '/api/genome/at-locations', { coordinates });
}
