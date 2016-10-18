import '../css/filter.css';

import React from 'react';
import { connect } from 'react-redux';

import Filter from '../../filter';
import Dropdown from './Dropdown.react';

import { getFilter, getMetadataFilters } from '../selectors';

import actions from '../actions';

import { metadataFilters } from '../utils/filter';
import { months } from '../../utils/Date';

const [ speciesFilter, countryFilter ] = metadataFilters;

const FilterButton = ({ name, label, count, active, onClick }) => (
  <button
    title={name}
    className={`mdl-chip mdl-chip--contact ${active ? 'mdl-chip--active' : ''}`.trim()}
    onClick={onClick}
  >
    <span className="mdl-chip__contact">{count}</span>
    <span className="mdl-chip__text">{label || name}</span>
  </button>
);

const MetadataFilter = connect()(
  ({ title, summary, property, dispatch }) => (
    summary.length ?
      <section className="wgsa-hub-filter__section">
        <h3>{title}</h3>
        { summary.map(({ name, label, count, active }) =>
            <FilterButton
              key={name}
              name={name}
              label={label}
              count={count}
              active={active}
              onClick={() => dispatch(actions.filterByMetadata(property, name))}
            />
        )}
      </section> : null
  )
);

const DateFilter = connect()(
  ({ min, max, years, months, dispatch }) => {
    if (!years || years.length === 0) {
      return null;
    }
    return (
      <section className="wgsa-hub-filter__section">
        <h3>Min Date</h3>
        <div className="wgsa-hub-date-filter">
          <Dropdown id="minYear" label="Year" options={years}
            className="wgsa-hub-date-filter__dropdown"
            selected={min.year} fullWidth
            onChange={year => dispatch(actions.filterByMetadata('minDate', { year, month: min.month }))}
          />
          <Dropdown id="minMonth" label="Month" options={months}
            className="wgsa-hub-date-filter__dropdown"
            selected={min.month ? months[min.month] : ''} fullWidth
            onChange={month => dispatch(actions.filterByMetadata('minDate', { year: min.year, month: months.indexOf(month).toString() }))}
          />
        </div>
        <h3>Max Date</h3>
        <div className="wgsa-hub-date-filter">
          <Dropdown id="maxYear" label="Year" options={years}
            className="wgsa-hub-date-filter__dropdown"
            selected={max.year} fullWidth
            onChange={year => dispatch(actions.filterByMetadata('maxDate', { year, month: max.month }))}
          />
          <Dropdown id="maxMonth" label="Month" options={months}
            className="wgsa-hub-date-filter__dropdown"
            selected={max.month ? months[max.month] : ''} fullWidth
            onChange={month => dispatch(actions.filterByMetadata('maxDate', { year: max.year, month: months.indexOf(month).toString() }))}
          />
        </div>
      </section>
    );
  }
);

function mapStateToProps(state) {
  return {
    filters: getMetadataFilters(state),
    textValue: getFilter(state).searchText,
  };
}

function mergeProps({ textValue, ...state }, { dispatch }) {
  return {
    ...state,
    textFilter: {
      value: textValue,
      onChange: e => dispatch(actions.filterByText(e.target.value)),
    },
    clearFilter: () => dispatch(actions.clearFilter()),
  };
}

export default connect(mapStateToProps, null, mergeProps)(
  ({ filters, filterActive, textFilter, clearFilter }) => (
    <Filter
      active={filterActive}
      clear={clearFilter}
      text={textFilter}
    >
      <MetadataFilter
        title="WGSA Species"
        summary={filters.wgsaSpecies}
        property={speciesFilter.key}
      />
      <MetadataFilter
        title="Other Species"
        summary={filters.otherSpecies}
        property={speciesFilter.key}
      />
      <MetadataFilter
        title="Country"
        summary={filters.country}
        property={countryFilter.key}
      />
      <DateFilter
        min={filters.date.min}
        max={filters.date.max}
        years={filters.date.years}
        months={months}
      />
    </Filter>
  )
);
