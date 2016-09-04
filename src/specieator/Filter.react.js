import React from 'react';
import { connect } from 'react-redux';

import { createCollection, filterFastas, filterBySpeciesId } from './thunks';

import { taxIdMap } from '^/species';

const CreateCollectionButton = connect()(({ dispatch }) => (
  <button
    onClick={() => dispatch(createCollection())}
    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
  >
    Create Collection
  </button>
));

const FilterInput = connect()(({ dispatch }) => (
  <input
    type="text"
    placeholder="Search"
    onChange={e => dispatch(filterFastas(e.target.value))}
  />
));

const SpeciesButton = connect()(({ speciesId, count, species, dispatch }) => (
  <button
    title={species.shortName}
    type="button"
    className="mdl-chip mdl-chip--contact"
    onClick={() => dispatch(filterBySpeciesId(speciesId))}
  >
    <span className="mdl-chip__contact">{count}</span>
    <span className="mdl-chip__text">{species.formattedShortName}</span>
  </button>
));

export default ({ speciesSummary }) => (
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
            species={taxIdMap.get(speciesId)}
            count={count}
          />
      )}
    </section>
    <section className="wgsa-specieator-filter__section" style={{ textAlign: 'center' }}>
      <CreateCollectionButton />
    </section>
  </aside>
);
