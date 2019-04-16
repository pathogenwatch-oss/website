import { createSelector } from 'reselect';

import { isInvalidUpload, isFailedUpload } from './utils/validation';
import { statuses } from './constants';

import { getProgress } from '../selectors';
import { getFileIds } from '../recovery/selectors';

export const getFiles = state => getProgress(state).files;

export const getUploadQueue = state => getFiles(state)._.queue;
export const getProcessing = state => getFiles(state)._.processing;
export const getNumUploadedReads = state => getFiles(state)._.numberOfReads;

export const hasReads = createSelector(
  getNumUploadedReads,
  count => count > 0
);

export const getUploadedFiles = state => getFiles(state).entities;
export const getUploadedGenomes = state => getFiles(state).genomes;

export const getGenome = createSelector(
  (state, id) => getUploadedFiles(state)[id],
  (state, id) => getUploadedGenomes(state)[id],
  (state, id) => getFileIds(state)[id],
  (files, genome, recovery) => ({ ...genome, files, recovery })
);

export const getUploadedGenomeList = createSelector(
  getUploadedGenomes,
  genomes => Object.keys(genomes).map(id => genomes[id])
);

export const getBatchSize = createSelector(
  getUploadedGenomeList,
  list => list.length
);

export const getUploadsInProgress = createSelector(
  getProcessing,
  getUploadedGenomes,
  getUploadedFiles,
  (processing, genomes, files) =>
    Array.from(processing).map(id => ({
      ...genomes[id],
      files: files[id],
    }))
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
  genomes => {
    const summary = {};
    for (const genome of genomes) {
      summary[genome.status] = (summary[genome.status] || 0) + 1;
    }
    return {
      total: genomes.length,
      completed: summary[statuses.SUCCESS] || 0,
      errored: summary[statuses.ERROR] || 0,
      pending: summary[statuses.PENDING] || 0,
      uploading: summary[statuses.UPLOADING] || 0,
      compressing: summary[statuses.COMPRESSING] || 0,
    };
  }
);

export const getNumSuccessfulUploads = createSelector(
  getFileSummary,
  ({ completed }) => completed
);
