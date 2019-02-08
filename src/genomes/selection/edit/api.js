import { fetchJson } from '../../../utils/Api';

export function updateMetadata(data) {
  return fetchJson('POST', '/api/genome', data);
}
