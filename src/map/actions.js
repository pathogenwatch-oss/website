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
