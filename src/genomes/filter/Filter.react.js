import React from 'react';
import { connect } from 'react-redux';


import { LocationListener } from '~/location';
import FilterAside from '~/filter/aside';
import Section from '~/filter/section';
import DateSection from '~/filter/date-section';
import { ST } from '~/mlst';
import FilterableSection from './FilterableSection.react';

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

const speciesDependants = [
  'subspecies',
  'serotype',
  'strain',
  'mlst',
  'mlst2',
  'ngmast',
  'ngstar',
  'genotype',
  'reference',
];

const genusDependants = speciesDependants.concat([ 'speciesId', 'klocus', 'collection' ]);

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
      filterKey="organismId"
      heading="Supported organism"
      icon="bug_report"
      updateFilter={clearDependants(filterState, genusDependants)}
      hidden={!filterSummary.visible}
      disabled={!filterSummary.organismId.length}
      disabledText="No supported organisms in current filter."
    />
    <FilterableSection
      filterKey="collection"
      heading="Collection"
      icon="collections"
    />
    <FilterableSection
      filterKey="genusId"
      heading="Genus"
      icon="bug_report"
      hidden={filterState.organismId}
      updateFilter={clearDependants(filterState, genusDependants)}
      renderLabel={({ label }) => <em>{label}</em>}
    />
    <FilterableSection
      filterKey="speciesId"
      heading="Species"
      icon="bug_report"
      updateFilter={clearDependants(filterState, speciesDependants)}
      hidden={!filterSummary.genusId.length || filterState.organismId}
      disabled={!filterSummary.speciesId.length}
      disabledText="Select a genus to filter by species."
      renderLabel={({ label }) => <em>{label}</em>}
    />
    <FilterableSection
      filterKey="subspecies"
      heading="Subspecies"
      icon="bug_report"
      updateFilter={clearDependants(filterState, [ 'serotype' ])}
      hidden={filterState.organismId}
      renderLabel={({ value }) => <React.Fragment>subsp. <em>{value}</em></React.Fragment>}
    />
    <FilterableSection
      filterKey="serotype"
      heading={getSerotypeHeading(filterState.genusId)}
      icon="bug_report"
      hidden={filterState.organismId}
      renderLabel={({ value }) => `ser. ${value}`}
    />
    <FilterableSection
      filterKey="strain"
      heading="Strain"
      icon="scatter_plot"
    />
    <FilterableSection
      filterKey="mlst"
      heading={`MLST - ${filterSummary.sources.mlst}`}
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active && filterSummary.mlst2.length ? `${filterSummary.sources.mlst}: ST` : 'ST'} <ST id={value} />
        </React.Fragment>
      )}
    />
    <FilterableSection
      filterKey="mlst2"
      heading={`MLST - ${filterSummary.sources.mlst2}`}
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active && filterSummary.mlst.length ? `${filterSummary.sources.mlst2}: ST` : 'ST'} <ST id={value} />
        </React.Fragment>
      )}
    />
    <FilterableSection
      filterKey="ngstar"
      heading="NG-STAR"
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active ? 'NG-STAR:' : 'Type'} <ST id={value} />
        </React.Fragment>
      )}
    />
    <FilterableSection
      filterKey="ngmast"
      heading="NG-MAST"
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active ? 'NG-MAST:' : 'Type'} <ST id={value} />
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
      filterKey="klocus"
      heading="K Locus"
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
    <DateSection summary={filterSummary.date} />
    <Section
      filterKey="access"
      heading="Access"
      icon="person"
      headerComponent={({ heading }) => <span>{heading}</span>}
    />
    <FilterableSection
      filterKey="uploadedAt"
      heading="Uploaded at"
      icon="cloud_upload"
      autoSelect={filterSummary.access.length === 1}
    />
    <LocationListener update={updateFilter} />
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
