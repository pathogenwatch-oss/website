import { FETCH_ENTITIES } from '../actions/fetch';

import { SET_VISIBLE_ASSEMBLY_IDS } from '../actions/filter';

import MapUtils from '^/utils/Map';

const initialState = [];

function getMarkerDefs(assemblyIds, combinedAssemblies) {
  return MapUtils.getMarkerDefinitions(
    assemblyIds.map(id => combinedAssemblies[id])
  );
}

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const { assemblies } = result[0];
      return getMarkerDefs(Object.keys(assemblies), assemblies);
    }

    return state;
  },
  [SET_VISIBLE_ASSEMBLY_IDS]: function (state, { assemblyIds }) {

  },
};

export default { actions, initialState };
