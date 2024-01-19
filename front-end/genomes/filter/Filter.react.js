import React from 'react';
import { connect } from 'react-redux';


import { LocationListener } from '~/location';
import FilterAside from '~/filter/aside';
import Section from '~/filter/section';
import DateSection from '~/filter/date-section';
import { ST } from '~/mlst';
import FilterableSection from './FilterableSection.react';
import MarkdownInline from '~/components/MarkdownInline.react';

import { selectors as filter } from '~/filter';
import * as selectors from './selectors';

import { stateKey } from './index';
import * as actions from './actions';

function getSerotypeHeading(genusId) {
  if (genusId === '590') {
    return 'Serovar';
  }
  return 'Serotype';
}

function getStrainHeading(speciesId) {
  if (speciesId === '666') {
    return 'Lineage (VC)';
  }
  return 'Strain (GPSC)';
}

const speciesDependants = [
  'organismCollection',
  'subspecies',
  'serotype',
  'strain',
  'mlst',
  'mlst2',
  'ngmast',
  'ngstar',
  'klocusKaptive',
  'olocusKaptive',
  'genotype',
  'reference',
  'resistance',
];
const genusDependants = speciesDependants.concat([ 'speciesId', 'klocus', 'olocus', 'collection' ]);
const collectionDependents = speciesDependants.concat([ 'klocus', 'olocus' ]);

const Filter = ({
                  applyFilter,
                  clearFilter,
                  filterSummary,
                  filterState,
                  isActive,
                  prefilter,
                  textValue,
                  updateFilter,
                  updateFilterValue,
                  clearDependants,
                }) => (
  <FilterAside
    active={isActive}
    clear={clearFilter}
    prefilter={prefilter}
    summary={filterSummary}
    textOnChange={value => updateFilterValue('searchText', value)}
    textOnChangeEffect={applyFilter}
    textValue={textValue}
    updateFilter={updateFilter}
  >
    <FilterableSection
      autoSelect={false}
      disabled={!filterSummary.organismId.length}
      disabledText="No supported organisms in current filter."
      filterKey="organismId"
      heading="SNP tree supported"
      hidden={filterState.organismCollection || filterState.organismCgmlst || !filterSummary.visible}
      icon="bug_report"
      updateFilter={clearDependants(filterState, genusDependants)}
    />
    <FilterableSection
      autoSelect={false}
      disabled={!filterSummary.organismCgmlst.length}
      disabledText="No organisms with a cgMLST scheme in current filter."
      filterKey="organismCgmlst"
      heading="cgMLST supported"
      hidden={filterState.organismId || filterState.organismCollection || !filterSummary.visible}
      icon="bug_report"
      updateFilter={clearDependants(filterState, genusDependants)}
    />
    <FilterableSection
      autoSelect={false}
      disabled={!filterSummary.organismCollection.length}
      disabledText="No linked collections in current filter."
      filterKey="organismCollection"
      heading="Linked collections"
      hidden={filterState.organismId || filterState.organismCgmlst || !filterSummary.visible}
      icon="bug_report"
      updateFilter={clearDependants(filterState, genusDependants)}
    />
    <FilterableSection
      filterKey="collection"
      heading="Collection"
      icon="collections"
      renderLabel={({ label }) => <MarkdownInline>{label}</MarkdownInline>}
      updateFilter={clearDependants(filterState, collectionDependents)}
    />
    <FilterableSection
      filterKey="genusId"
      heading="Genus"
      icon="bug_report"
      hidden={filterState.organismId}
      renderLabel={({ label }) => <em>{label}</em>}
      updateFilter={clearDependants(filterState, genusDependants)}
    />
    <FilterableSection
      disabled={!filterSummary.speciesId.length}
      disabledText="Select a genus to filter by species."
      filterKey="speciesId"
      heading="Species"
      hidden={!filterSummary.genusId.length || filterState.organismId}
      icon="bug_report"
      renderLabel={({ label }) => <em>{label}</em>}
      updateFilter={clearDependants(filterState, speciesDependants)}
    />
    <FilterableSection
      filterKey="subspecies"
      heading="Subspecies"
      hidden={!filterSummary.speciesId.length || filterState.organismId}
      icon="bug_report"
      renderLabel={({ value }) => <React.Fragment>subsp. <em>{value}</em></React.Fragment>}
      updateFilter={clearDependants(filterState, [ 'serotype', 'pangolin', 'sarscov2-variants' ])}
    />
    <FilterableSection
      filterKey="serotype"
      heading={getSerotypeHeading(filterState.genusId)}
      hidden={filterState.organismId}
      icon="bug_report"
      renderLabel={({ value }) => `ser. ${value}`}
    />
    <FilterableSection
      filterKey="strain"
      heading={getStrainHeading(filterState.speciesId)}
      icon="scatter_plot"
    />
    <FilterableSection
      filterKey="mlst"
      heading={`MLST - ${filterSummary.sources.mlst}`}
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active && (filterSummary.mlst2.length ? `${filterSummary.sources.mlst}:` : 'MLST:')} ST <ST id={value}/>
        </React.Fragment>
      )}
    />
    <FilterableSection
      filterKey="mlst2"
      heading={`MLST - ${filterSummary.sources.mlst2}`}
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active && (filterSummary.mlst.length ? `${filterSummary.sources.mlst2}:` : 'MLST:')} ST <ST id={value}/>
        </React.Fragment>
      )}
    />
    <FilterableSection
      filterKey="ngstar"
      heading="NG-STAR"
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active ? 'NG-STAR: ST' : 'ST'} <ST id={value}/>
        </React.Fragment>
      )}
    />
    <FilterableSection
      filterKey="ngmast"
      heading="NG-MAST"
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active ? 'NG-MAST: ST' : 'ST'} <ST id={value}/>
        </React.Fragment>
      )}
    />
    <FilterableSection
      filterKey="genotype"
      heading="Genotype"
      icon="label"
      renderLabel={({ value, active }) => (active ? `Genotype ${value}` : value)}
    />
    <FilterableSection
      filterKey="pangolin"
      heading="Pangolin Lineage"
      icon="label"
    />
    <FilterableSection
      filterKey="sarscov2-variants"
      heading="Notable Mutations"
      icon="book"
    />
    <FilterableSection
      filterKey="klocus"
      heading="K Locus"
      icon="label"
    />
    <FilterableSection
      filterKey="olocus"
      heading="O Locus"
      icon="label"
    />
    <FilterableSection
      filterKey="klocusKaptive"
      heading="K Locus"
      icon="label"
    />
    <FilterableSection
      filterKey="olocusKaptive"
      heading="O Locus"
      icon="label"
    />
    <FilterableSection
      filterKey="reference"
      heading="PW Reference"
      icon="book"
    />
    <FilterableSection
      filterKey="resistance"
      heading="Resistance"
      icon="local_pharmacy"
    />
    <FilterableSection
      filterKey="country"
      heading="Country"
      icon="language"
    />
    <DateSection summary={filterSummary.date}/>
    <Section
      filterKey="access"
      headerComponent={({ heading }) => <span>{heading}</span>}
      heading="Access"
      icon="person"
    />
    <FilterableSection
      autoSelect={filterSummary.access.length === 1}
      filterKey="uploadedAt"
      heading="Uploaded at"
      icon="cloud_upload"
    />
    <LocationListener update={updateFilter}/>
  </FilterAside>
);

function mapStateToProps(state) {
  return {
    filterState: selectors.getFilter(state, { stateKey }),
    filterSummary: selectors.getFilterSummary(state, { stateKey }),
    isActive: filter.isActive(state, { stateKey }),
    isOpen: selectors.isFilterOpen(state),
    listFilters: selectors.getListFilters(state),
    prefilter: selectors.getPrefilter(state),
    textValue: selectors.getSearchText(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearFilter: () => dispatch(actions.clearFilter()),
    updateFilterValue: (filterKey, value) =>
      dispatch(actions.updateFilterValue({ [filterKey]: value })),
    applyFilter: () => dispatch(actions.applyFilter()),
    updateFilter: (filterKey, value) =>
      dispatch(actions.updateFilter({ [filterKey]: value })),
    clearDependants: (filterState, dependants) =>
      (key, value) => {
        const update = { [key]: value };
        for (const [ k, v ] of Object.entries(filterState)) {
          if (dependants.includes(k)) {
            update[k] = v;
          }
        }
        dispatch(actions.updateFilter(update));
      },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);
