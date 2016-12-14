export const statuses = {
  READY: 'READY',
  PROCESSING: 'PROCESSING',
  FETCHED: 'FETCHED',
  NOT_FOUND: 'NOT_FOUND',
  FATAL: 'FATAL',
  ABORTED: 'ABORTED',
};

export const readyStatuses = new Set([ statuses.READY, statuses.FETCHED ]);
