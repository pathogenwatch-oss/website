import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from '../../filter';

import { stateKey } from './index';
import { getCountryName } from '../../utils/country';

import { isSupported, taxIdMap } from '../../organisms';

export const getFilter = state => filter.getFilter(state, { stateKey });

export const getPrefilter = state => getFilter(state).prefilter;
export const getSort = state => getFilter(state).sort;

export const getSearchText = createSelector(
  getFilter,
  ({ searchText }) => (searchText || ''),
);

export const getFilterSummary = createSelector(
  ({ genomes }) => genomes.summary,
  filter.getFilter,
  ({ loading, organismId, country, reference, owner }, filterState) => {
    const wgsaOrganisms = [];
    const otherOrganisms = [];

    for (const value of Object.keys(organismId)) {
      if (isSupported({ organismId: value })) {
        const organism = taxIdMap.get(value);
        wgsaOrganisms.push({
          value,
          label: organism.formattedShortName,
          title: organism.name,
          count: organismId[value].count,
          active: filterState.organismId === value,
        });
      } else {
        otherOrganisms.push({
          value,
          active: filterState.organismId === value,
          ...organismId[value],
        });
      }
    }

    return {
      loading,
      wgsaOrganisms: sortBy(wgsaOrganisms, 'title'),
      otherOrganisms: sortBy(otherOrganisms, 'label'),
      country: sortBy(
        Object.keys(country).map(
          value => ({
            value,
            label: getCountryName(value),
            count: country[value].count,
            active: filterState.country === value,
          })
        ),
        'label'
      ),
      reference: Object.keys(reference).map(
        value => ({
          value,
          label: value === 'true' ? 'Yes' : 'No',
          count: reference[value].count,
          active: filterState.reference === value,
        })
      ),
      owner: Object.keys(owner).map(
        value => ({
          value,
          label: value === 'me' ? 'Me' : 'Other',
          count: owner[value].count,
          active: filterState.owner === value,
        })
      ),
    };
  }
);
