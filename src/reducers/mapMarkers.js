import { FETCH_ENTITIES } from '../actions/fetch';

import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';

import MapUtils from '^/utils/Map';

const initialState = [];

function onMarkerClick(assemblyIds) {
  FilteredDataActionCreators.setAssemblyIds(assemblyIds);
}

function getMarkerDefs(assemblyIds, combinedAssemblies) {
  return MapUtils.getMarkerDefinitions(
    assemblyIds.map(id => combinedAssemblies[id]), {
      onClick: onMarkerClick,
      // getIcon: FilteredDataStore.getColourTableColumnName() ? MapUtils.resistanceMarkerIcon : undefined,
    }
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
};

export default { actions, initialState };
