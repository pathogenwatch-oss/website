import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from '../../filter';

import { stateKey } from './index';
import { getCountryName } from '../../utils/country';

import { isSupported, taxIdMap } from '../../organisms';
import { formatDateTime } from '../../utils/Date';

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
  ({ loading, organismId, country, reference, owner, uploadedAt, date }, filterState) => {
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

    const { startDate = date.min, endDate = date.max } = filterState

    return {
      loading,
      date: {
        bounds: [ date.min, date.max ],
        values: [ startDate, endDate ],
      },
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
      uploadedAt:
        Object.keys(uploadedAt)
          .sort((a, b) => new Date(b) - new Date(a))
          .map(value => {
            const date = new Date(value);
            return {
              value,
              label: formatDateTime(date),
              count: uploadedAt[value].count,
              active: filterState.uploadedAt === value,
            };
          }),
    };
  }
);
