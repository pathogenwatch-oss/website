import React from 'react';

export default ({ genotype, foundLoci }) => (
  <div>
    <h2>Genotyphi</h2>
    <dl>
      <div>
        <dt>Genotype</dt>
        <dd>{genotype}</dd>
      </div>
      <div>
        <dt>SNPs Called</dt>
        <dd>{foundLoci}</dd>
      </div>
    </dl>
  </div>
);
