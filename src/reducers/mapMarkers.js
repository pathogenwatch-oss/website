import { FETCH_ENTITIES } from '../actions/fetch';
import { ACTIVATE_FILTER, RESET_FILTER } from '../actions/filter';

import MapUtils from '^/utils/Map';

const initialState = [];

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const { assemblies } = result[0];
      return MapUtils.getMarkerDefinitions(
        Object.keys(assemblies).map(id => assemblies[id])
      );
    }
    return state;
  },
  [ACTIVATE_FILTER]: function (state, { ids }) {
    return state.map(markerDef => {
      if ([ ...markerDef.assemblyIds ].some(id => ids.has(id))) {
        return { ...markerDef, active: true };
      }
      return { ...markerDef, active: false };
    });
  },
  [RESET_FILTER]: function (state) {
    return state.map(markerDef => {
      return { ...markerDef, active: true };
    });
  },
};

export default { actions, initialState };
