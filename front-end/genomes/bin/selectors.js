import { createSelector } from 'reselect';

import { getSelectedGenomeList } from '../selection/selectors';

export const getSelectedGenomes = createSelector(
  getSelectedGenomeList,
  genomes => genomes.filter(_ => _.binned)
);
