import { createSelector } from 'reselect';

import { getVisibleFastas } from '../../hub-filter/selectors';

export const getBounds = ({ hub: { map: { bounds } } }) => bounds;

export const getLassoPath = ({ hub: { filter: { area } } }) => area;

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
