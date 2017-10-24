import { fetchJson } from '../utils/Api';

export function sendSignInToken(user) {
  return fetchJson('POST', '/auth/passwordless', { user });
}
