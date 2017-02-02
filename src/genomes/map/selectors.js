import { createSelector } from 'reselect';

import { getFilter, getVisibleGenomes } from '../filter/selectors';

export const getLassoPath = createSelector(
  getFilter,
  ({ area }) => area
);

export const getMarkers = createSelector(
  getVisibleGenomes,
  genomes => genomes.reduce((markers, { id, name, metadata = {} }) => {
    if (metadata.latitude && metadata.longitude) {
      markers.push({
        id,
        title: name,
        position: [ metadata.latitude, metadata.longitude ],
      });
    }
    return markers;
  }, [])
);
