import queryString from 'query-string';
import { browserHistory } from 'react-router';

function push(nextString = '') {
  browserHistory.push({
    pathname: location.pathname,
    search: nextString.length ? `?${nextString.replace(/%20/g, '+')}` : '',
  });
}

export function updateQueryString(query) {
  const qs = queryString.parse(location.search);
  const nextString = queryString.stringify({
    ...qs,
    ...Object.keys(query).reduce((memo, key) => {
      const value = query[key];
      memo[key] = value === qs[key] ? undefined : value;
      return memo;
    }, {}),
  });
  push(nextString);
}

export function clearQueryString() {
  push();
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

export function reducer(state = {}, { type, payload }) {
  switch (type) {
    case LOCATION_CHANGE: {
      const { location } = payload;
      return {
        slug: createSlug(payload.location),
        ...location,
      };
    }
    default:
      return state;
  }
}

export LocationListener from './LocationListener.react';
export default from './NavLink.react';
