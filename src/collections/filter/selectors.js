import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from '../../filter';

import { taxIdMap } from '../../organisms';

import { stateKey } from './index';

export const getFilter = state => filter.getFilter(state, { stateKey });

export const getPrefilter = state => getFilter(state).prefilter;
export const getActiveSort = state => getFilter(state).sort;

export const getSearchText = createSelector(
  getFilter,
  ({ searchText }) => (searchText || ''),
);

export const getFilterSummary = createSelector(
  ({ collections }) => collections.summary,
  getFilter,
  ({ loading, organismId, type, publicationYear, createdAt }, filterState) => ({
    loading,
    organism: sortBy(
      Object.keys(organismId).map(value => {
        const organism = taxIdMap.get(value);
        return {
          value,
          label: organism.formattedName,
          title: organism.name,
          count: organismId[value].count,
          active: filterState.organismId === value,
        };
      }),
      'title'
    ),
    type: sortBy(
      Object.keys(type).map(
        value => ({
          value,
          label: value,
          count: type[value].count,
          active: filterState.type === value,
        })
      ),
      'label'
    ),
    publicationYear: sortBy(
      Object.keys(publicationYear).map(
        value => ({
          value,
          label: value,
          count: publicationYear[value].count,
          active: filterState.publicationYear === value,
        })
      ),
      'label'
    ),
    date: createdAt.min && createdAt.max ? {
      bounds: [ createdAt.min, createdAt.max ],
      values: [ filterState.minDate, filterState.maxDate ],
    } : null,
  })
);

export const getCollectionFilter = ({ collections }) => collections.filter;
export const isFilterOpen = state => getCollectionFilter(state).isOpen;
