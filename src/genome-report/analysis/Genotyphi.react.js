import React from 'react';

import ExternalLink from '../ExternalLink.react';

export default ({ result }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Genotyphi</h2>
      <p>
        <a href="https://github.com/katholt/genotyphi" target="_blank" rel="noopener">
          https://github.com/katholt/genotyphi
        </a>
      </p>
    </header>
    <dl className="flex">
      <div>
        <dt>Genotype</dt>
        <dd>{result.genotype}</dd>
      </div>
      <div>
        <dt>SNPs called</dt>
        <dd>{result.foundLoci}</dd>
      </div>
    </dl>
    <ExternalLink
      to={`/genomes/all?organismId=90370&genotype=${result.genotype}`}
    >
      View all genotype {result.genotype}
    </ExternalLink>
  </React.Fragment>
);
