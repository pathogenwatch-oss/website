import React from 'react';

export default ({ heading, description, value }) => (
  <div className="wgsa-chart-tooltip">
    <h3 className="wgsa-chart-tooltip__heading">{heading}</h3>
    <dl>
      <dt>{description}</dt>
      <dd>{value}</dd>
    </dl>
  </div>
);
