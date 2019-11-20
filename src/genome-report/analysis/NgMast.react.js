import React from 'react';

import ExternalLink from '../ExternalLink.react';

export default ({ result }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>NG-MAST</h2>
      <p>
        <a href="https://github.com/MDU-PHL/ngmaster" target="_blank" rel="noopener">
          https://github.com/MDU-PHL/ngmaster
        </a>
      </p>
    </header>
    <div>
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
      <ExternalLink
        to={`/genomes/all?genusId=482&speciesId=485&ngmast=${result.ngmast}`}
      >
        View all type {result.ngmast}
      </ExternalLink>
    </div>
  </React.Fragment>
);
