import { createSelector } from 'reselect';

import { getVisibleTableName, isAMRTable } from '../table/selectors';
import { isTimelineVisible, hasTimeline } from '../timeline/selectors';

export const getVisibleSouthView = createSelector(
  hasTimeline,
  isTimelineVisible,
  getVisibleTableName,
  (_hasTimeline, timeline, table) => {
    if (_hasTimeline) {
      if (timeline === null || timeline === true) return 'timeline';
    }
    return table;
  }
);

export const isAMRTableVisible = createSelector(
  getVisibleSouthView,
  isAMRTable,
  (view, isAMR) => view !== 'timeline' && isAMR
);
