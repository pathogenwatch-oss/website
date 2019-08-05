import React from 'react';

export default ({ result }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>NG-MAST</h2>
      <a href="https://github.com/MDU-PHL/ngmaster" target="_blank" rel="noopener">
        https://github.com/MDU-PHL/ngmaster
      </a>
    </header>
    <dl className="flex">
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
