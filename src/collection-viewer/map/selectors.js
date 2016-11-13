import { createSelector } from 'reselect';
import { contains } from 'leaflet-lassoselect/utils';

import { getLassoPath } from '../../map/selectors';

import {
  getVisibleAssemblies,
  getFilteredAssemblyIds,
  getColourGetter,
} from '../selectors';

const markerState = { visibleIds: new Set() };
export const getMarkers =
// createSelector(
//   getVisibleAssemblies,
//   getFilteredAssemblyIds,
//   getColourGetter,
  ({ assemblies, visibleIds, ids, colourGetter }) => {
    console.log(
      markerState.assemblies === assemblies,
      markerState.visibleIds === visibleIds, visibleIds.size, markerState.visibleIds.size,
      markerState.ids === ids,
      markerState.colourGetter === colourGetter
    );
    markerState.assemblies = assemblies;
    markerState.visibleIds = visibleIds;
    markerState.ids = ids;
    markerState.colourGetter = colourGetter;

    const items = Array.from(visibleIds).map(id => assemblies[id]);
    return Array.from(
      items.reduce((memo, assembly) => {
        const { assemblyId, position } = assembly.metadata;
        if (position.latitude && position.longitude) {
          const colour = colourGetter(assembly);
          const key = `${position.latitude},${position.longitude}`;
          const marker = memo.get(key) ||
            { position, id: [], title: '', slices: new Map(), highlighted: false };
          marker.id.push(assemblyId);
          marker.title = marker.id.length;
          marker.slices.set(colour, (marker.slices.get(colour) || 0) + 1);
          marker.highlighted = marker.highlighted || ids.has(assemblyId);
          memo.set(key, marker);
        }
        return memo;
      }, new Map()).values()
    );
  };
// );

export const getAssemblyIdsInPath = createSelector(
  getMarkers,
  getLassoPath,
  (markers, path) =>
    markers.reduce((ids, { id, position: { latitude, longitude } }) => {
      if (contains(path, { lat: latitude, lng: longitude })) {
        return ids.concat(id);
      }
      return ids;
    }, [])
);
