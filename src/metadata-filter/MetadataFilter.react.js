import React from 'react';
import classnames from 'classnames';

export default ({ heading, summary, onClick }) => (
  summary.length ?
    <section className="wgsa-filter__section">
      <h3>{heading}</h3>
      { summary.map(({ key, title, label, count, active }) =>
        <button
          key={key}
          title={title || label}
          className={classnames(
            'mdl-chip mdl-chip--contact',
            { 'mdl-chip--active': active }
          )}
          onClick={() => onClick(key)}
        >
          <span className="mdl-chip__contact">{count}</span>
          <span className="mdl-chip__text">{label || key}</span>
        </button>
      )}
    </section> : null
);
