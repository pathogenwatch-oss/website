import { fetchJson } from '~/utils/Api';

export function fetchQueuePosition(uploadedAt) {
  return fetchJson('GET', `/api/upload/${uploadedAt}/position`);
}
