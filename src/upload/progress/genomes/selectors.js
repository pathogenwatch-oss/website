import { createSelector } from 'reselect';

import { getUploadStatuses } from '../files/selectors';

import { types, statuses as fileStatuses } from '../files/constants';

export const getUploadedGenomes = state => state.upload.progress.genomes;

export const getUploadedGenomeList = createSelector(
  getUploadedGenomes,
  genomes => Object.keys(genomes).map(id => genomes[id])
);

export const getBatchSize = createSelector(
  getUploadedGenomeList,
  list => list.length
);

export const getFailedReadsUploads = createSelector(
  getUploadedGenomeList,
  getUploadStatuses,
  (genomes, statuses) => {
    let failed = 0;
    for (const genome of genomes) {
      if (
        genome.type === types.READS &&
        statuses[genome.id] === fileStatuses.ERROR
      ) {
        failed++;
      }
    }
    return failed;
  }
);

export const getNumUploadedTypes = createSelector(
  getUploadedGenomeList,
  genomes => {
    let reads = 0;
    let assemblies = 0;
    for (const genome of genomes) {
      if (genome.type === types.ASSEMBLY) {
        assemblies++;
      }
      if (genome.type === types.READS) {
        reads++;
      }
    }
    return {
      reads,
      assemblies,
    };
  }
);

export const getNumUploadedAssemblies = createSelector(
  getNumUploadedTypes,
  ({ assemblies }) => assemblies
);

export const getNumUploadedReads = createSelector(
  getNumUploadedTypes,
  ({ reads }) => reads
);
