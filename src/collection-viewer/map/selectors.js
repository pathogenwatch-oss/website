import { createSelector } from 'reselect';
import { contains } from 'leaflet-lassoselect/utils';

import { getCountryCentroid } from '../../utils/country';

import { getGenomeList } from '../selectors';
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
