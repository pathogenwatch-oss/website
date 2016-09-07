import React from 'react';
import { connect } from 'react-redux';

import { getSpeciesSummary, getVisibleSpeciesIds } from './selectors';

import actions from './actions';
import { createCollection, filterByText } from './thunks';

import { taxIdMap } from '^/species';

const CreateCollectionButton = connect()(({ disabled, dispatch }) => (
  <button
    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
    disabled={disabled}
    onClick={() => dispatch(createCollection())}
  >
    Create Collection
  </button>
));

const FilterInput = connect()(({ dispatch }) => (
  <input
    type="text"
    placeholder="Search"
    onChange={e => dispatch(filterByText(e.target.value))}
  />
));

const SpeciesButton = connect()(
  ({ speciesId, speciesName, count, species, active, dispatch }) => (
    <button
      title={`Taxon ID: ${speciesId}`}
      className={`mdl-chip mdl-chip--contact ${active ? 'mdl-chip--active' : ''}`.trim()}
      onClick={() => dispatch(actions.filterBySpecies(speciesId))}
    >
      <span className="mdl-chip__contact">{count}</span>
      <span className="mdl-chip__text">{
        species ? species.formattedShortName : speciesName
      }</span>
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

function mapStateToProps(state) {
  return {
    speciesSummary: getSpeciesSummary(state),
    visibleSpeciesIds: getVisibleSpeciesIds(state),
  };
}

export default connect(mapStateToProps)(
  ({ speciesSummary, visibleSpeciesIds, filterActive }) => (
    <aside className="wgsa-specieator-filter">
      <header className="wgsa-specieator-filter__header mdl-layout__header mdl-layout__header--scroll">
        <label className="wgsa-specieator-filter__search">
          <i className="material-icons">search</i>
          <FilterInput />
        </label>
      </header>
      <section className="wgsa-specieator-filter__section">
        <h3>Species</h3>
        { speciesSummary.map(({ speciesId, speciesName, count, active }) =>
            <SpeciesButton
              key={speciesId}
              speciesId={speciesId}
              speciesName={speciesName}
              species={taxIdMap.get(speciesId)}
              count={count}
              active={active}
            />
        )}
      </section>
      <section className="wgsa-specieator-filter__section" style={{ textAlign: 'center' }}>
        <CreateCollectionButton disabled={visibleSpeciesIds.size > 1} />
      </section>
      <footer className={`wgsa-specieator-filter__footer ${filterActive ? 'wgsa-specieator-filter__footer--active' : ''}`.trim()}>
        <ClearFilterButton />
      </footer>
    </aside>
  )
);
