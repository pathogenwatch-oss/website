import { fetchJson } from '../utils/Api';

export function getToken() {
  return fetchJson('GET', '/auth/token');
}
