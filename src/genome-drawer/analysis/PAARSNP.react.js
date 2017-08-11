import React from 'react';

import { Section, Metadata } from './components';

export default ({ result }) => (
  <Section heading="PAARSNP" version={result.__v}>
    <dl className="wgsa-hub-stats-view">
      <Metadata large label="Antibiotics">
        <table>
          <thead>
            <tr>
              { Object.keys(result.antibiotics).map(key => <th key={key}>{key}</th>) }
            </tr>
          </thead>
          <tbody>
            <tr>
              { Object.keys(result.antibiotics).map(key => {
                const { state } = result.antibiotics[key];
                return (
                  <td key={key}>
                    { state !== 'UNKNOWN' &&
                      <i
                        title={state}
                        className={`material-icons wgsa-amr--${state.toLowerCase()}`}
                      >
                        lens
                      </i> }
                  </td>
                );
              }) }
            </tr>
          </tbody>
        </table>
      </Metadata>
      <Metadata label="SNPs">{result.snp.join(', ')}</Metadata>
      <Metadata label="Genes">{result.paar.join(', ')}</Metadata>
    </dl>
  </Section>
);
