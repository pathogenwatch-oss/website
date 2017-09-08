import { createSelector } from 'reselect';
import { contains } from 'leaflet-lassoselect/utils';

import { getCountryCentroid } from '../../utils/country';

import {
  getGenomeList,
  getGenomes,
  getActiveGenomeIds,
  getHighlightedIds,
  getColourGetter,
} from '../selectors';
import { getLassoPath, getViewByCountry } from '../../map/selectors';

export const getGenomeIdsInPath = createSelector(
  getGenomeList,
  getLassoPath,
  (genomes, path) =>
    genomes.reduce((ids, { uuid, position = {} }) => {
      if (!position.latitude || !position.longitude) return ids;
      if (contains(path, { lat: position.latitude, lng: position.longitude })) {
        return ids.concat(uuid);
      }
      return ids;
    }, [])
);

const defaultPositionExtractor = ({ position = {} }) => {
  const { latitude, longitude } = position;
  if (latitude && longitude) {
    return [ latitude, longitude ];
  }
  return null;
};

const countryPositionExtractor = ({ country }) => {
  if (country) {
    return getCountryCentroid(country);
  }
  return null;
};

export const getPositionExtractor = createSelector(
  getViewByCountry,
  (viewByCountry) =>
    (viewByCountry ? countryPositionExtractor : defaultPositionExtractor)
);


export const getMarkers = createSelector(
  getPositionExtractor,
  getGenomes,
  getActiveGenomeIds,
  getHighlightedIds,
  getColourGetter,
  (positionExtractor, genomes, visibleIds = [], filteredIds, colourGetter) => {
    if (!visibleIds || visibleIds.length === 0) return [];

    const markers = new Map();

    for (const genomeId of visibleIds) {
      const genome = genomes[genomeId];
      const position = positionExtractor(genome);
      if (position) {
        const colour = colourGetter(genome);
        const key = position.join('_');
        const marker = markers.get(key) ||
          { position, id: [], slices: new Map(), highlighted: false };
        marker.id.push(genomeId);
        marker.title = marker.id.length;
        marker.slices.set(colour, (marker.slices.get(colour) || 0) + 1);
        marker.highlighted = marker.highlighted || filteredIds.has(genomeId);
        markers.set(key, marker);
      }
    }

    return Array.from(markers.values());
  }
);

export const getMarkerIds = getActiveGenomeIds;
