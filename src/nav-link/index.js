const NAV_LINK_LOCATION_CHANGE = 'NAV_LINK_LOCATION_CHANGE';

export function locationChange(location) {
  return {
    type: NAV_LINK_LOCATION_CHANGE,
    payload: {
      location,
    },
  };
}

export function reducer(state = '/', { type, payload }) {
  switch (type) {
    case NAV_LINK_LOCATION_CHANGE:
      return payload.location;
    default:
      return state;
  }
}

export default from './NavLink.react';
