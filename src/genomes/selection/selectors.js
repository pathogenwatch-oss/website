import { createSelector } from 'reselect';

import { getGenomeList } from '../selectors';
import { getDeployedOrganismIds } from '../../summary/selectors';

import { isOverSelectionLimit } from './utils';

export const getSelection = ({ genomes }) => genomes.selection;
export const getSelectedGenomes = state => getSelection(state).genomes;
export const getSelectionDropdownView = state => getSelection(state).dropdown;

export const getSelectedGenomeIds = createSelector(
  getSelectedGenomes,
  selection => Object.keys(selection)
);

export const getSelectedGenomeList = createSelector(
  getSelectedGenomes,
  getSelectedGenomeIds,
  (selection, ids) => ids.map(key => selection[key])
);

export const getSelectionSize = state => getSelectedGenomeList(state).length;

export const getSelectedSupportedGenomesList = createSelector(
  getSelectedGenomeList,
  getDeployedOrganismIds,
  (genomes, deployedIds) =>
    genomes.filter(genome => deployedIds.has(genome.organismId))
);

export const isSelectionLimitReached = createSelector(
  getSelectedGenomeIds,
  ids => isOverSelectionLimit(ids.length)
);

export const areAllSelected = createSelector(
  getSelectedGenomes,
  getGenomeList,
  (selection, genomes) => genomes.every(({ id }) => (id in selection))
);
