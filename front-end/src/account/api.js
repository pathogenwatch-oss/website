import { fetchJson } from '../utils/Api';

export function fetchActivity() {
  return fetchJson('GET', '/api/account/activity');
}
