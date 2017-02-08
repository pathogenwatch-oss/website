import React from 'react';
import classnames from 'classnames';

export default ({ title, summary, onClick }) => (
  summary.length ?
    <section className="wgsa-filter__section">
      <h3>{title}</h3>
      { summary.map(({ name, label, count, active }) =>
        <button
          key={name}
          title={typeof label === 'string' ? label : name}
          className={classnames(
            'mdl-chip mdl-chip--contact',
            { 'mdl-chip--active': active }
          )}
          onClick={() => onClick(name)}
        >
          <span className="mdl-chip__contact">{count}</span>
          <span className="mdl-chip__text">{label || name}</span>
        </button>
      )}
    </section> : null
);
