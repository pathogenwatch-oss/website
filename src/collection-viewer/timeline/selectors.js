import { createSelector } from 'reselect';
import moment from 'moment';
import sortBy from 'lodash.sortby';

import { getViewer } from '../selectors';
import { getGenomes, getGenomeList } from '../genomes/selectors';

import * as utils from '@cgps/libmicroreact/timeline/utils';

export const getTimeline = state => getViewer(state).timeline;

export const getTooltipGetter = createSelector(
  getGenomes,
  genomes => ({ id }) => genomes[id].name
);

export const getPoints = createSelector(
  getGenomeList,
  genomes => {
    const points = [];
    for (const genome of genomes) {
      if (!genome.year) continue;
      const m = moment();
      m.set('year', genome.year);
      m.set('month', genome.month || 1);
      m.set('date', genome.day || 1);
      points.push({
        date: m.toDate(),
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
