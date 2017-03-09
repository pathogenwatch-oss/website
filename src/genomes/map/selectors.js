import { createSelector } from 'reselect';

import { getGenomeState, getGenomeList } from '../selectors';

import { contains } from 'leaflet-lassoselect/utils';

export const getLassoPath = createSelector(
  getGenomeState,
  ({ map }) => map.lassoPath
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

export const getGenomesInPath = createSelector(
  getGenomeList,
  getLassoPath,
  (genomes, path) => (
    path ?
      genomes.reduce((memo, genome) => {
        const { latitude, longitude } = genome;
        if (!latitude || !longitude) return memo;
        if (contains(path, { lat: latitude, lng: longitude })) {
          return memo.concat(genome);
        }
        return memo;
      }, []) :
      []
  )
);
