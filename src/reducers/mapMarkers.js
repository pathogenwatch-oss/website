import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_TREE } from '../actions/tree';
import {
  SET_UNFILTERED_IDS,
  ACTIVATE_FILTER,
  RESET_FILTER,
} from '../actions/filter';


import { addAssembliesToMarkerDefs } from '^/utils/Map';

const initialState = [];

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const { assemblies } = result[0];
      return addAssembliesToMarkerDefs(
        Object.keys(assemblies).map(id => assemblies[id]),
        state,
      );
    }
    return state;
  },
  [SET_TREE]: function (state, { ready, result }) {
    if (ready && result) {
      return addAssembliesToMarkerDefs(
        Object.keys(result.assemblies).map(id => result.assemblies[id]),
        state,
      );
    }
    return state;
  },
  [SET_UNFILTERED_IDS]: function (state, { ids }) {
    return state.map(markerDef => {
      if (markerDef.assemblyIds.some(id => ids.has(id))) {
        return { ...markerDef, visible: true };
      }
      return { ...markerDef, visible: false };
    });
  },
};

export default { actions, initialState };
