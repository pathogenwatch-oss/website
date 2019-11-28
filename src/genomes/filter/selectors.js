import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';
import removeMarkdown from 'remove-markdown';

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

export const getGenomeFilter = ({ genomes }) => genomes.filter;
export const isFilterOpen = state => getGenomeFilter(state).isOpen;

export const getListFilters = state => getGenomeFilter(state).listFilters;

const getFilterFn = (filterKey, property) => createSelector(
  state => getListFilters(state)[filterKey],
  filterText => {
    try {
      const regex = new RegExp(filterText, 'i');
      return input => regex.test(property ? input[property] : input);
    } catch (e) {
      return () => true;
    }
  }
);

const getFilterSummaries = ({ genomes }) => genomes.summary;

const getOrganismSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).organismId,
  getDeployedOrganismIds,
  getFilterFn('organismId', 'title'),
  ({ organismId = {} }, filterValue, deployedOrganisms, filterFn) => sortBy(
    Object.keys(organismId)
      .filter(value => deployedOrganisms.has(value))
      .map(value => {
        const organism = taxIdMap.get(value);
        const active = filterValue === value;
        return {
          value,
          active,
          label: organism.formattedName,
          title: organism.name,
          activeTitle: `Organism: ${organism.name}`,
          count: organismId[value].count,
        };
      })
      .filter(filterFn),
    'title'
  )
);

const getMlstSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).mlst,
  getFilterFn('mlst'),
  ({ mlst = {}, sources }, filterValue, filterFn) => sortBy(
    Object.keys(mlst)
      .filter(filterFn)
      .map(value => ({
        value,
        active: filterValue === value,
        label: `ST ${value}`,
        activeTitle: `MLST - ${sources.mlst}: ST ${value}`,
        title: `ST ${value}`,
        count: mlst[value].count,
        novel: isNovel(value),
      })),
    'novel',
    item => Number(item.value)
  )
);

const getMlst2Summary = createSelector(
  getFilterSummaries,
  state => getFilter(state).mlst2,
  getFilterFn('mlst2'),
  ({ mlst2 = {}, sources }, filterValue, filterFn) => sortBy(
    Object.keys(mlst2)
      .filter(filterFn)
      .map(value => ({
        value,
        active: filterValue === value,
        label: `ST ${value}`,
        activeTitle: `MLST - ${sources.mlst2}: ST ${value}`,
        title: `ST ${value}`,
        count: mlst2[value].count,
        novel: isNovel(value),
      })),
    'novel',
    item => Number(item.value)
  )
);

const getSpeciesIdSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).speciesId,
  getFilterFn('speciesId', 'label'),
  ({ speciesId = {} }, filterValue, filterFn) => sortBy(
    Object.keys(speciesId)
      .map(value => ({
        value,
        label: speciesId[value].label,
        count: speciesId[value].count,
        active: filterValue === value,
      }))
      .filter(filterFn),
    'label'
  )
);

const getGenusIdSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).genusId,
  getFilterFn('genusId', 'label'),
  ({ genusId = {} }, filterValue, filterFn) => sortBy(
    Object.keys(genusId)
      .map(value => ({
        value,
        label: genusId[value].label,
        count: genusId[value].count,
        active: filterValue === value,
      }))
      .filter(filterFn),
    'label'
  )
);

const getCountrySummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).country,
  getFilterFn('country', 'label'),
  ({ country = {} }, filterValue, filterFn) => sortBy(
    Object.keys(country)
      .map(value => ({
        value,
        label: getCountryName(value),
        count: country[value].count,
        active: filterValue === value,
      }))
      .filter(filterFn),
    'label'
  )
);

const getAccessSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).access,
  ({ access = {} }, filterValue) => sortBy(
    Object.keys(access)
      .map(value => ({
        value,
        label: `${value[0].toUpperCase()}${value.slice(1)}`,
        count: access[value].count,
        active: filterValue === value,
      })),
    'label'
  )
);

const getUploadedAtSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).uploadedAt,
  getFilterFn('uploadedAt', 'label'),
  ({ uploadedAt = {} }, filterValue, filterFn) =>
    Object.keys(uploadedAt)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(value => {
        const dateValue = new Date(value);
        return {
          value,
          label: formatDateTime(dateValue),
          count: uploadedAt[value].count,
          active: filterValue === value,
        };
      })
      .filter(filterFn)
);

const getResistanceSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).resistance,
  getFilterFn('resistance'),
  ({ resistance = {} }, filterValue, filterFn) => sortBy(
    Object.keys(resistance)
      .filter(filterFn)
      .map(value => ({
        value,
        count: resistance[value].count,
        active: filterValue === value,
      })),
    'value'
  )
);

const getSubspeciesSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).subspecies,
  getFilterFn('subspecies'),
  ({ subspecies = {} }, filterValue, filterFn) => sortBy(
    Object.keys(subspecies)
      .filter(filterFn)
      .map(value => ({
        value,
        count: subspecies[value].count,
        active: filterValue === value,
      })),
    'value'
  )
);

const getSeroname = createSelector(
  state => getFilterSummaries(state).speciesId,
  (speciesIdSummary) => {
    const speciesIds = Object.keys(speciesIdSummary);
    return speciesIds.length === 1 ?
      getSeroName(speciesIdSummary[speciesIds[0]].label) :
      'serotype';
  }
);

const getSerotypeSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).serotype,
  getFilterFn('serotype'),
  getSeroname,
  ({ serotype = {} }, filterValue, filterFn, seroname) => sortBy(
    Object.keys(serotype)
      .filter(filterFn)
      .map(value => ({
        value,
        count: serotype[value].count,
        active: filterValue === value,
        activeTitle: `${seroname[0].toUpperCase()}${seroname.slice(1)}: ${value}`,
      })),
    'value'
  )
);

const getStrainSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).strain,
  getFilterFn('strain'),
  ({ strain = {} }, filterValue, filterFn) => sortBy(
    Object.keys(strain)
      .filter(filterFn)
      .map(value => ({
        value,
        label: `GPSC ${value}`,
        count: strain[value].count,
        active: filterValue === value,
      })),
    item => Number(item.value)
  )
);

const getNgmastSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).ngmast,
  getFilterFn('ngmast'),
  ({ ngmast = {} }, filterValue, filterFn) => sortBy(
    Object.keys(ngmast)
      .filter(filterFn)
      .map(value => ({
        value,
        active: filterValue === value,
        count: ngmast[value].count,
      })),
    'value'
  )
);

const getNgstarSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).ngstar,
  getFilterFn('ngstar'),
  ({ ngstar = {} }, filterValue, filterFn) => sortBy(
    Object.keys(ngstar)
      .filter(filterFn)
      .map(value => ({
        value,
        active: filterValue === value,
        count: ngstar[value].count,
        novel: isNovel(value),
      })),
    'novel',
    item => Number(item.value)
  )
);

const getGenotypeSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).genotype,
  getFilterFn('genotype'),
  ({ genotype = {} }, filterValue, filterFn) => sortBy(
    Object.keys(genotype)
      .filter(filterFn)
      .map(value => ({
        value,
        active: filterValue === value,
        count: genotype[value].count,
      })),
    'value'
  )
);

const getReferenceSummary = createSelector(
  createSelector( // caches sort
    getFilterSummaries,
    ({ reference = {} }) => Object.keys(reference).sort()
  ),
  getFilterSummaries,
  state => getFilter(state).reference,
  getFilterFn('reference'),
  (items, { reference = {} }, filterValue, filterFn) =>
    items
      .filter(filterFn)
      .map(value => ({
        value,
        active: filterValue === value,
        count: reference[value].count,
      }))
);

const getKlocusSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).klocus,
  getFilterFn('klocus'),
  ({ klocus = {} }, filterValue, filterFn) => sortBy(
    Object.keys(klocus)
      .filter(filterFn)
      .map(value => ({
        value,
        active: filterValue === value,
        count: klocus[value].count,
      })),
    'value'
  )
);

const getDateSummary = createSelector(
  getFilterSummaries,
  state => getFilter(state).minDate,
  state => getFilter(state).maxDate,
  ({ date }, minDate, maxDate) => (
    date.min && date.max ?
      {
        bounds: [ date.min, date.max ],
        values: [ minDate, maxDate ],
      } :
      null
  )
);

const untitled = '(untitled collection)';
const sortCollections = (a, b) => {
  if (a.title === untitled && b.title !== untitled) return 1;
  if (a.title !== untitled && b.title === untitled) return -1;
  if (a.title > b.title) return 1;
  if (a.title < b.title) return -1;
  return 0;
};

const getCollectionItems = createSelector(
  getFilterSummaries,
  ({ collection = {} }) =>
    Object.keys(collection)
      .map(value => {
        const item = collection[value];
        const label = item.label || untitled;
        const title = removeMarkdown(label);
        return {
          value,
          label,
          title,
        };
      })
      .sort(sortCollections)
);

const getCollectionSummary = createSelector(
  getCollectionItems,
  getFilterSummaries,
  state => getFilter(state).collection,
  getFilterFn('collection', 'title'),
  (items, { collection = {} }, filterValue, filterFn) =>
    items
      .filter(filterFn)
      .map(item => ({
        ...item,
        activeTitle: `Collection: ${item.title}`,
        active: filterValue === item.value,
        count: collection[item.value].count,
      }))
);

export const getFilterSummary = createSelector(
  ({ genomes }) => genomes.summary,
  getAccessSummary,
  getCollectionSummary,
  getCountrySummary,
  getDateSummary,
  getGenotypeSummary,
  getGenusIdSummary,
  getKlocusSummary,
  getMlst2Summary,
  getMlstSummary,
  getNgmastSummary,
  getNgstarSummary,
  getOrganismSummary,
  getReferenceSummary,
  getResistanceSummary,
  getSerotypeSummary,
  getSpeciesIdSummary,
  getStrainSummary,
  getSubspeciesSummary,
  getUploadedAtSummary,
  ({ loading, sources = {}, visible }, ...summaries) => {
    const [ // order is important!
      access,
      collection,
      country,
      date,
      genotype,
      genusId,
      klocus,
      mlst2,
      mlst,
      ngmast,
      ngstar,
      organismId,
      reference,
      resistance,
      serotype,
      speciesId,
      strain,
      subspecies,
      uploadedAt,
    ] = summaries;

    return {
      loading,
      sources,
      visible,

      access,
      collection,
      country,
      date,
      genotype,
      genusId,
      klocus,
      mlst,
      mlst2,
      ngmast,
      ngstar,
      organismId,
      reference,
      resistance,
      serotype,
      speciesId,
      strain,
      subspecies,
      uploadedAt,
    };
  }
);
