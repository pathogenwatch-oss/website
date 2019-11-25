import React from 'react';
import { connect } from 'react-redux';

import { ST } from '~/mlst';

import { LocationListener } from '~/location';
import FilterAside from '~/filter/aside';
import FilterSection from '~/filter/section';
import DateSection from '~/filter/date-section';

import { selectors } from '~/filter';

import {
  getFilter,
  getFilterSummary,
  getSearchText,
  isFilterOpen,
  getPrefilter,
} from './selectors';

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

const genusDependants = speciesDependants.concat([ 'speciesId', 'klocus' ]);

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
    <FilterSection
      autoSelect={false}
      filterKey="organismId"
      heading="Supported Organism"
      icon="bug_report"
      summary={filterSummary.supportedOrganisms}
      updateFilter={clearDependants(filterState, genusDependants)}
      hidden={!filterSummary.genusId.length}
      disabled={!filterSummary.supportedOrganisms.length}
      disabledText="No supported organisms in current filter."
    />
    <FilterSection
      filterKey="genusId"
      heading="Genus"
      icon="bug_report"
      hidden={filterState.organismId}
      updateFilter={clearDependants(filterState, genusDependants)}
      renderLabel={({ label }) => <em>{label}</em>}
    />
    <FilterSection
      filterKey="speciesId"
      heading="Species"
      icon="bug_report"
      updateFilter={clearDependants(filterState, speciesDependants)}
      hidden={!filterSummary.genusId.length || filterState.organismId}
      disabled={!filterSummary.speciesId.length}
      disabledText="Select a genus to filter by species."
      renderLabel={({ label }) => <em>{label}</em>}
    />
    <FilterSection
      filterKey="subspecies"
      heading="Subspecies"
      icon="bug_report"
      updateFilter={clearDependants(filterState, [ 'serotype' ])}
      hidden={filterState.organismId}
      renderLabel={({ value }) => <React.Fragment>subsp. <em>{value}</em></React.Fragment>}
    />
    <FilterSection
      filterKey="serotype"
      heading={getSerotypeHeading(filterState.genusId)}
      icon="bug_report"
      hidden={filterState.organismId}
      renderLabel={({ value }) => `ser. ${value}`}
    />
    <FilterSection
      filterKey="strain"
      heading="Strain"
      icon="scatter_plot"
    />
    <FilterSection
      filterKey="mlst"
      heading={
        <React.Fragment>
          MLST - {filterSummary.sources.mlst}
        </React.Fragment>
      }
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active && filterSummary.mlst2.length ? `${filterSummary.sources.mlst}: ST` : 'ST'} <ST id={value} />
        </React.Fragment>
      )}
    />
    <FilterSection
      filterKey="mlst2"
      heading={
        <React.Fragment>
          MLST - {filterSummary.sources.mlst2}
        </React.Fragment>
      }
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active && filterSummary.mlst.length ? `${filterSummary.sources.mlst2}: ST` : 'ST'} <ST id={value} />
        </React.Fragment>
      )}
    />
    <FilterSection
      filterKey="ngstar"
      heading="NG-STAR"
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active ? 'NG-STAR:' : 'Type'} <ST id={value} />
        </React.Fragment>
      )}
    />
    <FilterSection
      filterKey="ngmast"
      heading="NG-MAST"
      icon="label"
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active ? 'NG-MAST:' : 'Type'} <ST id={value} />
        </React.Fragment>
      )}
    />
    <FilterSection
      filterKey="genotype"
      heading="Genotype"
      icon="label"
      renderLabel={({ value, active }) => (active ? `Genotype ${value}` : value)}
    />
    <FilterSection
      filterKey="klocus"
      heading="K Locus"
      icon="label"
    />
    <FilterSection
      filterKey="reference"
      heading="PW Reference"
      icon="book"
    />
    <FilterSection
      filterKey="resistance"
      heading="Resistance"
      icon="local_pharmacy"
    />
    <FilterSection
      filterKey="country"
      heading="Country"
      icon="language"
    />
    <DateSection summary={filterSummary.date} />
    <FilterSection
      filterKey="access"
      heading="Access"
      icon="person"
    />
    <FilterSection
      filterKey="uploadedAt"
      heading="Uploaded At"
      icon="cloud_upload"
      autoSelect={filterSummary.access.length === 1}
    />
    <LocationListener update={updateFilter} />
  </FilterAside>
);

function mapStateToProps(state) {
  return {
    isActive: selectors.isActive(state, { stateKey }),
    filterSummary: getFilterSummary(state, { stateKey }),
    textValue: getSearchText(state),
    isOpen: isFilterOpen(state),
    prefilter: getPrefilter(state),
    filterState: getFilter(state, { stateKey }),
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
