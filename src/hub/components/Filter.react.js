import '../css/filter.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Dropdown from './Dropdown.react';

import { getFilter, getMetadataFilters } from '../selectors';

import actions from '../actions';

import { metadataFilters } from '../utils/filter';
import { months } from '../../utils/Date';

const [ speciesFilter, countryFilter ] = metadataFilters;

function mapFilterSearchText(state) {
  return {
    value: getFilter(state).searchText,
  };
}

const FilterInput = connect(mapFilterSearchText)(({ value, dispatch }) => (
  <input
    type="text"
    placeholder="Search"
    value={value}
    onChange={e => dispatch(actions.filterByText(e.target.value))}
  />
));

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

const ClearFilterButton = connect()(({ dispatch }) => (
  <button
    className="mdl-button mdl-js-button mdl-button--primary"
    onClick={() => dispatch(actions.clearFilter())}
  >
    Clear Filters
  </button>
));

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
  };
}

export default connect(mapStateToProps)(
  ({ filters, filterActive }) => (
    <aside className={classnames('wgsa-hub-filter', { 'wgsa-hub-filter--active': filterActive })}>
      <header className="wgsa-hub-filter__header mdl-layout__header mdl-layout__header--scroll">
        <label className="wgsa-hub-filter__search">
          <i className="material-icons">search</i>
          <FilterInput />
        </label>
      </header>
      <div className="wgsa-hub-filter__content">
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
      </div>
      <footer className="wgsa-hub-filter__footer">
        <ClearFilterButton />
      </footer>
    </aside>
  )
);
