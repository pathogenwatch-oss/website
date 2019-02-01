import { fetchJson } from '../utils/Api';

export function getToken() {
  return fetchJson('GET', '/api/auth');
}
