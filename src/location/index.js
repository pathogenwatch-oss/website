import queryString from 'query-string';

import { history } from '../app/router';

function push(nextString = '') {
  history.push({
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

export LocationListener from './LocationListener.react';
export default from './NavLink.react';
