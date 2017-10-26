function createSlug({ pathname }) {
  if (pathname === '/') {
    return 'home';
  }
  return pathname.split('/')[1];
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case 'LOCATION_CHANGE': {
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
