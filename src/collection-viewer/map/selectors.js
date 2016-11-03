import { createSelector } from 'reselect';

import { getVisibleAssemblies, getColourGetter } from '../selectors';

export const getBounds = ({ collection: { map: { bounds } } }) => bounds;

export const getLassoPath = ({ collection: { filter: { area } } }) => area;

export const getMarkers = createSelector(
  getVisibleAssemblies,
  getColourGetter,
  (items, colourGetter) => items.reduce((markers, assembly) => {
    const { assemblyId, assemblyName, position } = assembly.metadata;
    if (position.latitude && position.longitude) {
      markers.push({
        position: [ position.latitude, position.longitude ],
        title: assemblyName,
        id: assemblyId,
        colour: colourGetter(assembly),
      });
    }
    return markers;
  }, [])
);
