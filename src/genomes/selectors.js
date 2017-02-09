import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as prefilter } from '../prefilter';

import { stateKey, prefilters } from './filter';
import { isFailedUpload } from './utils/validation';

export const getGenomes = ({ genomes }) => genomes.entities;

export const getPrefilter = state => prefilter.getPrefilter(state, { stateKey });

export const getGenomesAsList = createSelector(
  getGenomes,
  getPrefilter,
  (genomes, prefilterKey) =>
    Object.keys(genomes).reduce((memo, key) => {
      const genome = genomes[key];
      if (!prefilters[prefilterKey](genome)) return memo;
      memo.push(genome);
      return memo;
    }, [])
);

export const getGenomeKeys = createSelector(
  getGenomesAsList,
  genomes => genomes.map(_ => _.id)
);

export const getGenome = (state, id) => getGenomes(state)[id];

export const getTotalGenomes = (state) => getGenomesAsList(state).length;

export const getOrderedGenomes =
  createSelector(
    getGenomesAsList,
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
