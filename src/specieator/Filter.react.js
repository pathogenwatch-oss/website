import React from 'react';
import { connect } from 'react-redux';

import { createCollection } from './actions';

const CreateCollectionButton = connect()(({ dispatch }) => (
  <button
    onClick={() => dispatch(createCollection())}
    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
  >
  Create Collection
  </button>
));

export default ({ speciesSummary }) => (
  <aside className="wgsa-specieator-filter">
    <header className="wgsa-specieator-filter__header mdl-layout__header mdl-layout__header--scroll">
      <label className="wgsa-specieator-filter__search">
        <i className="material-icons">search</i>
        <input type="text" placeholder="Search" />
      </label>
    </header>
    <section className="wgsa-specieator-filter__section">
      <h3>Species</h3>
      { Object.keys(speciesSummary).map(label => (
        <button key={label} title={label} type="button" className="mdl-chip mdl-chip--contact">
          <span className="mdl-chip__contact">{speciesSummary[label]}</span>
          <span className="mdl-chip__text">{label}</span>
        </button>
      ))}
    </section>
    <section className="wgsa-specieator-filter__section" style={{ textAlign: 'center' }}>
      <CreateCollectionButton />
    </section>
  </aside>
);
