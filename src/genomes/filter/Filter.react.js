import React from 'react';
import { connect } from 'react-redux';

import { LocationListener } from '../../location';
import FilterAside from '../../filter/aside';
import FilterSection from '../../filter/section';
import DateSection from '../../filter/date-section';

import { selectors } from '../../filter';

import { getFilterSummary, getSearchText, isFilterOpen } from './selectors';

import { stateKey } from './index';
import * as actions from './actions';

function renderSpeciesIdSection(filterSummary) {
  const genusActiveItem = filterSummary.genusId.find(_ => _.active);
  if (genusActiveItem) {
    return null;
  }
  return <p>Select a genus to filter by species.</p>;
}

const Filter = ({ isActive, filterSummary, textValue, updateFilter, updateMulti, clearFilter }) => (
  <FilterAside
    loading={filterSummary.loading}
    active={isActive}
    clear={clearFilter}
    textValue={textValue}
    textOnChange={e => updateFilter('searchText', e.target.value)}
  >
    <FilterSection
      filterKey="organismId"
      heading="Supported Organism"
      icon="bug_report"
      summary={filterSummary.wgsaOrganisms}
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
    >
      { renderSpeciesIdSection(filterSummary) }
    </FilterSection>
    <FilterSection
      filterKey="sequenceType"
      heading="Sequence Type"
      icon="new_releases"
      summary={filterSummary.sequenceTypes}
      updateFilter={updateFilter}
    >
      { (filterSummary.wgsaOrganisms.length || filterSummary.speciesId.length || filterSummary.genusId.length) && !filterSummary.sequenceTypes.length ?
        <p>Select an organism, species, or genus to filter by sequence type.</p> : null }
    </FilterSection>
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearFilter: () => dispatch(actions.clearFilter()),
    updateFilter: (filterKey, value) =>
      dispatch(actions.updateFilter({ [filterKey]: value })),
    updateMulti: filterMap =>
      dispatch(actions.updateFilter(filterMap)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
