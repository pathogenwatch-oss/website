import { createSelector } from 'reselect';

import { getAnalysisList } from './analysis/selectors';
import { getAssemblySummary, getSessionLoaded } from './assembly/selectors';
import { getUploadedGenomes, getBatchSize, hasReads } from './genomes/selectors';
import {
  getProcessing,
  getUploadedFiles,
  getUploadStatuses,
  isUploadPending,
} from './files/selectors';
import { getFileIds } from './recovery/selectors';

export const getProgress = ({ upload }) => upload.progress;
export const getProgressView = state => getProgress(state)._.view;
export const getUploadedAt = state => getProgress(state)._.uploadedAt;

export const getGenome = createSelector(
  (state, id) => getUploadedGenomes(state)[id],
  (state, id) => getUploadedFiles(state)[id],
  (state, id) => getFileIds(state)[id],
  (state, id) => getUploadStatuses(state)[id],
  (genome, files, recovery, status) => ({
    ...genome,
    files: Object.values(files),
    recovery,
    status,
  })
);

export const getUploadsInProgress = createSelector(
  getProcessing,
  getUploadedGenomes,
  getUploadedFiles,
  getUploadStatuses,
  (processing, genomes, files, statuses) =>
    Array.from(processing).map(id => ({
      ...genomes[id],
      files: Object.values(files[id]),
      status: statuses[id],
    }))
);

export const getOverallProgress = createSelector(
  getAssemblySummary,
  getAnalysisList,
  (assemblyCount, analysis) => {
    const speciationCount = { pending: 0, done: 0, total: 0 };
    const analysisCount = { pending: 0, done: 0, total: 0 };
    let errors = 0;

    for (const analyses of Object.values(analysis)) {
      for (const task of Object.keys(analyses)) {
        const isPending = analyses[task] === null;
        const isError = analyses[task] === false;

        if (isError) errors++;

        if (task === 'speciator') {
          speciationCount.total++;
          if (isPending) speciationCount.pending++;
        }
        analysisCount.total++;
        if (isPending) analysisCount.pending++;
      }
    }

    speciationCount.done = speciationCount.total - speciationCount.pending;
    analysisCount.done = analysisCount.total - analysisCount.pending;

    return {
      assembly: assemblyCount,
      speciation: speciationCount,
      analyses: analysisCount,
      errors,
    };
  }
);

export const isSpecieationComplete = createSelector(
  getBatchSize,
  getOverallProgress,
  (totalGenomes, { speciation }) =>
    speciation.total > 0 && speciation.done === totalGenomes
);

export const isAnalysisComplete = createSelector(
  getOverallProgress,
  ({ analyses }) => analyses.total > 0 && analyses.done === analyses.total
);

export const hasErrors = createSelector(
  getOverallProgress,
  ({ errors }) => errors > 0
);

export const isLoading = createSelector(
  getBatchSize,
  isUploadPending,
  hasReads,
  getSessionLoaded,
  (size, uploadsPending, sessionHasReads, loaded) => {
    if (!(size > 0)) return true;
    if (uploadsPending) return false;
    if (sessionHasReads) return !loaded;
    return false;
  }
);
