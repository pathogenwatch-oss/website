import { createSelector } from 'reselect';

export const getCollections = ({ collections }) => collections.entities;

export const getCollectionList = createSelector(
  getCollections,
  (collections) => Object.keys(collections).map(key => collections[key])
);

export const getTotalCollections = state => getCollections(state).length;
