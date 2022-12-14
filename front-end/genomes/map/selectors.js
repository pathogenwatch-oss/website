import sortBy from 'lodash.sortby';

import { createSelector } from 'reselect';

import { getGenomeState } from '../selectors';
import { getLassoPath } from '../../map/selectors';

import { contains } from 'leaflet-lassoselect/utils';

export const getMarkers = state => getGenomeState(state).map.markers;
export const getFilter = state => getGenomeState(state).map.filter;
export const getPopup = state => getGenomeState(state).map.popup;

export const getPopupList = createSelector(
  getPopup,
  popup => {
    const list = [];
    for (const {
      genomes,
      organismId,
      speciesName,
      subspecies,
      serotype,
    } of popup.genomes) {
      for (const { id, name } of genomes) {
        list.push({ id, name, organismId, speciesName, subspecies, serotype });
      }
    }
    return sortBy(list, 'name');
  }
);

export const getPositionsInPath = createSelector(
  getMarkers,
  getLassoPath,
  (markers, path) =>
    (path
      ? markers.reduce((memo, { position }) => {
        const [ latitude, longitude ] = position;
        if (!latitude || !longitude) return memo;
        if (contains(path, { lat: latitude, lng: longitude })) {
          memo.push(position);
          return memo;
        }
        return memo;
      }, [])
      : [])
);
