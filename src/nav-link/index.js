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
    case LOCATION_CHANGE:
      return {
        slug: createSlug(payload.location),
      };
    default:
      return state;
  }
}

export default from './NavLink.react';
