import React from 'react';

import Hit from './Hit.react';

export default ({ alleles = [] }) => (
  <span className="wgsa-mlst-profile">
    {alleles.map(({ hits }) =>
      <span className="wgsa-mlst-profile-section">
        {hits.map(id => <Hit id={id} textOnly />)}
      </span>
    )}
  </span>
);
