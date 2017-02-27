import { createSelector } from 'reselect';

import { getUploadedGenomeList } from '../uploads/selectors';
import { getGenomes, getGenomeList } from '../selectors';

export const getGridItems = createSelector(
  getGenomes,
  getGenomeList,
  getUploadedGenomeList,
  (genomes, genomeList, uploadedGenomes) =>
    uploadedGenomes.filter(({ id }) => !(id in genomes)).concat(genomeList)
);
