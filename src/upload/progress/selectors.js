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

export const getUploadedGenomeList = createSelector(
  getUploadedGenomes,
  genomes => Object.keys(genomes).map(id => genomes[id])
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
    inctyper: { active: false, label: 'IncTyper', total: 0, errors: 0 },
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
  getUploadedGenomeList,
  (sessionHasReads, genomes) => {
    const summary = {};
    let pending = 0;
    let errored = 0;
    for (const genome of genomes) {
      const { organismId, analysis } = genome;
      if (!('speciator' in analysis) || analysis.speciator === null) {
        pending++;
      } else if (analysis.speciator === false) {
        errored++;
      } else {
        summary[organismId] = (summary[organismId] || []).concat(genome);
      }
    }
    const getColour = getColourGenerator();
    const result = [];
    for (const organismId of Object.keys(summary)) {
      const organismGenomes = summary[organismId];
      const label = getOrganismName(
        organismId,
        organismGenomes[0].organismName
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

const getAssemblyChartData = createSelector(
  state => state.upload.assembly,
  () => {
    const time = new Date();
    const assembly = {
      label: 'Assembly progress',
      data: [ 1, 2, 2, 6 ],
      backgroundColor: [
        DEFAULT.DANGER_COLOUR,
        '#3c7383',
        'blue',
        'rgba(0, 0, 0, 0.14)',
      ],
      labels: [ 'Failed', 'Assembled', 'Assembling', 'Pending' ],
      parents: [],
      total: 10,
    };
    return assembly;
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
      const { sequenceTypes = [] } = mlst;
      for (const st of sequenceTypes) {
        sts.data.push(st.total);
        sts.backgroundColor.push(st.colour || getLightColour(colour));
        sts.labels.push(st.label);
        sts.parents.push(organismIndex);
        sts.total = total;
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

    if (assembly.data.length) {
      datasets.push(assembly);
    }
    if (organisms.data.length) {
      datasets.push(organisms);
    }
    if (sts.data.length) {
      datasets.push(sts);
    }

    return {
      datasets,
    };
  }
);

export const getOverallProgress = createSelector(
  getUploadedGenomes,
  genomes => {
    const assembly = { pending: 0, done: 0, total: 0 };
    const speciation = { pending: 0, done: 0, total: 0 };
    const analyses = { pending: 0, done: 0, total: 0 };
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
        }
        analyses.total++;
        if (isPending) analyses.pending++;
      }
    }

    assembly.done = assembly.total - assembly.pending;
    speciation.done = speciation.total - speciation.pending;
    analyses.done = analyses.total - analyses.pending;

    return {
      assembly,
      speciation,
      analyses,
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

const colours = {
  RUNNING: '#673c90',
  COMPLETED: '#48996F',
  FAILURE: '#d11b1b',
};

const stages = [
  'determine_min_read_length',
  'count_number_of_bases',
  'qc_pre_trimming',
  'trimming',
  'qc_post_trimming',
  'genome_size_estimation',
  'read_correction',
  // 'fastqc_multiqc',
  'merge_reads',
  'spades_assembly',
  'filter_scaffolds',
  'quast',
  // 'quast_summary',
];

export const getAssemblyStatus = createSelector(
  state => getProgress(state).assembly,
  getBatchSize,
  (rawStatus, total) => {
    const memo = [];
    if (typeof rawStatus !== 'object') {
      return memo;
    }
    for (const stage of stages) {
      const counts = rawStatus[stage] || {};
      let progress = 0;
      const statusList = [];
      for (const [ status, count ] of Object.entries(counts)) {
        const percentage = (count / total) * 100;
        statusList.push({
          name: status.toLowerCase(),
          colour: colours[status],
          count,
          percentage,
        });
        if (status !== 'RUNNING') {
          progress += percentage;
        }
      }
      memo.push({
        label: stage.replace(/_/g, ' '),
        progress,
        statuses: statusList,
        length: stage === 'spades_assembly' ? 'long' : null,
      });
    }
    return memo;
  }
);

export const getAssemblyProgress = createSelector(
  getAssemblyStatus,
  status => {
    let completed = 0;
    for (const { progress } of status) {
      if (progress === 100) completed++;
    }
    return (completed / status.length) * 100;
  }
);
