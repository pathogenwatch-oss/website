import React from 'react';

import N50Chart from './N50Chart.react';

export default ({ result }) => (
  <React.Fragment>
    <h2>Assembly stats</h2>
    <dl className="grid">
      <div>
        <dt>Genome length</dt>
        <dd>{result.length}</dd>
      </div>
      {result.contigs !== 1 &&
      <div>
        <dt>No. contigs</dt>
        <dd>{result.contigs}</dd>
      </div>}
      {result.contigs !== 1 &&
      <div>
        <dt>Smallest contig</dt>
        <dd>{result.smallestContig}</dd>
      </div>}
      {result.contigs !== 1 &&
      <div>
        <dt>Largest contig</dt>
        <dd>{result.largestContig}</dd>
      </div>}
      {result.contigs !== 1 &&
      <div>
        <dt>Average contig length</dt>
        <dd>{result.averageContig}</dd>
      </div>}
      {result.contigs !== 1 &&
      <div>
        <dt>N50</dt>
        <dd>{result.N50}</dd>
      </div>}
      <div>
        <dt>Non-ATCG</dt>
        <dd>{result.nonATCG}</dd>
      </div>
      <div>
        <dt>GC content</dt>
        <dd>{result.gcContent}%</dd>
      </div>
    </dl>
    {result.contigs !== 1 && <figure>
      <figcaption>N50 chart</figcaption>
      <N50Chart metrics={result} />
    </figure>}
  </React.Fragment>
);
