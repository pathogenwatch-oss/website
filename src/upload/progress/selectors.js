import { createSelector } from 'reselect';

import { isInvalidUpload, isFailedUpload } from '../utils/validation';
import { getColourGenerator, getLightColour } from '../../utils/colours';
import { statuses } from '../constants';

import { getOrganismName } from '../../organisms';
import { DEFAULT } from '../../app/constants';

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
export const getUploadedGenomes = state => getProgress(state).genomes;
export const getSelectedOrganism = state => getProgress(state).selectedOrganism;
export const getQueuePosition = state => getProgress(state).position;
export const getLastMessageReceived = state => getProgress(state).lastMessageReceived;

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

export const isUploadPending = createSelector(
  getNumRemainingUploads,
  remaining => remaining > 0
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

export const getTotalFailures = createSelector(
  getFailedUploads,
  failedUploads => failedUploads.length
);

export const getInvalidUploads = createSelector(
  getUploadedFileList,
  genomes => genomes.filter(genome => isInvalidUpload(genome))
);

export const getTotalInvalid = createSelector(
  getInvalidUploads,
  invalidUploads => invalidUploads.length
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
  isUploading,
  getFailedUploads,
  (uploading, failures) => !uploading && !!failures.length
);

export const getFileSummary = createSelector(
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

function getAnalysisBreakdown(genomes) {
  const breakdown = {
    paarsnp: { active: false, label: 'AMR', total: 0, errors: 0 },
    core: { active: false, label: 'Core', total: 0, errors: 0 },
    cgmlst: { active: false, label: 'cgMLST', total: 0, errors: 0 },
    genotyphi: { active: false, label: 'Genotyphi', total: 0, errors: 0 },
    metrics: { active: false, label: 'Metrics', total: 0, errors: 0 },
    mlst: { active: false, label: 'MLST', total: 0, errors: 0 },
    ngmast: { active: false, label: 'NG-MAST', total: 0, errors: 0 },
    kleborate: { active: false, label: 'Kleborate', total: 0, errors: 0 },
    inctyper: { active: false, label: 'IncTyper', total:0, errors:0 },
  };
  const sts = {};

  for (const { st, analysis } of genomes) {
    for (const key of Object.keys(analysis)) {
      if (key in breakdown) {
        breakdown[key].active = true;
        if (analysis[key] !== null) breakdown[key].total++;
        if (analysis[key] === false) breakdown[key].errors++;
      }
      if (key === 'mlst' && analysis.mlst) {
        sts[st] = (sts[st] || 0) + 1;
      }
    }
  }

  breakdown.mlst.sequenceTypes =
    Object.keys(sts).map(st => ({
      label: `ST ${st}`, total: sts[st],
    }));

  if (breakdown.mlst.errors) {
    breakdown.mlst.sequenceTypes.push({
      label: 'Error',
      total: breakdown.mlst.errors,
      colour: DEFAULT.DANGER_COLOUR,
    });
  }

  return breakdown;
}

export const getAnalysisSummary = createSelector(
  getNumRemainingUploads,
  getUploadedGenomeList,
  (remainingUploads, genomes) => {
    const summary = {};
    let pending = remainingUploads;
    let errored = 0;
    for (const genome of genomes) {
      const { organismId, analysis } = genome;
      if (!('speciator' in analysis) || analysis.speciator === null) {
        pending++;
      } else if (analysis.speciator === false) {
        errored++;
      } else {
        summary[organismId] =
          (summary[organismId] || []).concat(genome);
      }
    }
    const getColour = getColourGenerator();
    const result = [];
    for (const organismId of Object.keys(summary)) {
      const organismGenomes = summary[organismId];
      const label = getOrganismName(organismId, organismGenomes[0].organismName);
      const colour = getColour(label);
      result.push({
        key: organismId,
        label,
        colour,
        total: organismGenomes.length,
        ...getAnalysisBreakdown(organismGenomes),
      });
    }
    if (pending) result.push({ key: 'pending', label: 'Pending', total: pending, colour: '#ccc' });
    if (errored) result.push({ key: 'error', label: 'Error', total: errored, colour: DEFAULT.DANGER_COLOUR });
    return result;
  }
);

function getSpeciesCode(organismName) {
  const match = organismName.match(/^(.)\S* (..).*$/);
  if (match) {
    const [ , firstPart, secondPart ] = match;
    return `${firstPart}. ${secondPart}.`;
  }
  return organismName;
}

export const getChartData = createSelector(
  getAnalysisSummary,
  data => {
    const organisms = { label: 'Organism', data: [], backgroundColor: [], labels: [], organismIds: [], shortLabels: [], total: 0 };
    const stData = { label: 'Sequence Type', data: [], backgroundColor: [], labels: [], parents: [], total: 0 };

    let organismIndex = 0;
    for (const { label, colour, total, key, mlst = {} } of data) {
      organisms.data.push(total);

      organisms.backgroundColor.push(colour);
      organisms.labels.push(label);
      organisms.shortLabels.push(getSpeciesCode(label));
      organisms.organismIds.push(key);
      organisms.total += total;

      let sum = total;
      const { sequenceTypes = [] } = mlst;
      for (const st of sequenceTypes) {
        stData.data.push(st.total);
        stData.backgroundColor.push(st.colour || getLightColour(colour));
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

export const getOverallProgress = createSelector(
  getUploadedGenomes,
  (genomes) => {
    const speciation = { pending: 0, done: 0, total: 0 };
    const tasks = { pending: 0, done: 0, total: 0 };
    let errors = 0;

    for (const id of Object.keys(genomes)) {
      const { analysis } = genomes[id];
      for (const task of Object.keys(analysis)) {
        const isPending = analysis[task] === null;
        const isError = analysis[task] === false;

        if (isError) errors++;

        if (task === 'speciator') {
          speciation.total++;
          if (isPending) speciation.pending++;
          if (isError) tasks.total++;
        } else if (id in genomes && genomes[id].speciated) {
          tasks.total++;
          if (isPending) tasks.pending++;
        }
      }
    }

    speciation.done = speciation.total - speciation.pending;
    tasks.done = tasks.total - tasks.pending;

    return {
      speciation,
      tasks,
      errors,
    };
  }
);

export const isSpecieationComplete = createSelector(
  isUploadPending,
  getUploadedGenomeList,
  getOverallProgress,
  (uploadPending, genomes, { speciation }) => {
    if (uploadPending) return null;
    if (genomes.length === 0) return null;
    return speciation.done === genomes.length;
  }
);

export const isAnalysisComplete = createSelector(
  isSpecieationComplete,
  getOverallProgress,
  (speciationComplete, { tasks }) =>
    speciationComplete && tasks.total > 0 && tasks.done === tasks.total,
);

export const hasErrors = createSelector(
  getOverallProgress,
  ({ errors }) => errors > 0
);
