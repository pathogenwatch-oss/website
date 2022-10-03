import React from 'react';

const definedCgstPatten = /^\d+$/;

export default ({ result }) => {
  return (
    <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>cgMLST classification – Core genome MLST profile comparison</h2>
    </header>
     <div>

      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>Clonal group</dt>
          <dd>{result['Clonal Group'] !== '' ? result['Clonal Group'] : 'New'}</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>Sublineage</dt>
          <dd>{result.Sublineage !== '' ? result.Sublineage : 'New'}</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>LINcode</dt>
          <dd>{result.LINcode.map(code => code !== "" && code !== "*" ? code : '?').join("_")}</dd>
        </div>
      </dl>
      <dl className="grid">
        <div className="pw-genome-report-metadata">
          <dt>cgST</dt>
          <dd>{definedCgstPatten.test(result.cgST) ? result.cgST : `*${result.cgST.slice(0, 4)}`}</dd>
        </div>
        {
          !(definedCgstPatten.test(result.cgST)) ? (
            <div className="pw-genome-report-metadata">
              <dt>Closest defined cgST(s)</dt>
              <dd>{result['Closest cgST']}</dd>
            </div>
          ) : null
        }
        {
          !(definedCgstPatten.test(result.cgST)) ? (
            <div className="pw-genome-report-metadata">
              <dt>Mismatches</dt>
              <dd>{result.mismatches}/{result.schemeSize}</dd>
            </div>
          ) : null
        }
      </dl>
    </div>
  </React.Fragment>
  );
};
