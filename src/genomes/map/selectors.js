import { createSelector } from 'reselect';

import { getFilter } from '../filter/selectors';
import { getGenomeList } from '../selectors';

export const getLassoPath = createSelector(
  getFilter,
  ({ area }) => area
);

export const getMarkers = createSelector(
  getGenomeList,
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
