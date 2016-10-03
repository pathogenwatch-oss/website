export const HUB_MAP_STORE_BOUNDS = 'HUB_MAP_STORE_BOUNDS';

function storeBounds(newBounds) {
  return {
    type: HUB_MAP_STORE_BOUNDS,
    payload: { newBounds },
  };
}

export const HUB_MAP_LASSO_CHANGE = 'HUB_MAP_LASSO_CHANGE';

function changeLassoPath(path) {
  return {
    type: HUB_MAP_LASSO_CHANGE,
    payload: { path },
  };
}

export default {
  storeBounds,
  changeLassoPath,
};
