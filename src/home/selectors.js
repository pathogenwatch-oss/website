import { createSelector } from 'reselect';

export const getWgsaSpecies = ({ home }) => home.wgsaSpecies;

export const getOtherSpecies = ({ home }) => home.otherSpecies;
