import { createSelector } from 'reselect';

import { getAssemblyChartData } from '../assembly/selectors';
import { hasReads } from '../files/selectors';

import { getColourGenerator, getLightColour } from '~/utils/colours';
import { getOrganismName } from '~/organisms';

import { DEFAULT } from '~/app/constants';

export const getAnalysis = ({ upload }) => upload.progress.analysis;

export const getSelectedOrganism = state => getAnalysis(state).selectedOrganism;
export const getQueuePosition = state => getAnalysis(state).position;
export const getLastMessageReceived = state =>
  getAnalysis(state).lastMessageReceived;

export const getAnalysisList = createSelector(
  getAnalysis,
  analysis => Object.keys(analysis.entities).map(id => analysis.entities[id])
);

function getAnalysisBreakdown(genomes) {
  const breakdown = {};
  const sts = {};

  for (const { st, analysis } of genomes) {
    for (const key of Object.keys(analysis)) {
      if (!(key in breakdown)) {
        breakdown[key] = { total: 0, errors: 0 };
      }
      if (analysis[key] !== null) breakdown[key].total++;
      if (analysis[key] === false) breakdown[key].errors++;
      if (key === 'mlst' && analysis.mlst) {
        sts[st] = (sts[st] || 0) + 1;
      }
    }
  }

  if (breakdown.mlst) {
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
