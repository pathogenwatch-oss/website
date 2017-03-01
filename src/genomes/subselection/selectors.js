import { createSelector } from 'reselect';

export const getSubelection = ({ genomes }) => genomes.subselection;

export const getSelectedGenomes = createSelector(
  getSubelection,
  subselection => Object.keys(subselection).map(key => subselection[key])
);
