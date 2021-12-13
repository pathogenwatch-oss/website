import { createSelector } from 'reselect';
import { getFormatted } from '~/organisms/OrganismName.react';

export const getCollections = ({ collections }) => collections.entities;

export const getStatus = ({ collections }) => collections.status;

export const getCollectionList = createSelector(
  getCollections,
  collections => Object.keys(collections).map(key => collections[key])
);

export const getTotalCollections = state => getCollections(state).length;

export const getSummary = ({ collections }) => collections.summary;

export const getTotal = state => getSummary(state).total;

export const getOrganismNames = createSelector(
  getCollections,
  collections => Object.values(collections).reduce((names, collection) => {
    // eslint-disable-next-line no-param-reassign
    names[collection.organismId] = {
      name: collection.organismName,
      formattedName: getFormatted({ speciesName: collection.organismName }),
    };
    return names;
  }, {})
);

