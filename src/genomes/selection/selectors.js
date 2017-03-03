import { createSelector } from 'reselect';

export const getSelectedGenomes = ({ genomes }) => genomes.selection;

export const getSelectedGenomeList = createSelector(
  getSelectedGenomes,
  selection => Object.keys(selection).map(key => selection[key])
);
