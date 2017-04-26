import { createSelector } from 'reselect';

import { getDeployedOrganismIds } from '../../summary/selectors';
import { getGenomeList } from '../selectors';

import { isOverSelectionLimit, getSelectionLimit } from './utils';

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
  getSelectedGenomeList,
  getGenomeList,
  (selected, visible) => isOverSelectionLimit(selected.length + visible.length)
);

export const isSelectionLimitReached = createSelector(
  getSelectedGenomeIds,
  ids => ids.length === getSelectionLimit()
);
