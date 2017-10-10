import { createSelector } from 'reselect';

import { getGenomeState } from '../selectors';
import { getLassoPath } from '../../map/selectors';

import { contains } from 'leaflet-lassoselect/utils';

export const getMarkers = state => getGenomeState(state).map.markers;
export const getFilter = state => getGenomeState(state).map.filter;

export const getGenomesInPath = createSelector(
  getMarkers,
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
