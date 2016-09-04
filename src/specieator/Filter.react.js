import React from 'react';
import { connect } from 'react-redux';

import actions from './actions';
import { createCollection, filterByText, filterBySpeciesId } from './thunks';

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

const SpeciesButton = connect()(({ speciesId, count, species, dispatch }) => (
  <button
    title={species.shortName}
    className="mdl-chip mdl-chip--contact"
    onClick={() => dispatch(filterBySpeciesId(speciesId))}
  >
    <span className="mdl-chip__contact">{count}</span>
    <span className="mdl-chip__text">{species.formattedShortName}</span>
  </button>
));

const ClearFilterButton = connect()(({ dispatch }) => (
  <button
    className="mdl-button mdl-js-button mdl-button--primary"
    onClick={() => dispatch(actions.filterFastas())}
  >
    Clear Filters
  </button>
));

export default ({ speciesSummary, filterActive }) => (
  <aside className="wgsa-specieator-filter">
    <header className="wgsa-specieator-filter__header mdl-layout__header mdl-layout__header--scroll">
      <label className="wgsa-specieator-filter__search">
        <i className="material-icons">search</i>
        <FilterInput />
      </label>
    </header>
    <section className="wgsa-specieator-filter__section">
      <h3>Species</h3>
      { speciesSummary.map(({ speciesId, count }) =>
          <SpeciesButton
            key={speciesId}
            speciesId={speciesId}
            species={taxIdMap.get(speciesId)}
            count={count}
          />
      )}
    </section>
    <section className="wgsa-specieator-filter__section" style={{ textAlign: 'center' }}>
      <CreateCollectionButton disabled={speciesSummary.length > 1} />
    </section>
    <footer className={`wgsa-specieator-filter__footer ${filterActive ? 'wgsa-specieator-filter__footer--active' : ''}`.trim()}>
      <ClearFilterButton />
    </footer>
  </aside>
);
