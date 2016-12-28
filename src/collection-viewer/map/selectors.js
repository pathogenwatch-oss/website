import { createSelector } from 'reselect';
import { contains } from 'leaflet-lassoselect/utils';

import { getVisibleAssemblies } from '../selectors';
import { getLassoPath } from '../../map/selectors';

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
