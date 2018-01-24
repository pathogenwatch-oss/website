import React from 'react';

export default ({ result: { fp, summary } }) => (
  <dl>
    <div>
      <dt>WGSA Reference</dt>
      <dd>{fp.reference}</dd>
    </div>
    <div>
      <dt>Core Matches</dt>
      <dd>{summary.kernelSize}</dd>
    </div>
    <div>
      <dt>% Core Families</dt>
      <dd>{summary.percentKernelMatched}</dd>
    </div>
    <div>
      <dt>% Non-Core</dt>
      <dd>{(100 - summary.percentAssemblyMatched).toFixed(1)}</dd>
    </div>
    <div>
      <dt>Complete Alleles</dt>
      <dd>{summary.completeAlleles}</dd>
    </div>
    <div>
      <dt>Families Matched</dt>
      <dd>{summary.familiesMatched}</dd>
    </div>
  </dl>
);
