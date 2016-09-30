import { createSelector } from 'reselect';

import { getVisibleFastas } from '../selectors';

export const getBounds = ({ hub: { map: { bounds } } }) => bounds;

export const getLassoPath = ({ hub: { filter: { area } } }) => area;

export const getMarkers = createSelector(
  getVisibleFastas,
  fastas => fastas.reduce((markers, { id, name, metadata = {} }) => {
    if (metadata.latitude && metadata.longitude) {
      markers.push({
        id,
        position: [ metadata.latitude, metadata.longitude ],
        label: name,
      });
    }
    return markers;
  }, [])
);
