import { createSelector } from 'reselect';

export function getMap(state, { stateKey }) {
  return state.map[stateKey] || {
    bounds: { center: [ 0, 0 ], zoom: 1 },
  };
}

export const getBounds = createSelector(
  getMap,
  ({ bounds }) => bounds
);
