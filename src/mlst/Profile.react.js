import React from 'react';

import Hit from './Hit.react';

export default ({ alleles = [] }) => (
  <span className="wgsa-mlst-profile">
    { alleles.map(({ gene, hits }) => (
      <span key={gene} className="wgsa-mlst-profile-section">
        { hits.length ?
          hits.map(id => <Hit key={id} id={id} showNovelHash />) :
          <span title="Not found">?</span> }
      </span>
    ))}
  </span>
);
