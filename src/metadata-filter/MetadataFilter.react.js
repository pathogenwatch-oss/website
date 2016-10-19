import React from 'react';

export default ({ title, summary, onClick }) => (
  summary.length ?
    <section className="wgsa-filter__section">
      <h3>{title}</h3>
      { summary.map(({ name, label, count, active }) =>
        <button
          key={name}
          title={name}
          className={`mdl-chip mdl-chip--contact ${active ? 'mdl-chip--active' : ''}`.trim()}
          onClick={() => onClick(name)}
        >
          <span className="mdl-chip__contact">{count}</span>
          <span className="mdl-chip__text">{label || name}</span>
        </button>
      )}
    </section> : null
);
