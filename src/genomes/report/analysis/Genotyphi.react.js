import React from 'react';

export default ({ result }) => (
  <React.Fragment>
    <h2>Genotyphi</h2>
    <dl>
      <div>
        <dt>Genotype</dt>
        <dd>{result.genotype}</dd>
      </div>
      <div>
        <dt>SNPs Called</dt>
        <dd>{result.foundLoci}</dd>
      </div>
    </dl>
  </React.Fragment>
);
