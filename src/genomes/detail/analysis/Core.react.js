import React from 'react';

export default ({ result: { fp, summary } }) => (
  <div>
    <dl>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">WGSA Reference</dt>
        <dd className="wgsa-hub-stats-value">{fp.reference}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">Core Matches</dt>
        <dd className="wgsa-hub-stats-value">{summary.kernelSize}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">% Core Families</dt>
        <dd className="wgsa-hub-stats-value">{summary.percentKernelMatched}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">% Non-Core</dt>
        <dd className="wgsa-hub-stats-value">{(100 - summary.percentAssemblyMatched).toFixed(1)}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">Complete Alleles</dt>
        <dd className="wgsa-hub-stats-value">{summary.completeAlleles}</dd>
      </span>
      <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
        <dt className="wgsa-hub-stats-heading">Families Matched</dt>
        <dd className="wgsa-hub-stats-value">{summary.familiesMatched}</dd>
      </span>
    </dl>
  </div>
);
