import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from '../../filter';

import { stateKey } from './index';
import { getCountryName } from '../../utils/country';

import { isSupported, taxIdMap } from '../../species';

export const getFilter = state => filter.getFilter(state, { stateKey });

export const getPrefilter = state => getFilter(state).prefilter;

export const getSearchText = createSelector(
  getFilter,
  ({ searchText }) => (searchText || ''),
);

export const getFilterSummary = createSelector(
  ({ genomes }) => genomes.summary,
  filter.getFilter,
  ({ loading, speciesId, country, reference, owner }, filterState) => {
    const wgsaSpecies = [];
    const otherSpecies = [];

    for (const value of Object.keys(speciesId)) {
      if (isSupported({ speciesId: value })) {
        const species = taxIdMap.get(value);
        wgsaSpecies.push({
          value,
          label: species.formattedShortName,
          title: species.name,
          count: speciesId[value].count,
          active: filterState.speciesId === value,
        });
      } else {
        otherSpecies.push({
          value,
          active: filterState.speciesId === value,
          ...speciesId[value],
        });
      }
    }

    return {
      loading,
      wgsaSpecies: sortBy(wgsaSpecies, 'title'),
      otherSpecies: sortBy(otherSpecies, 'label'),
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
