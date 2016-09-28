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

export const getAverageAssemblyLength = createSelector(
  getAssemblyMetrics,
  metrics => (
    metrics.reduce((memo, metric) =>
      memo + metric.totalNumberOfNucleotidesInDnaStrings, 0
    ) / (metrics.length || 1)
  ).toFixed(0)
);

export const getNumContigsRange = createSelector(
  getAssemblyMetrics,
  metrics => metrics.reduce((memo, metric) => ({
    min: Math.min(memo.min, metric.totalNumberOfContigs),
    max: Math.max(memo.max, metric.totalNumberOfContigs),
  }), { min: 1, max: 1 })
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
