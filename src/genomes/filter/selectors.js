import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { selectors as filter } from '~/filter';
import { getDeployedOrganismIds } from '~/summary/selectors';

import { stateKey } from './index';
import { getCountryName } from '~/utils/country';
import { taxIdMap } from '~/organisms';
import { getSeroName } from '~/organisms/OrganismName.react';
import { formatDateTime } from '~/utils/Date';
import { isNovel } from '~/mlst';

export const getFilter = state => filter.getFilter(state, { stateKey });
export const isActive = state => filter.isActive(state, { stateKey });

export const getPrefilter = state => getFilter(state).prefilter;
export const getSort = state => getFilter(state).sort;

export const getSearchText = createSelector(
  getFilter,
  ({ searchText }) => searchText || ''
);

const getOrganismSummary = createSelector(
  ({ genomes }) => genomes.summary,
  filter.getFilter,
  getDeployedOrganismIds,
  ({ organismId = {} }, filterState, deployedOrganisms) => {
    const organisms = [];
    for (const value of Object.keys(organismId)) {
      if (deployedOrganisms.has(value)) {
        const organism = taxIdMap.get(value);
        const active = filterState.organismId === value;
        organisms.push({
          value,
          active,
          label: organism.formattedName,
          title: active ? `Organism: ${organism.name}` : organism.name,
          count: organismId[value].count,
        });
      }
    }
    return organisms;
  }
);

export const getFilterSummary = createSelector(
  ({ genomes }) => genomes.summary,
  filter.getFilter,
  getOrganismSummary,
  (summary, filterState, supportedOrganisms) => {
    const {
      access = {},
      country,
      date,
      genotype = {},
      genusId,
      klocus = {},
      loading,
      mlst = {},
      mlst2 = {},
      ngmast = {},
      ngstar = {},
      poppunk = {},
      serotype = {},
      sources = {},
      speciesId,
      reference = {},
      resistance = {},
      subspecies = {},
      uploadedAt,
      visible,
    } = summary;

    const speciesIds = Object.keys(speciesId);
    const seroname = speciesIds.length === 1 ?
      getSeroName(speciesId[speciesIds[0]].label) :
      'serotype';

    return {
      loading,
      visible,
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
          novel: isNovel(value),
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
          novel: isNovel(value),
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
      access: sortBy(
        Object.keys(access).map(value => ({
          value,
          label: `${value[0].toUpperCase()}${value.slice(1)}`,
          count: access[value].count,
          active: filterState.access === value,
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
      resistance: sortBy(
        Object.keys(resistance).map(value => ({
          value,
          count: resistance[value].count,
          active: filterState.resistance === value,
        })),
        'value'
      ),
      subspecies: sortBy(
        Object.keys(subspecies).map(value => ({
          value,
          count: subspecies[value].count,
          active: filterState.subspecies === value,
        })),
        'value'
      ),
      serotype: sortBy(
        Object.keys(serotype).map(value => ({
          value,
          count: serotype[value].count,
          active: filterState.serotype === value,
          activeTitle: `${seroname[0].toUpperCase()}${seroname.slice(1)}: ${value}`,
        })),
        'value'
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
          count: ngmast[value].count,
        })),
        'value'
      ),
      ngstar: sortBy(
        Object.keys(ngstar).map(value => ({
          value,
          active: filterState.ngstar === value,
          count: ngstar[value].count,
          novel: isNovel(value),
        })),
        'novel',
        item => Number(item.value)
      ),
      genotype: sortBy(
        Object.keys(genotype).map(value => ({
          value,
          active: filterState.genotype === value,
          count: genotype[value].count,
        })),
        'value'
      ),
      reference: sortBy(
        Object.keys(reference).map(value => ({
          value,
          active: filterState.reference === value,
          count: reference[value].count,
        })),
        'value'
      ),
      klocus: sortBy(
        Object.keys(klocus).map(value => ({
          value,
          active: filterState.klocus === value,
          count: klocus[value].count,
        })),
        'value'
      ),
    };
  }
);

export const getGenomeFilter = ({ genomes }) => genomes.filter;
export const isFilterOpen = state => getGenomeFilter(state).isOpen;
export const getListFilters = state => getGenomeFilter(state).listFilters;
