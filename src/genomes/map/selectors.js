import { createSelector } from 'reselect';

import { getFilter, getVisibleGenomes } from '../filter/selectors';

export const getLassoPath = createSelector(
  getFilter,
  ({ area }) => area
);

export const getMarkers = createSelector(
  getVisibleGenomes,
  genomes => genomes.reduce((markers, { name, metadata = {} }) => {
    if (metadata.latitude && metadata.longitude) {
      markers.push({
        position: [ metadata.latitude, metadata.longitude ],
        title: name,
        id: name,
      });
    }
    return markers;
  }, [])
);
