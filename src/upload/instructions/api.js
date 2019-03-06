import config from '../../app/config';
const { assemblerAddress } = config;

export function fetchUsage(token) {
  return fetch(`${assemblerAddress}/api/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    }
    throw new Error(response.statusText);
  });
}
