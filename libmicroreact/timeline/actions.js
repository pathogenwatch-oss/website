export const LIBMR_TIMELINE_BOUNDS = 'LIBMR TIMELINE BOUNDS';

export const setTimelineBounds = bounds => ({
  type: LIBMR_TIMELINE_BOUNDS,
  payload: bounds || null,
});

export const LIBMR_TIMELINE_NODE_SIZE = 'LIBMR TIMELINE NODE SIZE';

export const setTimelineNodeSize = size => ({
  type: LIBMR_TIMELINE_NODE_SIZE,
  payload: size,
});

export const LIBMR_TIMELINE_SPEED = 'LIBMR TIMELINE SPEED';

export const setTimelineSpeed = speed => ({
  type: LIBMR_TIMELINE_SPEED,
  payload: speed,
});

export const LIBMR_TIMELINE_UNIT = 'LIBMR TIMELINE UNIT';

export const setTimelineUnit = unit => ({
  type: LIBMR_TIMELINE_UNIT,
  payload: unit,
});

export const LIBMR_TIMELINE_VIEWPORT = 'LIBMR TIMELINE VIEWPORT';

export const setTimelineViewport = viewport => ({
  type: LIBMR_TIMELINE_VIEWPORT,
  payload: viewport,
});
