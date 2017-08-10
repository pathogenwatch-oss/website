import React from 'react';
import classnames from 'classnames';

function hasValue(value) {
  return (
    typeof value !== 'undefined' && value !== null
  );
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
    <dd className="wgsa-hub-stats-value">{children}</dd>
  </span> :
  null
);

export const Section = ({ heading, version, children }) => (
  <div className="wgsa-analysis-section">
    <h2 className="wgsa-analysis-view-title">
      {heading}
      <span className="wgsa-analysis-version">v{version}</span>
    </h2>
    {children}
  </div>
);
