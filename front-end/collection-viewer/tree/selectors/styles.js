import { createSelector } from 'reselect';

import { getTrees, getSubtreeNames, hasTrees } from './entities';
import { getTitles, getTreeStateKey } from './index';
import { getGenomeStyles } from '../../selectors/styles';
import { getFilteredGenomeIds } from '../../filter/selectors';
import { getGenomes } from '../../genomes/selectors';

import { CGPS } from '~/app/constants';
import { POPULATION } from '~/app/stateKeys/tree';

const getStandardNodeStyles = createSelector(
  getGenomeStyles,
  state => (getFilteredGenomeIds ? getFilteredGenomeIds(state) : []),
  getGenomes,
  (genomeStyles, ids, genomes) => {
    const styles = {};
    for (const genomeId of Object.keys(genomeStyles)) {
      const isActive = ids.includes(genomeId);
      styles[genomeId] = {
        fillStyle: genomeStyles[genomeId].colour,
        fontStyle: (genomes[genomeId].__isCollection || genomes[genomeId].reference) ? 'bold' : null,
        label: genomeStyles[genomeId].label,
        labelFillStyle: genomes[genomeId].__isCollection ? CGPS.COLOURS.PURPLE : null,
        shape: isActive ? genomeStyles[genomeId].shape : 'none',
        strokeStyle: genomeStyles[genomeId].colour,
      };
    }
    return styles;
  }
);

const getPopulationLabel = ({ status, size, populationSize, progress }, name) => {
  if (status === 'PENDING') {
    return `${name}: Pending`;
  } else if (status === 'IN PROGRESS') {
    return `${name}: ${progress}%`;
  } else if (status === 'ERROR') {
    return `${name}: Error, awaiting retry`;
  } else if (status === 'FAILED') {
    return `${name}: Failed`;
  } else if (status === 'READY') {
    const totalCollection = size - populationSize;
    if (populationSize > 0) {
      return `${name} (${totalCollection}) [${populationSize}]`;
    } else if (totalCollection > 0) {
      return `${name} (${totalCollection})`;
    }
    return name;
  }
};

const getPopulationNodeStyles = createSelector(
  hasTrees,
  getTrees,
  getSubtreeNames,
  state => !getTrees(state)[POPULATION] ? [] : getTrees(state)[POPULATION].leafIds,
  getTitles,
  (hasTrees, trees, subtreeNames, treeIds, titles) => {
    if (!hasTrees) {
      return {};
    }
    const styles = {};
    for (const id of treeIds) {
      const name = titles[id];
      if (subtreeNames.includes(id)) {
        styles[id] = {
          fillStyle: CGPS.COLOURS.PURPLE_LIGHT,
          fontStyle: 'bold',
          label: getPopulationLabel(trees[id], name),
          labelFillStyle: CGPS.COLOURS.PURPLE,
        };
      } else {
        styles[id] = {
          fillStyle: CGPS.COLOURS.GREY,
          label: name,
        };
      }
    }
    return styles;
  }
);

export const getNodeStyles = state => {
  const name = getTreeStateKey(state);
  return name && name === POPULATION ?
    getPopulationNodeStyles(state) :
    getStandardNodeStyles(state);
};
