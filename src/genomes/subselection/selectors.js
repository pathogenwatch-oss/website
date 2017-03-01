import { createSelector } from 'reselect';

export const getSelectedGenomes = ({ genomes }) => genomes.subselection;

export const getSelectedGenomeList = createSelector(
  getSelectedGenomes,
  subselection => Object.keys(subselection).map(key => subselection[key])
);
