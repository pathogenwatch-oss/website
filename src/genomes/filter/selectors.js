import React from 'react';

import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from '../../filter';
import { getDeployedOrganismIds } from '../../summary/selectors';

import { stateKey } from './index';
import { getCountryName } from '../../utils/country';

import { taxIdMap } from '../../organisms';
import { formatDateTime } from '../../utils/Date';

import { isNovel } from '../../utils/mlst';
import ST from '../../genome-drawer/analysis/ST.react';

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
  getDeployedOrganismIds,
  (summary, filterState, deployedOrganisms) => {
    const {
      loading, organismId, country, type, uploadedAt, date,
    } = summary;
    const sequenceType = summary['analysis.mlst.st'] || {};

    const wgsaOrganisms = [];
    const otherOrganisms = [];

    for (const value of Object.keys(organismId)) {
      if (deployedOrganisms.has(value)) {
        const organism = taxIdMap.get(value);
        wgsaOrganisms.push({
          value,
          label: organism.formattedName,
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
      date: {
        bounds: [ date.min, date.max ],
        values: [ filterState.minDate, filterState.maxDate ],
      },
      wgsaOrganisms: sortBy(wgsaOrganisms, 'title'),
      otherOrganisms: sortBy(otherOrganisms, 'label'),
      sequenceTypes: sortBy(
        Object.keys(sequenceType).map(
          value => ({
            value,
            novel: isNovel(value),
            label: (<ST id={value} />),
            title: `ST ${value}`,
            count: sequenceType[value].count,
            active: filterState.sequenceType === value,
          })
        ),
        'novel',
        'value'
      ),
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
      uploadedAt:
        Object.keys(uploadedAt)
          .sort((a, b) => new Date(b) - new Date(a))
          .map(value => {
            const dateValue = new Date(value);
            return {
              value,
              label: formatDateTime(dateValue),
              count: uploadedAt[value].count,
              active: filterState.uploadedAt === value,
            };
          }),
    };
  }
);

export const getGenomeFilter = ({ genomes }) => genomes.filter;
export const isFilterOpen = state => getGenomeFilter(state).isOpen;
