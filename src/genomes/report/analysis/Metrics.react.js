import React from 'react';

import N50Chart from './N50Chart.react';

export default ({ result }) => (
  <React.Fragment>
    <h2>Assembly Metrics</h2>
    <dl className="wgsa-genome-detail-stats-compact">
      <div>
        <dt>Genome Length</dt>
        <dd>{result.length}</dd>
      </div>
      <div>
        <dt>No. Contigs</dt>
        <dd>{result.contigs}</dd>
      </div>
      <div>
        <dt>Smallest Contig</dt>
        <dd>{result.smallestContig}</dd>
      </div>
      <div>
        <dt>Largest Contig</dt>
        <dd>{result.largestContig}</dd>
      </div>
      <div>
        <dt>Average Contig Length</dt>
        <dd>{result.averageContig}</dd>
      </div>
      <div>
        <dt>N50</dt>
        <dd>{result.N50}</dd>
      </div>
      <div>
        <dt>Non-ATCG</dt>
        <dd>{result.nonATCG}</dd>
      </div>
      <div>
        <dt>GC Content</dt>
        <dd>{result.gcContent}%</dd>
      </div>
    </dl>
    <figure>
      <figcaption>N50 chart</figcaption>
      <N50Chart metrics={result} />
    </figure>
  </React.Fragment>
);
