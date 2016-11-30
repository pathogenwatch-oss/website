import { createSelector } from 'reselect';

const defaultBounds = { center: [ 0, 0 ], zoom: 1 };

export function getMap(state, { stateKey }) {
  return state.map[stateKey] || {};
}

export const getBounds = createSelector(
  getMap,
  ({ bounds = defaultBounds }) => bounds
);

export const getLassoPath = createSelector(
  getMap,
  ({ lassoPath }) => lassoPath
);

export const getViewByCountry = createSelector(
  getMap,
  ({ viewByCountry = false }) => viewByCountry
);

export const getMarkerSize = createSelector(
  getMap,
  ({ markerSize = 1 }) => markerSize
);
