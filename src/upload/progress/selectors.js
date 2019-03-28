import { createSelector } from 'reselect';

import { getColourGenerator, getLightColour } from '~/utils/colours';
import { getOrganismName } from '~/organisms';

import { DEFAULT } from '~/app/constants';

export const getProgress = ({ upload }) => upload.progress;
export const getProgressView = state => getProgress(state).view;

export const getUploadedAt = state => getProgress(state).uploadedAt;
export const getSelectedOrganism = state => getProgress(state).selectedOrganism;
export const getQueuePosition = state => getProgress(state).position;
export const getLastMessageReceived = state =>
  getProgress(state).lastMessageReceived;
export const getAssemblyProgress = state => getProgress(state).assemblyProgress;

export const getNumUploadedReads = state => getProgress(state).numberOfReads;
export const hasReads = state => getNumUploadedReads(state) > 0;

export const getAnalysisList = createSelector(
  state => getProgress(state).analysis,
  analysis => Object.keys(analysis).map(id => analysis[id])
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

const expectedDuration = 1000 * 60 * 20; // 20 minutes

const getAssemblyChartData = createSelector(
  hasReads,
  getAssemblyProgress,
  state => state.upload.progress.assemblyTick,
  getNumUploadedReads,
  (
    sessionHasReads,
    { pending = 0, runningSince = [], failed = 0, complete = 0 },
    time = Date.now(),
    total
  ) => {
    if (!sessionHasReads) return null;
    let sumProgress = 0;
    for (const timestamp of runningSince) {
      const elapsedTime = time - timestamp;
      if (elapsedTime > expectedDuration) sumProgress += 99;
      else sumProgress += (elapsedTime / expectedDuration) * 99;
    }
    const progress = runningSince.length
      ? sumProgress / runningSince.length
      : 0;
    const pendingPct = (pending / total) * 100;
    const completePct = (complete / total) * 100;
    const failedPct = (failed / total) * 100;
    const remaining = 100 - pendingPct - completePct - failedPct - progress;

    return {
      label: 'Assembly progress',
      data: [ pendingPct, failedPct, completePct, progress, remaining ],
      backgroundColor: [
        '#a386bd',
        DEFAULT.DANGER_COLOUR,
        '#3c7383',
        '#AC65A6',
        '#fefefe',
      ],
      labels: [ 'Queued', 'Failed', 'Assembled', 'Assembling', 'Remaining' ],
      tooltips: [
        `${pending} / ${total}`,
        `${failed} / ${total}`,
        `${complete} / ${total}, ${completePct.toFixed(1)}%`,
        `${runningSince.length} / ${total}, ${progress.toFixed(1)}%`,
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
      if (sequenceTypes.length && sum > 0) {
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
      datasets.push(assembly);
    }
    if (organisms.data.length) {
      datasets.push(organisms);
    }
    if (sts.data.length) {
      datasets.push(sts);
    }

    return datasets;
  }
);

export const isAssemblyInProgress = createSelector(
  getAssemblyProgress,
  ({ runningSince = [] }) => runningSince.length > 0
);

const getAssemblySummary = createSelector(
  getNumUploadedReads,
  getAssemblyProgress,
  (total, { complete }) => ({
    total,
    done: complete,
    pending: total - complete,
  })
);

export const isAssemblyComplete = createSelector(
  getAssemblySummary,
  ({ total, done }) => total === done
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
  getOverallProgress,
  ({ speciation }) => speciation.total > 0 && speciation.done === speciation.total
);

export const isAnalysisComplete = createSelector(
  getOverallProgress,
  ({ analyses }) => analyses.total > 0 && analyses.done === analyses.total
);

export const hasErrors = createSelector(
  getOverallProgress,
  ({ errors }) => errors > 0
);

