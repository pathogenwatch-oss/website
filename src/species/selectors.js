import { createSelector } from 'reselect';

export const getWgsaSpecies = ({ species }) => species.wgsaSpecies;

export const getOtherSpecies = ({ species }) => species.otherSpecies;
