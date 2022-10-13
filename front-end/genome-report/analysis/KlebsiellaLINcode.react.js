import React from 'react';
import Methods from '@cgps/phylocanvas/methods';
import { Metadata } from '~/genome-report/components';
import { ST } from '~/mlst';

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
          <dt>Sublineage</dt>
          <dd>{result.Sublineage !== '' ? result.Sublineage : 'New'}</dd>
        </div>
       <div className="pw-genome-report-metadata">
          <dt>Clonal group</dt>
          <dd>{result['Clonal Group'] !== '' ? result['Clonal Group'] : 'New'}</dd>
        </div>
        <div className="pw-genome-report-metadata">
          <dt>LIN code</dt>
          <dd>{result.LINcode.join("_")}</dd>
        </div>
      </dl>
      <dl className="grid">
        <Metadata label="Core genome sequence type">
          <ST id={result.cgST} />
        </Metadata>
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
              <dt>Identity</dt>
              <dd>{`${result.identity}% (${result.identical}/${result.comparedLoci})`}</dd>
            </div>
          ) : null
        }
      </dl>
    </div>
  </React.Fragment>
  );
};
