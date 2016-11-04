import { createSelector } from 'reselect';

import { getVisibleAssemblies, getColourGetter } from '../selectors';

export const getBounds = ({ collection: { map: { bounds } } }) => bounds;

export const getLassoPath = ({ collection: { filter: { area } } }) => area;


export const getMarkers = createSelector(
  getVisibleAssemblies,
  getColourGetter,
  (items, colourGetter) => {
    const markers = Array.from(items.reduce((memo, assembly) => {
      const { assemblyId, position } = assembly.metadata;
      if (position.latitude && position.longitude) {
        const colour = colourGetter(assembly);
        const key = `${position.latitude},${position.longitude}`;
        const marker = memo.get(key) || {
          position: [ position.latitude, position.longitude ],
          id: [],
          title: '',
          colours: new Map(),
        };
        marker.id.push(assemblyId);
        marker.title = marker.id.length;
        marker.colours.set(colour, (marker.colours.get(colour) || 0) + 1);
        return memo.set(key, marker);
      }
    }, new Map()).values());
    console.log(markers);
    return markers;
  }
  // (items, colourGetter) => items.reduce((markers, assembly) => {
  //   const { assemblyId, assemblyName, position } = assembly.metadata;
  //   if (position.latitude && position.longitude) {
  //     markers.push({
  //       position: [ position.latitude, position.longitude ],
  //       title: assemblyName,
  //       id: assemblyId,
  //       colour: colourGetter(assembly),
  //     });
  //   }
  //   return markers;
  // }, [])
);
