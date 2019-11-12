import React from 'react';

import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from '../../filter';
import { getDeployedOrganismIds } from '../../summary/selectors';

import { stateKey } from './index';
import { getCountryName } from '../../utils/country';

import { taxIdMap } from '../../organisms';
import { formatDateTime } from '../../utils/Date';

import { ST, isNovel } from '../../mlst';

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
      sts: sortBy(
        Object.keys(mlst).map(value => {
          const active = filterState.mlst === value;
          return {
            value,
            active,
            novel: isNovel(value),
            label: <React.Fragment>{active ? `MLST - ${sources.mlst}:` : 'ST'} <ST id={value} /></React.Fragment>,
            title: active ? `MLST - ${sources.mlst}: ${value}` : `ST ${value}`,
            count: mlst[value].count,
          };
        }),
        'novel',
        item => Number(item.value)
      ),
      st2s: sortBy(
        Object.keys(mlst2).map(value => {
          const active = filterState.mlst2 === value;
          return {
            value,
            active,
            novel: isNovel(value),
            label: <React.Fragment>{active ? `MLST - ${sources.mlst2}:` : 'ST'} <ST id={value} /></React.Fragment>,
            title: active ? `MLST - ${sources.mlst2}: ${value}` : `ST ${value}`,
            count: mlst2[value].count,
          };
        }),
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
          label: value,
          count: antibiotics[value].count,
          active: filterState.resistance === value,
        })),
        'label'
      ),
      serotype: sortBy(
        Object.keys(serotype).map(value => ({
          value,
          label: value,
          count: serotype[value].count,
          active: filterState.serotype === value,
        })),
        'label'
      ),
      subspecies: sortBy(
        Object.keys(subspecies).map(value => ({
          value,
          label: value,
          count: subspecies[value].count,
          active: filterState.subspecies === value,
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
        Object.keys(ngmast).map(value => {
          const active = filterState.ngmast === value;
          const label = active ? `NG-MAST: ${value}` : `Type ${value}`;
          return {
            value,
            active,
            label,
            title: label,
            count: ngmast[value].count,
          };
        }),
        'label'
      ),
      ngstar: sortBy(
        Object.keys(ngstar).map(value => {
          const active = filterState.ngstar === value;
          return {
            value,
            active,
            novel: isNovel(value),
            label: <React.Fragment>{active ? 'NG-STAR:' : 'Type'} <ST id={value} /></React.Fragment>,
            title: active ? `NG-STAR: ${value}` : `Type ${value}`,
            count: ngstar[value].count,
          };
        }),
        'novel',
        item => Number(item.value)
      ),
      genotyphi: sortBy(
        Object.keys(genotyphi).map(value => ({
          value,
          label: value,
          count: genotyphi[value].count,
          active: filterState.genotyphi === value,
        })),
        'label'
      ),
    };
  }
);

export const getGenomeFilter = ({ genomes }) => genomes.filter;
export const isFilterOpen = state => getGenomeFilter(state).isOpen;
