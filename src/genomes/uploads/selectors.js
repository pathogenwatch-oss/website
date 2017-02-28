import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { isFailedUpload } from '../utils/validation';
import { statuses } from '../uploads/constants';

export const getUploads = ({ genomes }) => genomes.uploads;

export const getUploadQueue = createSelector(
  getUploads,
  uploads => uploads.queue,
);

export const getUploading = createSelector(
  getUploads,
  uploads => uploads.uploading,
);

export const getBatchSize = state => getUploads(state).batch.size;

export const getUploadedGenomes = state => getUploads(state).entities;

export const getUploadedAt = state => getUploads(state).uploadedAt;

export const getGenome = (state, id) => getUploadedGenomes(state)[id];

export const getUploadedGenomeList =
  createSelector(
    getUploadedGenomes,
    genomes => sortBy(genomes, [ 'status', 'name' ])
  );

export const getNumRemainingUploads = createSelector(
  getUploadQueue,
  getUploading,
  (queue, uploading) => queue.length + uploading.size,
);

export const isUploading = createSelector(
  getUploading,
  uploading => uploading.size > 0,
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
