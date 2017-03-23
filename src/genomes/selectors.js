import { createSelector } from 'reselect';

import { isUploading, getUploadedGenomeList, getTotalErrors } from './uploads/selectors';
import { getPrefilter } from './filter/selectors';

export const getGenomeState = ({ genomes }) => genomes;

export const getGenomes = state => getGenomeState(state).entities;

export const getGenomeList = createSelector(
  getGenomes,
  genomes => Object.keys(genomes).map(key => genomes[key])
);

export const getGenomeKeys = createSelector(
  getGenomeList,
  genomes => genomes.map(_ => _.id)
);

export const getGenome = (state, id) => getGenomes(state)[id];

export const getTotalGenomes = (state) => getGenomeList(state).length;

export const isWaiting = state => getGenomeState(state).waiting;

export const getStatus = state => getGenomeState(state).status;

export const getGridItems = createSelector(
  getPrefilter,
  isUploading,
  getTotalErrors,
  getGenomeList,
  getUploadedGenomeList,
  (prefilter, uploading, totalErrors, genomeList, uploadedGenomes) => {
    if (prefilter === 'upload' && (uploading || totalErrors)) {
      return uploadedGenomes;
    }
    return genomeList;
  }
);
