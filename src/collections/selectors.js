import { createSelector } from 'reselect';

export const getCollections = ({ collections }) => collections.entities;

export const getStatus = ({ collections }) => collections.status;

export const getCollectionList = createSelector(
  getCollections,
  (collections) => Object.keys(collections).map(key => collections[key])
);

export const getTotalCollections = state => getCollections(state).length;

export const getSummary = ({ collections }) => collections.summary;

export const getTotal = state => getSummary(state).total;
