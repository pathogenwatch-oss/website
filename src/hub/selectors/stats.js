import { createSelector } from 'reselect';

import { getVisibleFastas } from '../selectors';

export const getSelectedMetric = ({ hub }) => hub.selectedMetric;

export const getAssemblyMetrics = createSelector(
  getVisibleFastas,
  fastas =>
    fastas.reduce((memo, { name, metrics }) => {
      if (!metrics) {
        return memo;
      }
      return [ ...memo, { name, ...metrics } ];
    }, [])
);

export const getMetricAverage = createSelector(
  getAssemblyMetrics,
  getSelectedMetric,
  (metrics, selectedMetric) => (
    metrics.reduce((memo, _) => memo + Number(_[selectedMetric]), 0) /
    (metrics.length || 1)
  ).toFixed(0)
);

export const getMetricRange = createSelector(
  getAssemblyMetrics,
  getSelectedMetric,
  (metrics, selectedMetric) => metrics.reduce(({ min, max }, _) => ({
    min: min ? Math.min(min, _[selectedMetric]) : _[selectedMetric],
    max: max ? Math.max(max, _[selectedMetric]) : _[selectedMetric],
  }), { min: 0, max: 0 })
);

export const getSelectedChartData = createSelector(
  getAssemblyMetrics,
  getSelectedMetric,
  (metrics, selectedMetric) => metrics.map((_, i) => ({
    key: i,
    name: _.name,
    value: Number(_[selectedMetric]),
  }))
);
