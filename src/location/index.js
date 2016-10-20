import queryString from 'query-string';
import { browserHistory } from 'react-router';

export function updateQueryString(key, value) {
  const qs = queryString.parse(location.search);
  const nextString = queryString.stringify({
    ...qs,
    [key]: value === qs[key] ? undefined : value,
  });
  browserHistory.push(nextString.length ? `?${nextString}` : '');
}

export const LOCATION_CHANGE = 'LOCATION_CHANGE';

export function locationChange(location) {
  return {
    type: LOCATION_CHANGE,
    payload: {
      location,
    },
  };
}

function createSlug({ pathname }) {
  if (pathname === '/') {
    return 'home';
  }
  return pathname.split('/')[1];
}

export function reducer(state = '/', { type, payload }) {
  switch (type) {
    case LOCATION_CHANGE: {
      const { location } = payload;
      return {
        slug: createSlug(payload.location),
        pathname: location.pathname,
      };
    }
    default:
      return state;
  }
}

export default from './NavLink.react';
