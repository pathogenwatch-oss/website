import React from 'react';
import classnames from 'classnames';

function hasValue(value) {
  return (
    value !== '' && typeof value !== 'undefined' && value !== null
  );
}

function formatValue(value) {
  if (React.isValidElement(value)) return value;

  if (Array.isArray(value)) {
    return <em>Array</em>;
  }

  if (typeof value === 'object') {
    return <em>Object</em>;
  }

  return value;
}

export const Metadata = ({ title, large = false, label, children }) => (
  hasValue(children) ?
  <span
    className={classnames(
      'wgsa-hub-stats-section',
      large ? 'wgsa-hub-stats-section--large' : 'wgsa-hub-stats-section--small'
    )}
    title={title}
  >
    <dt className="wgsa-hub-stats-heading">{label}</dt>
    <dd className="wgsa-hub-stats-value">{formatValue(children)}</dd>
  </span> :
  null
);

export const Section = ({ heading, version, children }) => (
  <div className="wgsa-analysis-section">
    <h2 className="wgsa-analysis-title">
      {heading}
      { version && <span className="wgsa-analysis-version">{version}</span> }
    </h2>
    {children}
  </div>
);
