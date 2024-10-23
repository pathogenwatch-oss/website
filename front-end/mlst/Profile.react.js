import React from 'react';

import Hit from './Hit.react';

export default ({ alleles = [] }) => (
  <span className="wgsa-mlst-profile">
    { alleles.map(({ gene, hit }) => (
      <span key={gene} className="wgsa-mlst-profile-section">
        { !!hit && hit !== "" ?
          <Hit key={hit} id={hit} showNovelHash /> :
          <span title="Not found">?</span> }
      </span>
    ))}
  </span>
);
