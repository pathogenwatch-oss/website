import { createSelector } from 'reselect';

import { isFailedUpload } from '../utils/validation';
import { getColour, getLightColour } from '../utils/chart';
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

export const getUploadedFiles = state => getProgress(state).files;
export const getUploadedAt = state => getProgress(state).uploadedAt;
export const getGenome = (state, id) => getUploadedFiles(state)[id];
export const getAnalyses = state => getProgress(state).analyses;
export const getUploadedGenomes = state => getProgress(state).genomes;
export const getSelectedOrganism = state => getProgress(state).selectedOrganism;

export const getUploadedFileList = createSelector(
  getUploadedFiles,
  files => Object.keys(files).map(id => files[id])
);

export const getUploadedGenomeList = createSelector(
  getUploadedGenomes,
  genomes => Object.keys(genomes).map(id => genomes[id])
);

export const getBatchSize = createSelector(
  getUploadedFileList,
  list => list.length
);

export const getFilesInProgress = createSelector(
  getProcessing,
  getUploadedFiles,
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
  getUploadedFileList,
  genomes => genomes.filter(genome => isFailedUpload(genome))
);

export const getErroredUploads = createSelector(
  getUploadedFileList,
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
  getUploadedFileList,
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
  let mlstTotal = 0;
  for (const analysis of analyses) {
    if (analysis.mlst) {
      const { st } = analysis.mlst;
      summary[st] = (summary[st] || 0) + 1;
      mlstTotal++;
    }
  }
  return {
    mlstTotal,
    sequenceTypes: Object.keys(summary).map(st => ({ label: `ST ${st}`, total: summary[st] })),
  };
}

export const getAnalysisSummary = createSelector(
  getNumRemainingUploads,
  getUploadedGenomeList,
  getAnalyses,
  (remainingUploads, genomes, analyses) => {
    const summary = {};
    let pending = remainingUploads;
    for (const genome of genomes) {
      const analysis = {
        ...(genome.analysis || {}),
        ...(analyses[genome.id] || {}),
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
        key: organismId,
        label: getOrganismName(organismId, organismAnalyses[0].specieator.organismName),
        total: organismAnalyses.length,
        ...getSequenceTypeSummary(organismAnalyses),
      });
    }
    if (pending) result.push({ key: 'pending', label: 'Pending', total: pending });
    return result;
  }
);

export const getChartData = createSelector(
  getAnalysisSummary,
  data => {
    const organisms = { label: 'Organism', data: [], backgroundColor: [], labels: [], organismIds: [] };
    const stData = { label: 'Sequence Type', data: [], backgroundColor: [], labels: [], parents: [] };

    let organismIndex = 0;
    for (const { label, total, sequenceTypes = [], key } of data) {
      organisms.data.push(total);

      const colour = getColour(label);
      organisms.backgroundColor.push(colour);
      organisms.labels.push(label);
      organisms.organismIds.push(key);

      let sum = total;
      for (const st of sequenceTypes) {
        stData.data.push(st.total);
        stData.backgroundColor.push(getLightColour(colour));
        stData.labels.push(st.label);
        stData.parents.push(organismIndex);
        sum -= st.total;
      }
      if (sum > 0) {
        stData.data.push(sum);
        stData.backgroundColor.push('#fefefe');
        stData.labels.push('Unknown ST');
        stData.parents.push(organismIndex);
      }
      organismIndex++;
    }

    return {
      datasets: [
        stData,
        organisms,
      ],
    };
  }
);

export const isSpecieationComplete = createSelector(
  getAnalysisSummary,
  summary => summary.length && summary[summary.length - 1].label !== 'Pending',
);
