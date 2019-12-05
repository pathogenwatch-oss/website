import React from 'react';
import { Name } from '../../branding';

export default ({ result: { fp, summary } }) => (
  <React.Fragment>
    <h2>Core stats</h2>
    <dl className="grid">
      <div>
        <dt>Core matches</dt>
        <dd>{summary.kernelSize}</dd>
      </div>
      <div>
        <dt>Core families</dt>
        <dd>{summary.percentKernelMatched}%</dd>
      </div>
      <div>
        <dt>Non-core</dt>
        <dd>{(100 - summary.percentAssemblyMatched).toFixed(1)}%</dd>
      </div>
      <div>
        <dt>Complete alleles</dt>
        <dd>{summary.completeAlleles}</dd>
      </div>
      <div>
        <dt>Families matched</dt>
        <dd>{summary.familiesMatched}</dd>
      </div>
      <div>
        <dt><Name /> reference</dt>
        <dd>{fp.reference}</dd>
      </div>
    </dl>
  </React.Fragment>
);
