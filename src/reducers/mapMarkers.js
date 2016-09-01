import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_TREE } from '../actions/tree';
import { SET_UNFILTERED_IDS } from '../actions/filter';


import { addAssembliesToMarkerDefs } from '^/utils/Map';

const initialState = [];

const actions = {
  [FETCH_ENTITIES.SUCCESS](state, payload) {
    const { assemblies } = payload[0];
    return addAssembliesToMarkerDefs(
      Object.keys(assemblies).map(id => assemblies[id]),
      state,
    );
  },
  [SET_TREE.SUCCESS](state, { result }) {
    if (!result) return state;

    return addAssembliesToMarkerDefs(
      Object.keys(result.assemblies).map(id => result.assemblies[id]),
      state,
    );
  },
  [SET_UNFILTERED_IDS](state, { ids }) {
    return state.map(markerDef => {
      if (markerDef.assemblyIds.some(id => ids.has(id))) {
        return { ...markerDef, visible: true };
      }
      return { ...markerDef, visible: false };
    });
  },
};

export default { actions, initialState };
