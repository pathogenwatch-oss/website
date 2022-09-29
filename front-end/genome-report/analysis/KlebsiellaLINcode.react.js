import React from 'react';

export default ({ result }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>cgMLST classification – Core genome MLST profile comparison</h2>
    </header>
    <div>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>Closest cgST (mismatches)</dt>
          <dd>{result.cgST} ({result.mismatches}/{result.schemeSize})</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>LINcode</dt>
          <dd>{result.LINcode.map(code => code !== "" && code !== "*" ? code : '?').join("_")}</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Clonal group</dt>
          <dd>{result['Clonal Group'] !== '' ? result['Clonal Group'] : 'New'}</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Sublineage</dt>
          <dd>{result.Sublineage !== '' ? result.Sublineage : 'New'}</dd>
        </div>
      </dl>
    </div>
  </React.Fragment>
);
