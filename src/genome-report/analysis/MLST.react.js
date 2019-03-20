import React from 'react';

import { Metadata } from '../components';

import { ST, Hit } from '../../mlst';

export default ({ result }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Multilocus Sequence Typing (MLST)</h2>
      <a href={result.url} target="_blank" rel="noopener">
        {result.url}
      </a>
    </header>
    <Metadata label="Sequence Type">
      <ST id={result.st} />
    </Metadata>
    <table className="pw-mlst-profile" cellSpacing="0">
      <caption>Profile</caption>
      <thead>
        <tr>
          {result.alleles.map(({ gene }) => (
            <th key={gene}>{gene}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {result.alleles.map(({ gene, hits }) => (
            <td key={gene}>
              {hits.length ? (
                hits.map(id => <Hit key={id} id={id} />)
              ) : (
                <span title="Not Found">&mdash;</span>
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </React.Fragment>
);
