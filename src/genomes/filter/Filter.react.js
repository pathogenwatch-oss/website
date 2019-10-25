import React from 'react';
import { connect } from 'react-redux';

import { LocationListener } from '../../location';
import FilterAside from '../../filter/aside';
import FilterSection from '../../filter/section';
import DateSection from '../../filter/date-section';

import { selectors } from '../../filter';

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

const Filter = ({
  applyFilter,
  clearFilter,
  filterSummary,
  isActive,
  prefilter,
  genusId,
  textValue,
  updateFilter,
  updateFilterValue,
  updateMulti,
}) => (
  <FilterAside
    loading={filterSummary.loading}
    active={isActive}
    clear={clearFilter}
    textValue={textValue}
    textOnChange={value => updateFilterValue('searchText', value)}
    textOnChangeEffect={applyFilter}
    prefilter={prefilter}
  >
    <FilterSection
      filterKey="organismId"
      heading="Supported Organism"
      icon="bug_report"
      summary={filterSummary.supportedOrganisms}
      updateFilter={updateFilter}
    />
    <FilterSection
      filterKey="genusId"
      heading="Genus"
      icon="bug_report"
      summary={filterSummary.genusId}
      updateFilter={(key, value) => {
        const speciesItem = filterSummary.speciesId.find(_ => _.active);
        if (speciesItem) {
          updateMulti({
            genusId: value,
            speciesId: speciesItem.value,
          });
        } else {
          updateFilter('genusId', value);
        }
      }}
    />
    <FilterSection
      filterKey="speciesId"
      heading="Species"
      icon="bug_report"
      summary={filterSummary.speciesId}
      updateFilter={updateFilter}
      hidden={!filterSummary.genusId.length}
      disabled={!filterSummary.speciesId.length}
      disabledText="Select a genus to filter by species."
    />
    <FilterSection
      filterKey="subspecies"
      heading="Subspecies"
      icon="bug_report"
      summary={filterSummary.subspecies}
      updateFilter={updateFilter}
      hidden={!filterSummary.subspecies.length}
    />
    <FilterSection
      filterKey="serotype"
      heading={getSerotypeHeading(genusId)}
      icon="bug_report"
      summary={filterSummary.serotype}
      updateFilter={updateFilter}
      hidden={!filterSummary.serotype.length}
    />
    <FilterSection
      filterKey="strain"
      heading="Strain"
      icon="scatter_plot"
      summary={filterSummary.strain}
      updateFilter={updateFilter}
      hidden={!filterSummary.strain.length}
    />
    <FilterSection
      filterKey="st"
      heading={
        <React.Fragment>
          ST - {filterSummary.sources.st}
        </React.Fragment>
      }
      icon="new_releases"
      summary={filterSummary.sts}
      updateFilter={updateFilter}
      hidden={!filterSummary.sts.length}
    />
    <FilterSection
      filterKey="st2"
      heading={
        <React.Fragment>
          ST - {filterSummary.sources.st2}
        </React.Fragment>
      }
      icon="new_releases"
      summary={filterSummary.st2s}
      updateFilter={updateFilter}
      hidden={!filterSummary.st2s.length}
    />
    <FilterSection
      filterKey="resistance"
      heading="Resistance"
      icon="local_pharmacy"
      summary={filterSummary.antibiotics}
      updateFilter={updateFilter}
    />
    <FilterSection
      filterKey="country"
      heading="Country"
      icon="language"
      summary={filterSummary.country}
      updateFilter={updateFilter}
    />
    <DateSection summary={filterSummary.date} updateFilter={updateFilter} />
    <FilterSection
      className="capitalised"
      filterKey="type"
      heading="Type"
      icon="label"
      summary={filterSummary.type}
      updateFilter={updateFilter}
    />
    <FilterSection
      filterKey="uploadedAt"
      heading="Uploaded At"
      icon="cloud_upload"
      summary={filterSummary.uploadedAt}
      updateFilter={updateFilter}
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
    genusId: getFilter(state, { stateKey }).genusId,
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
    updateMulti: filterMap => dispatch(actions.updateFilter(filterMap)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);
