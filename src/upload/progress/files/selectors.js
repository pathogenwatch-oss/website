import { createSelector } from 'reselect';

import { statuses } from './constants';

export const getFiles = state => state.upload.progress.files;

export const getUploadQueue = state => getFiles(state)._.queue;
export const getProcessing = state => getFiles(state)._.processing;
export const getNumUploadedReads = state => getFiles(state)._.numberOfReads;
const getBatchSize = state => getFiles(state)._.batchSize;

export const hasReads = createSelector(
  getNumUploadedReads,
  count => count > 0
);

export const getUploadedFiles = state => getFiles(state).entities;

export const getUploadedFilesList = createSelector(
  getUploadedFiles,
  files => Object.values(files)
);

export const getNumRemainingUploads = createSelector(
  getUploadQueue,
  getProcessing,
  (queue, processing) => queue.length + processing.size
);

export const isUploading = createSelector(
  getProcessing,
  processing => processing.size > 0
);

export const isUploadPending = createSelector(
  getNumRemainingUploads,
  remaining => remaining > 0
);

export const getNumCompletedUploads = createSelector(
  getBatchSize,
  getNumRemainingUploads,
  (batchSize, numRemaining) => batchSize - numRemaining
);

export const getUploadStatuses = state => getFiles(state).status;

export const getStatusSummary = createSelector(
  getBatchSize,
  getUploadStatuses,
  (total, uploadStatuses) => {
    const summary = {};
    for (const status of Object.values(uploadStatuses)) {
      summary[status] = (summary[status] || 0) + 1;
    }
    return {
      total,
      completed: summary[statuses.SUCCESS] || 0,
      errored: summary[statuses.ERROR] || 0,
      pending: summary[statuses.PENDING] || 0,
    };
  }
);

export const getNumSuccessfulUploads = createSelector(
  getStatusSummary,
  ({ completed }) => completed
);
