import { createSelector } from 'reselect';

export const getGenomes = ({ genomes }) => genomes.entities;

export const getGenomeList = createSelector(
  getGenomes,
  genomes => Object.keys(genomes).map(key => genomes[key])
);

export const getGenomeKeys = createSelector(
  getGenomeList,
  genomes => genomes.map(_ => _.id)
);

export const getGenome = (state, id) => getGenomes(state)[id];

export const getTotalGenomes = (state) => getGenomeList(state).length;
