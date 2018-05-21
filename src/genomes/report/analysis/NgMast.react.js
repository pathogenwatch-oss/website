import React from 'react';

export default ({ result }) => (
  <React.Fragment>
    <h2>NG-MAST</h2>
    <dl className="wgsa-genome-report-stats-compact">
      <div>
        <dt>NG-MAST</dt>
        <dd>{result.ngmast}</dd>
      </div>
      <div>
        <dt>POR</dt>
        <dd>{result.por}</dd>
      </div>
      <div>
        <dt>TBPB</dt>
        <dd>{result.tbpb}</dd>
      </div>
    </dl>
  </React.Fragment>
);
