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
        <button key={label} type="button" className="mdl-chip mdl-chip--contact">
          <span className="mdl-chip__contact">{speciesSummary[label]}</span>
          <span className="mdl-chip__text">{label}</span>
        </button>
      ))}
    </section>
    <section className="wgsa-specieator-filter__section" style={{ textAlign: 'center' }}>
      <CreateCollectionButton />
    </section>
    {/* <section className="wgsa-specieator-filter__section">
      <h3>No. Contigs</h3>
      <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
        <input type="checkbox" className="mdl-checkbox__input" />
        <span className="mdl-checkbox__label">
          <input className="mdl-slider mdl-js-slider" type="range" min="0" max="100" value="25" tabIndex="0" />
        </span>
      </label>
      <h3>GC Content</h3>
      <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
        <input type="checkbox" className="mdl-checkbox__input" />
        <input className="mdl-slider mdl-js-slider" type="range" min="0" max="100" value="25" tabIndex="0" />
      </label>
    </section> */}
  </aside>
);
