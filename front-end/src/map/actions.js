export const MAP_STORE_BOUNDS = 'MAP_STORE_BOUNDS';

export function storeBounds(stateKey, bounds) {
  return {
    type: MAP_STORE_BOUNDS,
    payload: { stateKey, bounds },
  };
}

export const MAP_LASSO_CHANGE = 'MAP_LASSO_CHANGE';

export function changeLassoPath(stateKey, path) {
  return {
    type: MAP_LASSO_CHANGE,
    payload: { stateKey, path },
  };
}

export const MAP_VIEW_BY_COUNTRY = 'MAP_VIEW_BY_COUNTRY';

export function viewByCountry(stateKey, active) {
  return {
    type: MAP_VIEW_BY_COUNTRY,
    payload: { stateKey, active },
  };
}

export const MAP_MARKER_SIZE_CHANGED = 'MAP_MARKER_SIZE_CHANGED';

export function markerSizeChanged(stateKey, size) {
  return {
    type: MAP_MARKER_SIZE_CHANGED,
    payload: { stateKey, size },
  };
}
