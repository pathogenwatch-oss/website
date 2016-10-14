const LOCATION_CHANGE = 'LOCATION_CHANGE';

export function locationChange(location) {
  return {
    type: LOCATION_CHANGE,
    payload: {
      location,
    },
  };
}

export function reducer(state = '/', { type, payload }) {
  switch (type) {
    case LOCATION_CHANGE:
      return payload.location;
    default:
      return state;
  }
}

export default from './NavLink.react';
