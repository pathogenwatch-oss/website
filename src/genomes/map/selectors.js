import { createSelector } from 'reselect';

import { getGenomeState } from '../selectors';
import { getLassoPath } from '../../map/selectors';

import { contains } from 'leaflet-lassoselect/utils';

export const getMarkers = state => getGenomeState(state).map.markers;
export const getFilter = state => getGenomeState(state).map.filter;
export const getPopup = state => getGenomeState(state).map.popup;

export const getGenomesInPath = createSelector(
  getMarkers,
  getLassoPath,
  (markers, path) => (
    path ?
      markers.reduce((memo, { position, genomes }) => {
        const { latitude, longitude } = position;
        if (!latitude || !longitude) return memo;
        if (contains(path, { lat: latitude, lng: longitude })) {
          return memo.concat(genomes);
        }
        return memo;
      }, []) :
      []
  )
);
