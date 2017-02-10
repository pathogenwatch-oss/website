import { createSelector } from 'reselect';

import { getGenomes } from '../genomes/selectors';

export const getBinnedGenomes = createSelector(
  getGenomes,
  genomes =>
    Object.keys(genomes).reduce((memo, key) => {
      const genome = genomes[key];
      if (genome.owner === 'me' && genome.binned) memo.push(genome);
      return memo;
    }, [])
);
