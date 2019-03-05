import { createSelector } from 'reselect';

import { isInvalidUpload, isFailedUpload } from '../utils/validation';
import { getColourGenerator, getLightColour } from '../../utils/colours';
import { statuses, types } from '../constants';

import { getOrganismName } from '../../organisms';
import { DEFAULT } from '../../app/constants';

export const getProgress = ({ upload }) => upload.progress;
export const getProgressView = state => getProgress(state).view;

const getUploadQueue = createSelector(
  getProgress,
  uploads => uploads.queue
);

const getProcessing = createSelector(
  getProgress,
  uploads => uploads.processing
);

export const getUploadedAt = state => getProgress(state).uploadedAt;
export const getUploadedGenomes = state => getProgress(state).genomes;
export const getGenome = (state, id) => getUploadedGenomes(state)[id];
export const getSelectedOrganism = state => getProgress(state).selectedOrganism;
export const getQueuePosition = state => getProgress(state).position;
export const getLastMessageReceived = state =>
  getProgress(state).lastMessageReceived;
export const getAssemblyProgress = state => getProgress(state).assembly;

export const getUploadedGenomeList = createSelector(
  getUploadedGenomes,
  genomes => Object.keys(genomes).map(id => genomes[id])
);

export const getAnalysisList = createSelector(
  state => getProgress(state).analysis,
  analysis => Object.keys(analysis).map(id => analysis[id])
);

export const getBatchSize = createSelector(
  getUploadedGenomeList,
  list => list.length
);

export const getGenomesInProgress = createSelector(
  getProcessing,
  getUploadedGenomes,
  (processing, genomes) => Array.from(processing).map(id => genomes[id])
);

export const getNumRemainingUploads = createSelector(
  getUploadQueue,
  getProcessing,
  (queue, processing) => queue.length + processing.size
);

export const isUploading = createSelector(
  getProcessing,
  processing => processing.size > 0
);

export const isUploadPending = createSelector(
  getNumRemainingUploads,
  remaining => remaining > 0
);

export const getNumCompletedUploads = createSelector(
  getBatchSize,
  getNumRemainingUploads,
  (batchSize, numRemaining) => batchSize - numRemaining
);

export const getFailedUploads = createSelector(
  getUploadedGenomeList,
  genomes => genomes.filter(genome => isFailedUpload(genome))
);

export const getTotalFailures = createSelector(
  getFailedUploads,
  failedUploads => failedUploads.length
);

export const getInvalidUploads = createSelector(
  getUploadedGenomeList,
  genomes => genomes.filter(genome => isInvalidUpload(genome))
);

export const getTotalInvalid = createSelector(
  getInvalidUploads,
  invalidUploads => invalidUploads.length
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
  isUploading,
  getFailedUploads,
  (uploading, failures) => !uploading && !!failures.length
);

export const getFileSummary = createSelector(
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

function getAnalysisBreakdown(analysis) {
  const breakdown = {
    paarsnp: { active: false, label: 'AMR', total: 0, errors: 0 },
    core: { active: false, label: 'Core', total: 0, errors: 0 },
    cgmlst: { active: false, label: 'cgMLST', total: 0, errors: 0 },
    genotyphi: { active: false, label: 'Genotyphi', total: 0, errors: 0 },
    metrics: { active: false, label: 'Metrics', total: 0, errors: 0 },
    mlst: { active: false, label: 'MLST', total: 0, errors: 0 },
    ngmast: { active: false, label: 'NG-MAST', total: 0, errors: 0 },
    kleborate: { active: false, label: 'Kleborate', total: 0, errors: 0 },
    inctyper: { active: false, label: 'IncTyper', total: 0, errors: 0 },
  };
  const sts = {};

  for (const analyses of analysis) {
    for (const key of Object.keys(analyses)) {
      if (key in breakdown) {
        breakdown[key].active = true;
        if (analyses[key] !== null) breakdown[key].total++;
        if (analyses[key] === false) breakdown[key].errors++;
      }
      if (key === 'mlst' && analyses.mlst) {
        const { st } = analyses.mlst;
        sts[st] = (sts[st] || 0) + 1;
      }
    }
  }

  breakdown.mlst.sequenceTypes = Object.keys(sts).map(st => ({
    label: `ST ${st}`,
    total: sts[st],
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

export const hasReads = createSelector(
  getUploadedGenomeList,
  genomes => {
    for (const genome of genomes) {
      if (genome.type === types.READS) return true;
    }
    return false;
  }
);

export const getAnalysisSummary = createSelector(
  hasReads,
  getAnalysisList,
  (sessionHasReads, analysis) => {
    const summary = {};
    let pending = 0;
    let errored = 0;
    for (const analyses of analysis) {
      if (!('speciator' in analyses) || analyses.speciator === null) {
        pending++;
      } else if (analyses.speciator === false) {
        errored++;
      } else {
        const { organismId } = analyses.speciator;
        summary[organismId] = (summary[organismId] || []).concat(analyses);
      }
    }
    const getColour = getColourGenerator();
    const result = [];
    for (const organismId of Object.keys(summary)) {
      const organismGenomes = summary[organismId];
      const label = getOrganismName(
        organismId,
        organismGenomes[0].speciator.organismName
      );
      const colour = getColour(label);
      result.push({
        key: organismId,
        label,
        colour,
        total: organismGenomes.length,
        ...getAnalysisBreakdown(organismGenomes),
      });
    }
    if (pending && (!sessionHasReads || result.length)) {
      result.push({
        key: 'pending',
        label: 'Pending',
        total: pending,
        colour: '#ccc',
      });
    }
    if (errored) {
      result.push({
        key: 'error',
        label: 'Error',
        total: errored,
        colour: DEFAULT.DANGER_COLOUR,
      });
    }
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

export const isAssemblyInProgress = createSelector(
  getAssemblyProgress,
  ({ runningSince = [] }) => runningSince.length > 0
);

const fifteenMinutes = 1000 * 60 * 15;

const getAssemblyChartData = createSelector(
  hasReads,
  getAssemblyProgress,
  state => state.upload.progress.assemblyTick,
  getBatchSize,
  (
    sessionHasReads,
    { runningSince = [], failed = 0, complete = 0 },
    time,
    total
  ) => {
    if (!sessionHasReads) return null;
    let sumProgress = 0;
    for (const timestamp of runningSince) {
      const duration = time - timestamp;
      sumProgress += (duration / fifteenMinutes) * 99;
    }
    const progress = runningSince.length
      ? sumProgress / runningSince.length
      : 0;
    const completePct = (complete / total) * 100;
    const failedPct = (failed / total) * 100;
    const pending = 100 - completePct - failedPct - progress;

    return {
      label: 'Assembly progress',
      data: [ failedPct, completePct, progress, pending ],
      backgroundColor: [
        DEFAULT.DANGER_COLOUR,
        '#3c7383',
        '#AC65A6',
        'rgba(0, 0, 0, 0.14)',
      ],
      labels: [ 'Failed', 'Assembled', 'Assembling', 'Pending' ],
      tooltips: [
        `${failed} / ${total}`,
        `${complete} / ${total}, ${completePct.toFixed(1)}%`,
        `${runningSince.length} / ${total}, ${progress}%`,
        `${total - runningSince.length - failed - complete} / ${total}`,
      ],
      parents: [],
      total: 100,
    };
  }
);

const getAnalysisChartData = createSelector(
  getAnalysisSummary,
  data => {
    const organisms = {
      label: 'Organism',
      data: [],
      backgroundColor: [],
      labels: [],
      organismIds: [],
      shortLabels: [],
      total: 0,
    };
    const sts = {
      label: 'Sequence Type',
      data: [],
      backgroundColor: [],
      labels: [],
      parents: [],
      total: 0,
    };

    let organismIndex = 0;
    for (const { label, colour, total, key, mlst = {} } of data) {
      organisms.data.push(total);

      organisms.backgroundColor.push(colour);
      organisms.labels.push(label);
      organisms.shortLabels.push(getSpeciesCode(label));
      organisms.organismIds.push(key);
      organisms.total += total;

      let sum = total;
      sts.total = total;
      const { sequenceTypes = [] } = mlst;
      for (const st of sequenceTypes) {
        sts.data.push(st.total);
        sts.backgroundColor.push(st.colour || getLightColour(colour));
        sts.labels.push(st.label);
        sts.parents.push(organismIndex);
        // sts.total = total;
        sum -= st.total;
      }
      if (sum > 0) {
        sts.data.push(sum);
        sts.backgroundColor.push('#fefefe');
        sts.labels.push('Unknown ST');
        sts.parents.push(organismIndex);
      }
      organismIndex++;
    }

    return {
      organisms,
      sts,
    };
  }
);

export const getChartData = createSelector(
  getAssemblyChartData,
  getAnalysisChartData,
  (assembly, { organisms, sts }) => {
    const datasets = [];

    if (assembly) {
      datasets.unshift(assembly);
    }
    if (organisms.data.length) {
      datasets.unshift(organisms);
    }
    if (sts.data.length) {
      datasets.unshift(sts);
    }

    return {
      datasets,
    };
  }
);

export const getOverallProgress = createSelector(
  getAnalysisList,
  analysis => {
    const assemblyCount = { pending: 0, done: 0, total: 0 };
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

    assemblyCount.done = assemblyCount.total - assemblyCount.pending;
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
  getOverallProgress,
  ({ analyses }) => analyses.total > 0 && analyses.done === analyses.total
);

export const hasErrors = createSelector(
  getOverallProgress,
  ({ errors }) => errors > 0
);
