import { createSelector } from 'reselect';

import { getDeployedOrganismIds } from '../../summary/selectors';
import { getGenomeList } from '../selectors';

import { isOverSelectionLimit } from './utils';

export const getSelectedGenomes = ({ genomes }) => genomes.selection;

export const getSelectedGenomeIds = createSelector(
  getSelectedGenomes,
  selection => Object.keys(selection)
);

export const getSelectedGenomeList = createSelector(
  getSelectedGenomes,
  getSelectedGenomeIds,
  (selection, ids) => ids.map(key => selection[key])
);

export const getSelectedSupportedGenomesList = createSelector(
  getSelectedGenomeList,
  getDeployedOrganismIds,
  (genomes, deployedIds) =>
    genomes.filter(genome => deployedIds.has(genome.organismId))
);

export const isSelectAllDisabled = createSelector(
  getGenomeList,
  genomes => isOverSelectionLimit(genomes.length)
);
