import { createSelector } from 'reselect';

import { getGenomeState } from '../selectors';
import { getSelectedGenomeIds } from '../selection/selectors';

export const getSelectedMetric = state => getGenomeState(state).stats.metric;
export const getGenomeMetrics = state => getGenomeState(state).stats.entities;
export const getFilter = state => getGenomeState(state).stats.filter;

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

export const getMetricsBySelection = createSelector(
  getGenomeMetrics,
  getSelectedGenomeIds,
  (metrics, selectedIds) => metrics.reduce((memo, metric, i) => {
    metric.index = i;
    if (selectedIds.indexOf(metric.id) === -1) {
      memo.unselected.push(metric);
    } else {
      memo.selected.push(metric);
    }
    return memo;
  }, { selected: [], unselected: [] })
);

function formatMetrics(metrics, selectedMetric) {
  return metrics.map((value) => ({
    x: value.index,
    y: Number(value[selectedMetric]),
    label: value.name,
    id: value.id,
  }));
}

export const getChartData = createSelector(
  getMetricsBySelection,
  getSelectedMetric,
  (metrics, selectedMetric) => [
    { label: `${selectedMetric} (selected)`,
      data: formatMetrics(metrics.selected, selectedMetric),
      backgroundColor: '#673c90',
      borderColor: '#673c90',
    },
    { label: `${selectedMetric} (unselected)`,
      data: formatMetrics(metrics.unselected, selectedMetric),
      backgroundColor: metrics.selected.length ? '#ddd' : '#a386bd',
      borderColor: metrics.selected.length ? '#ddd' : '#a386bd',
    },
  ]
);
