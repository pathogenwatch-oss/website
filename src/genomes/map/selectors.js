import { createSelector } from 'reselect';

import { getFilter, getVisibleGenomes } from '../filter/selectors';

export const getLassoPath = createSelector(
  getFilter,
  ({ area }) => area
);

export const getMarkers = createSelector(
  getVisibleGenomes,
  genomes => genomes.reduce((markers, { id, name, latitude, longitude }) => {
    if (latitude && longitude) {
      markers.push({
        id,
        title: name,
        position: [ latitude, longitude ],
      });
    }
    return markers;
  }, [])
);
