import React from 'react';

import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from '../../filter';
import { getDeployedOrganismIds } from '../../summary/selectors';

import { stateKey } from './index';
import { getCountryName } from '../../utils/country';

import { taxIdMap } from '../../organisms';
import { formatDateTime } from '../../utils/Date';

export const getFilter = state => filter.getFilter(state, { stateKey });
export const isActive = state => filter.isActive(state, { stateKey });

export const getPrefilter = state => getFilter(state).prefilter;
export const getSort = state => getFilter(state).sort;

export const getSearchText = createSelector(
  getFilter,
  ({ searchText }) => searchText || ''
);

export const getFilterSummary = createSelector(
  ({ genomes }) => genomes.summary,
  filter.getFilter,
  getDeployedOrganismIds,
  (summary, filterState, deployedOrganisms) => {
    const {
      country,
      date,
      genotyphi = {},
      genusId,
      loading,
      ngmast = {},
      ngstar = {},
      organismId,
      poppunk = {},
      serotype = {},
      sources = {},
      speciesId,
      mlst = {},
      mlst2 = {},
      subspecies = {},
      type,
      uploadedAt,
    } = summary;
    const antibiotics = summary.amr || {};

    const supportedOrganisms = [];

    for (const value of Object.keys(organismId)) {
      if (deployedOrganisms.has(value)) {
        const organism = taxIdMap.get(value);
        supportedOrganisms.push({
          value,
          label: organism.formattedName,
          title: organism.name,
          count: organismId[value].count,
          active: filterState.organismId === value,
        });
      }
    }

    return {
      loading,
      sources,
      date:
        date.min && date.max
          ? {
            bounds: [ date.min, date.max ],
            values: [ filterState.minDate, filterState.maxDate ],
          }
          : null,
      supportedOrganisms: sortBy(supportedOrganisms, 'title'),
      mlst: sortBy(
        Object.keys(mlst).map(value => ({
          value,
          active: filterState.mlst === value,
          label: `ST ${value}`,
          activeTitle: `MLST - ${sources.mlst}: ST ${value}`,
          title: `ST ${value}`,
          count: mlst[value].count,
        })),
        'novel',
        item => Number(item.value)
      ),
      mlst2: sortBy(
        Object.keys(mlst2).map(value => ({
          value,
          active: filterState.mlst2 === value,
          label: `ST ${value}`,
          activeTitle: `MLST - ${sources.mlst2}: ST ${value}`,
          title: `ST ${value}`,
          count: mlst2[value].count,
        })),
        'novel',
        item => Number(item.value)
      ),
      speciesId: sortBy(
        Object.keys(speciesId).map(value => ({
          value,
          label: speciesId[value].label,
          count: speciesId[value].count,
          active: filterState.speciesId === value,
        })),
        'label'
      ),
      genusId: sortBy(
        Object.keys(genusId).map(value => ({
          value,
          label: genusId[value].label,
          count: genusId[value].count,
          active: filterState.genusId === value,
        })),
        'label'
      ),
      country: sortBy(
        Object.keys(country).map(value => ({
          value,
          label: getCountryName(value),
          count: country[value].count,
          active: filterState.country === value,
        })),
        'label'
      ),
      type: sortBy(
        Object.keys(type).map(value => ({
          value,
          label: `${value[0].toUpperCase()}${value.slice(1)}`,
          count: type[value].count,
          active: filterState.type === value,
        })),
        'label'
      ),
      uploadedAt: Object.keys(uploadedAt)
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
      antibiotics: sortBy(
        Object.keys(antibiotics).map(value => ({
          value,
          count: antibiotics[value].count,
          active: filterState.resistance === value,
        })),
        'label'
      ),
      subspecies: sortBy(
        Object.keys(subspecies).map(value => ({
          value,
          count: subspecies[value].count,
          active: filterState.subspecies === value,
        })),
        'label'
      ),
      serotype: sortBy(
        Object.keys(serotype).map(value => ({
          value,
          count: serotype[value].count,
          active: filterState.serotype === value,
        })),
        'label'
      ),
      strain: sortBy(
        Object.keys(poppunk).map(value => ({
          value,
          label: `GPSC ${value}`,
          count: poppunk[value].count,
          active: filterState.strain === value,
        })),
        item => Number(item.value)
      ),
      ngmast: sortBy(
        Object.keys(ngmast).map(value => ({
          value,
          active: filterState.ngmast === value,
          label: `Type ${value}`,
          count: ngmast[value].count,
        })),
        'label'
      ),
      ngstar: sortBy(
        Object.keys(ngstar).map(value => ({
          value,
          active: filterState.ngstar === value,
          label: `Type ${value}`,
          count: ngstar[value].count,
        })),
        'novel',
        item => Number(item.value)
      ),
      genotyphi: sortBy(
        Object.keys(genotyphi).map(value => ({
          value,
          active: filterState.genotyphi === value,
          label: value,
          count: genotyphi[value].count,
        })),
        'label'
      ),
    };
  }
);

export const getGenomeFilter = ({ genomes }) => genomes.filter;
export const isFilterOpen = state => getGenomeFilter(state).isOpen;
