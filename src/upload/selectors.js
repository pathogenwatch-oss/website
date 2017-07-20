import { createSelector } from 'reselect';

import { isFailedUpload } from './utils/validation';
import { statuses } from './constants';

export const getUploads = ({ upload }) => upload;

const getUploadQueue = createSelector(
  getUploads,
  uploads => uploads.queue,
);

const getProcessing = createSelector(
  getUploads,
  uploads => uploads.processing,
);

export const getBatch = state => getUploads(state).batch;
export const getBatchSize = state => getBatch(state).size;
export const getUploadedGenomes = state => getUploads(state).entities;
export const getUploadedAt = state => getUploads(state).uploadedAt;
export const getGenome = (state, id) => getUploadedGenomes(state)[id];
export const getAnalyses = state => getUploads(state).analyses;

export const getUploadedGenomeList =
  createSelector(
    getUploadedGenomes,
    genomes => Object.keys(genomes).map(id => genomes[id])
  );

export const getFilesInProgress = createSelector(
  getProcessing,
  getUploadedGenomes,
  (processing, files) => Array.from(processing).map(id => files[id])
);

export const getNumRemainingUploads = createSelector(
  getUploadQueue,
  getProcessing,
  (queue, processing) => queue.length + processing.size,
);

export const isUploading = createSelector(
  getProcessing,
  processing => processing.size > 0,
);

export const getNumCompletedUploads = createSelector(
  getBatchSize,
  getNumRemainingUploads,
  (batchSize, numRemaining) => batchSize - numRemaining,
);

export const getFailedUploads = createSelector(
  getUploadedGenomeList,
  genomes => genomes.filter(genome => isFailedUpload(genome))
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
  getFailedUploads,
  failures => !!failures.length
);

export const getSettings = state => getUploads(state).settings;

export const getSettingValue =
  (state, setting) => getSettings(state)[setting];
