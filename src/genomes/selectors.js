import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { isFailedUpload } from './utils/validation';

export const getGenomes = ({ genomes }) => genomes.entities;

export const getGenomesAsList = createSelector(
  getGenomes,
  genomes => Object.keys(genomes).map(key => genomes[key])
);

export const getGenomeKeys = createSelector(
  getGenomes,
  genomes => Object.keys(genomes)
);

export const getGenome = (state, name) => getGenomes(state)[name];

export const getTotalGenomes = (state) => getGenomesAsList(state).length;

export const getOrderedGenomes =
  createSelector(
    getGenomes,
    genomes => sortBy(genomes, [
      ({ speciesKey, uploadAttempted, error }) => {
        if (uploadAttempted && !speciesKey) return 0;
        if (error) return 1;
        return 2;
      },
      'name',
    ])
  );

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
  getOrderedGenomes,
  genomes => genomes.filter(genome => isFailedUpload(genome))
);
