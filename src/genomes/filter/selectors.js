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
      loading, organismId, country, reference, owner, uploadedAt, date,
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

    const type = [];
    if (reference && reference.true) {
      type.push({
        value: 'reference',
        label: 'Reference',
        count: reference.true.count,
        active: filterState.type === 'reference',
      });
    }
    if (summary.public && summary.public.true) {
      type.push({
        value: 'public',
        label: 'Public',
        count: summary.public.true.count,
        active: filterState.type === 'public',
      });
    }
    if (owner && owner.me) {
      type.push({
        value: 'owner',
        label: 'Uploaded by Me',
        count: owner.me.count,
        active: filterState.type === 'owner',
      });
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
      type,
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

export const getGenomeFilter = ({ genomes }) => genomes.filter;
export const isFilterOpen = state => getGenomeFilter(state).isOpen;
