import { createSelector } from 'reselect';

import { getAssemblySummary } from './assembly/selectors';
import { getAnalysisList } from './analysis/selectors';

export const getProgress = ({ upload }) => upload.progress;
export const getProgressView = state => getProgress(state)._.view;
export const getUploadedAt = state => getProgress(state)._.uploadedAt;

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
  getOverallProgress,
  ({ speciation }) =>
    speciation.total > 0 && speciation.done === speciation.total
);

export const isAnalysisComplete = createSelector(
  getOverallProgress,
  ({ analyses }) => analyses.total > 0 && analyses.done === analyses.total
);

export const hasErrors = createSelector(
  getOverallProgress,
  ({ errors }) => errors > 0
);
