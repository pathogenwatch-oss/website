import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { getOrderedGenomes } from '../selectors';
import { selectors as filter } from '../../filter';

import { stateKey, filters } from './filter';
import { getCountryName } from '../../utils/country';

import { isSupported, taxIdMap } from '../../species';

export const getFilter = state => filter.getFilter(state, { stateKey });

export const getSearchText = createSelector(
  getFilter,
  ({ searchRegExp }) => (searchRegExp ? searchRegExp.source : ''),
);

export const getVisibleGenomes = state =>
  filter.getFilteredItems(state, {
    filters,
    stateKey,
    items: getOrderedGenomes(state),
  });

export const getNumberOfVisibleGenomes = createSelector(
  getVisibleGenomes,
  genomes => genomes.length,
);

export const getFilterSummary = createSelector(
  ({ genomes }) => genomes.summary,
  filter.getFilter,
  ({ loading, speciesId, country, reference, owner }, filterState) => {
    const wgsaSpecies = [];
    const otherSpecies = [];

    for (const key of Object.keys(speciesId)) {
      if (isSupported({ speciesId: key })) {
        const species = taxIdMap.get(key);
        wgsaSpecies.push({
          key,
          label: species.formattedShortName,
          title: species.name,
          count: speciesId[key].count,
          active: filterState.speciesKey === key,
        });
      } else {
        otherSpecies.push({
          key,
          active: filterState.speciesKey === key,
          ...speciesId[key],
        });
      }
    }

    return {
      loading,
      wgsaSpecies: sortBy(wgsaSpecies, 'title'),
      otherSpecies: sortBy(otherSpecies, 'label'),
      country: sortBy(
        Object.keys(country).map(
          key => ({
            key,
            label: getCountryName(key),
            count: country[key].count,
            active: filterState.country === key,
          })
        ),
        'label'
      ),
      reference: Object.keys(reference).map(
        key => ({
          key,
          label: key === 'true' ? 'Yes' : 'No',
          count: reference[key].count,
          active: filterState.reference === key,
        })
      ),
      owner: Object.keys(owner).map(
        key => ({
          key,
          label: key === 'me' ? 'Me' : 'Other',
          count: owner[key].count,
          active: filterState.owner === key,
        })
      ),
    };
  }
);
