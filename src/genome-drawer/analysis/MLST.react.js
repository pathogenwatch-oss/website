import React from 'react';

import { Section, Metadata } from './components';

// const checksumLength = 40;

const Hit = ({ id }) => {
  if (isNaN(id)) {
    return (
      <i className="material-icons wgsa-mlst-profile-hit novel" title={id}>new_releases</i>
    );
  }
  return <span className="wgsa-mlst-profile-hit">{id}</span>;
};

export default ({ result }) => (
  <Section heading="MLST" version={result.__v}>
    <dl className="wgsa-hub-stats-view">
      <Metadata label="Sequence Type" title={result.st}>{result.st.slice(0, 8)}</Metadata>
      <Metadata label="Scheme">
        <a href={result.url} target="_blank" rel="noopener">{result.url}</a>
      </Metadata>
      <Metadata large label="Profile">
        <table className="wgsa-mlst-profile">
          <thead>
            <tr>
              { result.alleles.map(([ gene ]) => <th key={gene}>{gene}</th>) }
            </tr>
          </thead>
          <tbody>
            <tr>
              { result.alleles.map(([ gene, hits ]) =>
                <td key={gene}>
                  {hits.length ?
                    hits.map(({ id }) => <Hit key={id} id={id} />) :
                    <span title="Not Found">&mdash;</span>
                  }
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </Metadata>
    </dl>
  </Section>
);
