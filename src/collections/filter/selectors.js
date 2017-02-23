import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from '../../filter';

import { taxIdMap } from '../../species';

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
  ({ loading, speciesId, owner }, filterState) => ({
    loading,
    species: sortBy(
      Object.keys(speciesId).map(value => {
        const species = taxIdMap.get(value);
        return {
          value,
          label: species.formattedShortName,
          title: species.name,
          count: speciesId[value].count,
          active: filterState.speciesId === value,
        };
      }),
      'title'
    ),
    owner: Object.keys(owner).map(
      value => ({
        value,
        label: value === 'me' ? 'Me' : 'Other',
        count: owner[value].count,
        active: filterState.owner === value,
      })
    ),
  })
);
