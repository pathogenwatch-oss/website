export const SHOW_METRIC = 'SHOW_METRIC';

export function showMetric(metric) {
  return {
    type: SHOW_METRIC,
    payload: { metric },
  };
}
