import './styles.css';

import React from 'react';
import classnames from 'classnames';

export default ({ active, loading, textValue, textOnChange, clear, children }) => (
  <aside className={classnames('wgsa-filter', { 'wgsa-filter--active': active })}>
    <header className="wgsa-filter__header">
      <label className="wgsa-filter__search">
        <i className="material-icons">search</i>
        <input
          type="text"
          placeholder="Search"
          value={textValue}
          onChange={textOnChange}
        />
      </label>
    </header>
    <div className="wgsa-filter__content">
      { children.map(c => React.cloneElement(c, { isLoading: loading })) }
    </div>
    <footer className="wgsa-filter__footer">
      <button
        className="mdl-button mdl-js-button mdl-button--primary"
        onClick={clear}
      >
        Clear Filters
      </button>
    </footer>
  </aside>
);
