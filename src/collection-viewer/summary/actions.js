export const COLLECTION_SUMMARY_TOGGLE = 'COLLECTION_SUMMARY_TOGGLE';

export function toggleSummary(isExpanded) {
  return {
    type: COLLECTION_SUMMARY_TOGGLE,
    payload: isExpanded,
  };
}
