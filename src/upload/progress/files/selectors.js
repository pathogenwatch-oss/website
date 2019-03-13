import { createSelector } from 'reselect';

import { isInvalidUpload, isFailedUpload } from './utils/validation';
import { statuses, types } from './constants';

import { getProgress } from '../selectors';

const getUploadQueue = createSelector(
  getProgress,
  uploads => uploads.queue
);

const getProcessing = createSelector(
  getProgress,
  uploads => uploads.processing
);

export const getUploadedAt = state => getProgress(state).uploadedAt;
export const getUploadedGenomes = state => getProgress(state).entities;
export const getGenome = (state, id) => getUploadedGenomes(state)[id];

export const getUploadedGenomeList = createSelector(
  getUploadedGenomes,
  genomes => Object.keys(genomes).map(id => genomes[id])
);

export const getBatchSize = createSelector(
  getUploadedGenomeList,
  list => list.length
);

export const getGenomesInProgress = createSelector(
  getProcessing,
  getUploadedGenomes,
  (processing, genomes) => Array.from(processing).map(id => genomes[id])
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

export const getFailedUploads = createSelector(
  getUploadedGenomeList,
  genomes => genomes.filter(genome => isFailedUpload(genome))
);

export const getTotalFailures = createSelector(
  getFailedUploads,
  failedUploads => failedUploads.length
);

export const getInvalidUploads = createSelector(
  getUploadedGenomeList,
  genomes => genomes.filter(genome => isInvalidUpload(genome))
);

export const getTotalInvalid = createSelector(
  getInvalidUploads,
  invalidUploads => invalidUploads.length
);

export const getErroredUploads = createSelector(
  getUploadedGenomeList,
  genomes => genomes.filter(genome => genome.status === statuses.ERROR)
);

export const getTotalErrors = createSelector(
  getErroredUploads,
  erroredUploads => erroredUploads.length
);

export const isRetryable = createSelector(
  isUploading,
  getFailedUploads,
  (uploading, failures) => !uploading && !!failures.length
);

export const getFileSummary = createSelector(
  getUploadedGenomeList,
  files => {
    const summary = {};
    for (const file of files) {
      summary[file.status] = (summary[file.status] || 0) + 1;
    }
    return {
      total: files.length,
      completed: summary[statuses.SUCCESS] || 0,
      errored: summary[statuses.ERROR] || 0,
      pending: summary[statuses.PENDING] || 0,
      uploading: summary[statuses.UPLOADING] || 0,
      compressing: summary[statuses.COMPRESSING] || 0,
    };
  }
);

export const hasReads = createSelector(
  getUploadedGenomeList,
  genomes => {
    for (const genome of genomes) {
      if (genome.type === types.READS) return true;
    }
    return false;
  }
);

export const getNumSuccessfulUploads = createSelector(
  getFileSummary,
  ({ completed }) => completed
);
