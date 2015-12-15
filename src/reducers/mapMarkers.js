import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_TREE } from '../actions/tree';
import {
  SET_UNFILTERED_IDS,
  ACTIVATE_FILTER,
  RESET_FILTER,
} from '../actions/filter';


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
  [SET_TREE]: function (state, { ready, result }) {
    if (ready && result) {
      return state.concat(MapUtils.getMarkerDefinitions(
        Object.keys(result.assemblies).map(id => result.assemblies[id])
      ));
    }
    return state;
  },
  [SET_UNFILTERED_IDS]: function (state, { ids }) {
    return state.map(markerDef => {
      if ([ ...markerDef.assemblyIds ].some(id => ids.has(id))) {
        return { ...markerDef, visible: true };
      }
      return { ...markerDef, visible: false };
    });
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
