import { createSelector } from 'reselect';
import { contains } from 'leaflet-lassoselect/utils';

import { getCountryCentroid } from '../../utils/country';

import { getVisibleGenomes } from '../selectors';
import { getLassoPath, getViewByCountry } from '../../map/selectors';

export const getGenomeIdsInPath = createSelector(
  getVisibleGenomes,
  getLassoPath,
  (genomes, path) =>
    genomes.reduce((ids, { id, position = {} }) => {
      if (!position.latitude || !position.longitude) return ids;
      if (contains(path, { lat: position.latitude, lng: position.longitude })) {
        return ids.concat(id);
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
