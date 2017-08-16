import React from 'react';

import { Section, Metadata } from '../components';

export default ({ __v, antibiotics = {}, snp =[], paar = [] }) => (
  <Section heading="PAARSNP" version={__v}>
    <dl className="wgsa-hub-stats-view">
      <Metadata large label="Antibiotics">
        <table>
          <thead>
            <tr>
              { Object.keys(antibiotics).map(key => <th key={key}>{key}</th>) }
            </tr>
          </thead>
          <tbody>
            <tr>
              { Object.keys(antibiotics).map(key => {
                const { state } = antibiotics[key];
                return (
                  <td key={key}>
                    { state !== 'UNKNOWN' && state !== 'NOT_FOUND' &&
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
      <Metadata label="SNPs">{snp.join(', ')}</Metadata>
      <Metadata label="Genes">{paar.join(', ')}</Metadata>
    </dl>
  </Section>
);
