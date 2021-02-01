import { createSelector } from 'reselect';
import moment from 'moment';
import sortBy from 'lodash.sortby';

import { getViewer } from '../selectors';
import { getGenomeList } from '../genomes/selectors';
import { getActiveDataTable } from '../table/selectors';
import { getGenomeStyles } from '../selectors/styles';

import { getColumnLabel } from '../table/utils';
import * as utils from '@cgps/libmicroreact/timeline/utils';

export const getTimeline = state => getViewer(state).timeline.libmicroreact;
export const isTimelineVisible = state => getViewer(state).timeline.visible;

export const getTooltipGetter = createSelector(
  getActiveDataTable,
  getGenomeStyles,
  (table, styles) =>
    ({ id }) => `${getColumnLabel(table.activeColumn)}: ${styles[id].label}`
);

export const getPoints = createSelector(
  getGenomeList,
  genomes => {
    const points = [];
    for (const genome of genomes) {
      if (!genome.year) continue;
      points.push({
        date: new Date(`${genome.year}-${genome.month || 1}-${genome.day || 1}`),
        id: genome.id,
      });
    }
    return sortBy(points, 'date');
  }
);

export const hasTimeline = state => getPoints(state).length > 0;

export const getHistogram = createSelector(
  getPoints,
  state => getTimeline(state).unit,
  utils.createHistogram
);

export const getBounds = createSelector(
  state => getTimeline(state).bounds,
  getHistogram,
  (bounds, histogram) => bounds || utils.getInitialBounds(histogram)
);

export const getMomentBounds = createSelector(
  getBounds,
  getHistogram,
  utils.convertBoundsToMoments
);

export const getTimelineFilteredIds = createSelector(
  state => getTimeline(state).bounds,
  getPoints,
  getMomentBounds,
  (bounds, points, { min, max }) => {
    if (bounds === null) return null;
    const ids = [];
    for (const { date, id } of points) {
      if (min.isSameOrBefore(date) && max.isSameOrAfter(date)) {
        ids.push(id);
      }
    }
    return ids;
  }
);
