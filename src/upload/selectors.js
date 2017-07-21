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
  return Object.keys(summary).map(st => ({ st, total: summary[st] }));
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
        organismName: organismAnalyses[0].specieator.organismName,
        total: organismAnalyses.length,
        sequenceTypes: getSequenceTypeSummary(organismAnalyses),
      });
    }
    return result;
  }
);
