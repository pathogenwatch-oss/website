import { createSelector } from 'reselect';

export const getCollection = ({ collection }) =>
  collection.entities.collection;

export const getAssemblies = createSelector(
  ({ collection }) => collection.entities.assemblies,
  assemblies => Object.values(assemblies)
);

export const getViewer = ({ collection }) => collection.viewer;
