import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from '../../filter';

import { taxIdMap } from '../../organisms';

import { stateKey } from './index';

export const getFilter = state => filter.getFilter(state, { stateKey });

export const getPrefilter = state => getFilter(state).prefilter;

export const getSearchText = createSelector(
  getFilter,
  ({ searchText }) => (searchText || ''),
);

export const getFilterSummary = createSelector(
  ({ collections }) => collections.summary,
  getFilter,
  ({ loading, organismId, owner }, filterState) => ({
    loading,
    organism: sortBy(
      Object.keys(organismId).map(value => {
        const organism = taxIdMap.get(value);
        return {
          value,
          label: organism.formattedShortName,
          title: organism.name,
          count: organismId[value].count,
          active: filterState.organismId === value,
        };
      }),
      'title'
    ),
    type: Object.keys(owner).map(
      value => ({
        value: value === 'me' ? 'private' : 'public',
        label: value === 'me' ? 'Private' : 'Public',
        count: owner[value].count,
        active: filterState.type === value,
      })
    ),
  })
);

export const getCollectionFilter = ({ collections }) => collections.filter;
export const isFilterOpen = state => getCollectionFilter(state).isOpen;
