import { createSelector } from 'reselect';

import { getFilter, getVisibleFastas } from '../../hub-filter/selectors';
import * as map from '../../map/selectors';

import { UPLOAD as stateKey } from '../../app/stateKeys/map';

export const getBounds = state => map.getBounds(state, { stateKey });

export const getLassoPath = createSelector(
  getFilter,
  ({ area }) => area
);

export const getMarkers = createSelector(
  getVisibleFastas,
  fastas => fastas.reduce((markers, { name, metadata = {} }) => {
    if (metadata.latitude && metadata.longitude) {
      markers.push({
        position: [ metadata.latitude, metadata.longitude ],
        title: name,
        id: name,
      });
    }
    return markers;
  }, [])
);
