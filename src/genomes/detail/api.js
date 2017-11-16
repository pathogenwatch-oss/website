import { fetchJson } from '../../utils/Api';

export function fetchGenome(id) {
  return fetchJson('GET', `/api/genome/${id}`);
}
