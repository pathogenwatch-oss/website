import { createSelector } from 'reselect';

import { isFailedUpload } from '../utils/validation';
import { statuses } from '../constants';

import { getOrganismName } from '../../organisms';

export const getProgress = ({ upload }) => upload.progress;

const getUploadQueue = createSelector(
  getProgress,
  uploads => uploads.queue,
);

const getProcessing = createSelector(
  getProgress,
  uploads => uploads.processing,
);

export const getBatch = state => getProgress(state).batch;
export const getBatchSize = state => getBatch(state).size;
export const getUploadedGenomes = state => getProgress(state).entities;
export const getUploadedAt = state => getProgress(state).uploadedAt;
export const getGenome = (state, id) => getUploadedGenomes(state)[id];
export const getAnalyses = state => getProgress(state).analyses;
export const getSelectedOrganism = state => getProgress(state).selectedOrganism;

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

export const getSummary = createSelector(
  getUploadedGenomeList,
  files => {
    const summary = {};
    for (const file of files) {
      summary[file.status] = (summary[file.status] || 0) + 1;
    }
    return {
      total: files.length,
      completed: summary[statuses.SUCCESS] || 0,
      errored: summary[statuses.ERROR] || 0,
      pending: summary[statuses.PENDING] || 0,
      uploading: summary[statuses.UPLOADING] || 0,
      compressing: summary[statuses.COMPRESSING] || 0,
    };
  }
);

function getSequenceTypeSummary(analyses) {
  const summary = {};
  for (const analysis of analyses) {
    if (analysis.mlst) {
      const { st } = analysis.mlst;
      summary[st] = (summary[st] || 0) + 1;
    }
  }
  return Object.keys(summary).map(st => ({ label: `ST ${st}`, total: summary[st] }));
}

export const getAnalysisSummary = createSelector(
  getUploadedGenomeList,
  getAnalyses,
  (files, analyses) => {
    const summary = {};
    let pending = 0;
    for (const file of files) {
      const analysis = {
        ...(file.analysis || {}),
        ...(analyses[file.genomeId] || {}),
      };
      if (!analysis.specieator) {
        pending++;
      } else {
        summary[analysis.specieator.organismId] =
          (summary[analysis.specieator.organismId] || []).concat(analysis);
      }
    }
    const result = [];
    for (const organismId of Object.keys(summary)) {
      const organismAnalyses = summary[organismId];
      result.push({
        organismId,
        label: getOrganismName(organismId, organismAnalyses[0].specieator.organismName),
        total: organismAnalyses.length,
        sequenceTypes: getSequenceTypeSummary(organismAnalyses),
      });
    }
    if (pending) result.push({ label: 'Pending', total: pending });
    return result;
  }
);

export const isSpecieationComplete = createSelector(
  getAnalysisSummary,
  summary => summary.length && summary[summary.length - 1].label !== 'Pending',
);
