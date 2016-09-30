import { HUB_MAP_STORE_BOUNDS, HUB_MAP_LASSO_CHANGE } from '../actions/map';

export const bounds = {
  initialState: { center: [ 0, 0 ], zoom: 1 },
  actions: {
    [HUB_MAP_STORE_BOUNDS](state, { newBounds }) {
      return newBounds;
    },
  },
};

export const lassoPath = {
  initialState: null,
  actions: {
    [HUB_MAP_LASSO_CHANGE](state, { path }) {
      return path;
    },
  },
};
