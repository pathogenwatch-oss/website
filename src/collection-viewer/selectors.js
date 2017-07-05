import { createSelector } from 'reselect';

import { getTables, getAMRTableName } from './table/selectors';

import { createColourGetter } from './amr-utils';

export const getViewer = ({ viewer }) => viewer;

export const getCollection = state => getViewer(state).entities.collection;

export const getGenomes = state => getViewer(state).entities.genomes;

const getSearchIds = createSelector(
  state => getViewer(state).search.terms,
  state => getViewer(state).search.operators,
  (terms, operators) => {
    const intersections = [];
    let intersection = null;
    for (const { key, value } of terms) {
      const operator = operators[key];
      if (operator === 'OR') {
        intersections.push(intersection);
        intersection = value.ids;
      } else if (intersection) {
        intersection = intersection.filter(id => value.ids.indexOf(id) !== -1);
      } else {
        intersection = value.ids;
      }
    }
    if (intersection) intersections.push(intersection);
    return new Set(intersections.reduce((memo, ids) => memo.concat(ids), []));
  }
);

export const getFilter = createSelector(
  state => getViewer(state).filter,
  state => getViewer(state).search.terms,
  getSearchIds,
  (filter, searchTerms, searchIds) => {
    if (searchTerms.size) {
      return {
        ...filter,
        ids: searchIds,
        active: true,
      };
    }
    return filter;
  }
);

export const getVisibleGenomeIds = state => getFilter(state).unfilteredIds;

export const getGenomeList = createSelector(
  getGenomes,
  getVisibleGenomeIds,
  (genomes, ids) => Array.from(ids).map(id => genomes[id])
);

export const getFilteredGenomeIds = createSelector(
  getFilter,
  filter => filter.ids
);

export const getActiveGenomeIds = createSelector(
  getFilter,
  filter => Array.from(filter.active ? filter.ids : filter.unfilteredIds)
);

export const getActiveGenomes = createSelector(
  getGenomes,
  getActiveGenomeIds,
  (genomes, ids) => Array.from(ids).map(id => genomes[id])
);

export const getColourGetter = createSelector(
  getTables,
  getAMRTableName,
  (tables, name) => createColourGetter(name, tables[name].activeColumns)
);

export const getCollectionMetadata = createSelector(
  getCollection,
  collection => ({
    title: collection.title,
    description: collection.description,
    dateCreated: new Date(collection.createdAt).toLocaleDateString(),
    pmid: collection.pmid,
  })
);
