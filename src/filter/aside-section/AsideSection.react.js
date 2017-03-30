import React from 'react';
import classnames from 'classnames';

export default ({ heading, summary, updateFilter, filterKey }) => (
  summary.length ?
    <section className="wgsa-filter__section">
      <h3>{heading}</h3>
      { summary.map(({ value, title, label, count, active }) =>
        <button
          key={value}
          title={title || label}
          className={classnames(
            'mdl-chip mdl-chip--contact',
            { 'mdl-chip--active': active }
          )}
          onClick={() => updateFilter(filterKey, value)}
        >
          <span className="mdl-chip__contact">{count}</span>
          <span className="mdl-chip__text">{label || value}</span>
        </button>
      )}
    </section> : null
);
