import { createSelector } from 'reselect';

export const getGenomeState = ({ genomes }) => genomes;

export const getGenomes = state => getGenomeState(state).entities;

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

export const isWaiting = state => getGenomeState(state).waiting;

export const getStatus = state => getGenomeState(state).status;

export const getGridItems = getGenomeList;

export const isAsideEnabled = () => true;

export const getListIndices = state => getGenomeState(state).indices;
