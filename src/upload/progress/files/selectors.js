import { createSelector } from 'reselect';

import { InvalidGenomeError } from './utils/validation';

import { statuses } from './constants';

export const getFiles = state => state.upload.progress.files;

export const getUploadQueue = state => getFiles(state).queue.pending;
export const getProcessing = state => getFiles(state).queue.processing;

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

export const getUploadStatuses = state => getFiles(state).status;

export const getStatusSummary = createSelector(
  getUploadStatuses,
  (uploadStatuses) => {
    const summary = {};
    const _statuses = Object.values(uploadStatuses);
    for (const status of _statuses) {
      summary[status] = (summary[status] || 0) + 1;
    }
    return {
      total: _statuses.length,
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

export const getNumFailedUploads = createSelector(
  getStatusSummary,
  ({ errored }) => errored
);

export const getValidationErrors = createSelector(
  state => getFiles(state).entities,
  state => getFiles(state).errors,
  (files, fileErrors) => {
    const errors = [];
    for (const id of Object.keys(fileErrors)) {
      if (fileErrors[id] instanceof InvalidGenomeError) {
        errors.push({
          filename: Object.keys(files[id])[0],
          error: fileErrors[id],
        });
      }
    }
    return errors;
  }
);

export const getNumOtherErrors = createSelector(
  state => getFiles(state).errors,
  getValidationErrors,
  (errors, validationErrors) =>
    Object.keys(errors).length - validationErrors.length
);
