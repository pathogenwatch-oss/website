import React from 'react';
import { connect } from 'react-redux';

import { ST } from '../../mlst';

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
  'genotyphi',
];

const genusDependants = speciesDependants.concat('speciesId');

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
    loading={filterSummary.loading}
    prefilter={prefilter}
    textOnChange={value => updateFilterValue('searchText', value)}
    textOnChangeEffect={applyFilter}
    textValue={textValue}
    updateFilter={updateFilter}
  >
    <FilterSection
      filterKey="organismId"
      heading="Supported Organism"
      icon="bug_report"
      summary={filterSummary.supportedOrganisms}
    />
    <FilterSection
      filterKey="genusId"
      heading="Genus"
      icon="bug_report"
      summary={filterSummary.genusId}
      updateFilter={clearDependants(filterState, genusDependants)}
      renderLabel={({ label }) => <em>{label}</em>}
    />
    <FilterSection
      filterKey="speciesId"
      heading="Species"
      icon="bug_report"
      summary={filterSummary.speciesId}
      updateFilter={clearDependants(filterState, speciesDependants)}
      hidden={!filterSummary.genusId.length}
      disabled={!filterSummary.speciesId.length}
      disabledText="Select a genus to filter by species."
      renderLabel={({ label }) => <em>{label}</em>}
    />
    <FilterSection
      filterKey="subspecies"
      heading="Subspecies"
      icon="bug_report"
      summary={filterSummary.subspecies}
      updateFilter={clearDependants(filterState, [ 'serotype' ])}
      hidden={!filterSummary.subspecies.length}
      renderLabel={({ label }) => <em>{label}</em>}
    />
    <FilterSection
      filterKey="serotype"
      heading={getSerotypeHeading(filterState.genusId)}
      icon="bug_report"
      summary={filterSummary.serotype}
      hidden={!filterSummary.serotype.length}
    />
    <FilterSection
      filterKey="strain"
      heading="Strain"
      icon="scatter_plot"
      summary={filterSummary.strain}
      hidden={!filterSummary.strain.length}
    />
    <FilterSection
      filterKey="mlst"
      heading={
        <React.Fragment>
          MLST - {filterSummary.sources.mlst}
        </React.Fragment>
      }
      icon="label"
      summary={filterSummary.mlst}
      hidden={!filterSummary.mlst.length}
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active ? `${filterSummary.sources.mlst}: ST` : 'ST'} <ST id={value} />
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
      summary={filterSummary.mlst2}
      hidden={!filterSummary.mlst2.length}
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active ? `${filterSummary.sources.mlst2}: ST` : 'ST'} <ST id={value} />
        </React.Fragment>
      )}
    />
    <FilterSection
      filterKey="ngstar"
      heading="NG-STAR"
      icon="label"
      summary={filterSummary.ngstar}
      hidden={!filterSummary.ngstar.length}
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
      summary={filterSummary.ngmast}
      hidden={!filterSummary.ngmast.length}
      renderLabel={({ active, value }) => (
        <React.Fragment>
          {active ? 'NG-MAST:' : 'Type'} <ST id={value} />
        </React.Fragment>
      )}
    />
    <FilterSection
      filterKey="genotyphi"
      heading="Genotyphi"
      icon="label"
      summary={filterSummary.genotyphi}
      hidden={!filterSummary.genotyphi.length}
    />
    <FilterSection
      filterKey="resistance"
      heading="Resistance"
      icon="local_pharmacy"
      summary={filterSummary.antibiotics}
    />
    <FilterSection
      filterKey="country"
      heading="Country"
      icon="language"
      summary={filterSummary.country}
    />
    <DateSection summary={filterSummary.date} />
    <FilterSection
      className="capitalised"
      filterKey="type"
      heading="Access"
      icon="person"
      summary={filterSummary.type}
    />
    <FilterSection
      filterKey="uploadedAt"
      heading="Uploaded At"
      icon="cloud_upload"
      summary={filterSummary.uploadedAt}
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
