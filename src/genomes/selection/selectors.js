import { createSelector } from 'reselect';

import { isSupported } from '../../organisms';

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
  genomes => genomes.filter(genome => isSupported(genome))
);
