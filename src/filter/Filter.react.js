import './styles.css';

import React from 'react';
import classnames from 'classnames';

const FilterInput = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search"
    value={value}
    onChange={onChange}
  />
);

const ClearFilterButton = ({ onClick }) => (
  <button
    className="mdl-button mdl-js-button mdl-button--primary"
    onClick={onClick}
  >
    Clear Filters
  </button>
);

export default ({ active, text, clear, children }) => (
  <aside className={classnames('wgsa-filter', { 'wgsa-filter--active': active })}>
    <header className="wgsa-filter__header mdl-layout__header mdl-layout__header--scroll">
      <label className="wgsa-filter__search">
        <i className="material-icons">search</i>
        <FilterInput {...text} />
      </label>
    </header>
    <div className="wgsa-filter__content">
      { children }
    </div>
    <footer className="wgsa-filter__footer">
      <ClearFilterButton onClick={clear} />
    </footer>
  </aside>
);
