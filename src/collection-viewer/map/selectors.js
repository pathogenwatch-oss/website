import { createSelector } from 'reselect';
import { contains } from 'leaflet-lassoselect/utils';

import { getCountryCentroid } from '../../utils/country';

import { getVisibleAssemblies } from '../selectors';
import { getLassoPath, getViewByCountry } from '../../map/selectors';

export const getAssemblyIdsInPath = createSelector(
  getVisibleAssemblies,
  getLassoPath,
  (assemblies, path) =>
    assemblies.reduce((ids, { id, metadata }) => {
      const { position = {} } = metadata;
      if (!position.latitude || !position.longitude) return ids;
      if (contains(path, { lat: position.latitude, lng: position.longitude })) {
        return ids.concat(id);
      }
      return ids;
    }, [])
);

const defaultPositionExtractor = ({ metadata }) => {
  const { latitude, longitude } = metadata.position;
  if (latitude && longitude) {
    return [ latitude, longitude ];
  }
  return null;
};

const countryPositionExtractor = ({ metadata }) => {
  const { country } = metadata.position;
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
