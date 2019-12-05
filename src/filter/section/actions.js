export const FILTER_SUMMARY_LIST = 'FILTER_SUMMARY_LIST';

export function filterSummaryList(stateKey, filterKey, text) {
  return {
    type: FILTER_SUMMARY_LIST,
    payload: {
      stateKey,
      filterKey,
      text,
    },
  };
}
