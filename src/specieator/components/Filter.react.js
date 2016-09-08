import React from 'react';
import { connect } from 'react-redux';

import CreateCollectionButton from './CreateCollectionButton.react';

import { getFilter, getSpeciesSummary } from '../selectors';

import actions from '../actions';

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

const SpeciesButton = connect()(
  ({ name, label, count, active, dispatch }) => (
    <button
      title={name}
      className={`mdl-chip mdl-chip--contact ${active ? 'mdl-chip--active' : ''}`.trim()}
      onClick={() => dispatch(actions.filterBySpecies(name))}
    >
      <span className="mdl-chip__contact">{count}</span>
      <span className="mdl-chip__text">{label}</span>
    </button>
  )
);

const ClearFilterButton = connect()(({ dispatch }) => (
  <button
    className="mdl-button mdl-js-button mdl-button--primary"
    onClick={() => dispatch(actions.clearFilter())}
  >
    Clear Filters
  </button>
));

const SpeciesFilter = ({ title, summary }) => (
  <section className="wgsa-specieator-filter__section">
    <h3>{title}</h3>
    { summary.map(({ name, label, count, active }) =>
        <SpeciesButton
          key={name}
          name={name}
          label={label}
          count={count}
          active={active}
        />
    )}
  </section>
);

function mapStateToProps(state) {
  return {
    speciesSummary: getSpeciesSummary(state),
  };
}

export default connect(mapStateToProps)(
  ({ speciesSummary, filterActive }) => (
    <aside className="wgsa-specieator-filter">
      <header className="wgsa-specieator-filter__header mdl-layout__header mdl-layout__header--scroll">
        <label className="wgsa-specieator-filter__search">
          <i className="material-icons">search</i>
          <FilterInput />
        </label>
      </header>
      <SpeciesFilter
        title="WGSA Species"
        summary={speciesSummary.filter(({ supported }) => supported)}
      />
      <section className="wgsa-specieator-filter__section" style={{ textAlign: 'center' }}>
        <CreateCollectionButton />
      </section>
      <SpeciesFilter
        title="Other Species"
        summary={speciesSummary.filter(({ supported }) => !supported)}
      />
      <footer className={`wgsa-specieator-filter__footer ${filterActive ? 'wgsa-specieator-filter__footer--active' : ''}`.trim()}>
        <ClearFilterButton />
      </footer>
    </aside>
  )
);
