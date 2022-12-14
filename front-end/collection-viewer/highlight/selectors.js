import { createSelector } from 'reselect';

const getHighlightState = state => state.viewer.highlight;

export const getHighlightedIds = createSelector(
  getHighlightState,
  highlight => highlight.ids
);

export const getHighlightedIdArray = createSelector(
  getHighlightedIds,
  Array.from
);

export const hasHighlightedIds = createSelector(
  getHighlightedIds,
  ids => ids.size > 0
);
