import { fetchJson } from '../../utils/Api';

export function fetchDownloads(ids) {
  return fetchJson('POST', '/api/download', { ids });
}
