import { fetchJson } from '../utils/Api';

export function fetchSummary() {
  return fetchJson('GET', '/api/organism/summary');
}
