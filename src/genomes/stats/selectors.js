import { createSelector } from 'reselect';

import { getVisibleGenomes } from '../filter/selectors';

export const getSelectedMetric = ({ genomes }) => genomes.selectedMetric;

export const getGenomeMetrics = createSelector(
  getVisibleGenomes,
  genomes =>
    genomes.reduce((memo, { name, metrics }) => {
      if (!metrics) {
        return memo;
      }
      return [ ...memo, { name, ...metrics } ];
    }, [])
);

function average(list, property) {
  return (
    list.reduce(
      (memo, item) => memo + Number(property ? item[property] : item),
      0
    ) / (list.length || 1)
  );
}

export const getMetricAverage = createSelector(
  getGenomeMetrics,
  getSelectedMetric,
  (metrics, selectedMetric) => average(metrics, selectedMetric).toFixed(1)
);

export const getMetricStDev = createSelector(
  getGenomeMetrics,
  getSelectedMetric,
  getMetricAverage,
  (metrics, selectedMetric, avg) => {
    const squareDiffs = metrics.map(item => {
      const diff = item[selectedMetric] - avg;
      return diff * diff;
    });
    return Math.sqrt(average(squareDiffs)).toFixed(2);
  }
);

export const getMetricRange = createSelector(
  getGenomeMetrics,
  getSelectedMetric,
  (metrics, selectedMetric) => metrics.reduce(({ min, max }, _) => ({
    min: min ? Math.min(min, _[selectedMetric]) : _[selectedMetric],
    max: max ? Math.max(max, _[selectedMetric]) : _[selectedMetric],
  }), { min: 0, max: 0 })
);

export const getSelectedChartData = createSelector(
  getGenomeMetrics,
  getSelectedMetric,
  (metrics, selectedMetric) => metrics.map((_, i) => ({
    key: i,
    name: _.name,
    value: Number(_[selectedMetric]),
  }))
);
