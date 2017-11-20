import React from 'react';

import { Metadata } from '../components';

import { ST, Hit } from '../../../mlst';

export default ({ result }) => (
  <dl>
    <Metadata label="Sequence Type"><ST id={result.st} /></Metadata>
    <Metadata label="Scheme">
      <a href={result.url} target="_blank" rel="noopener">{result.url}</a>
    </Metadata>
    <Metadata large label="Profile">
      <table className="wgsa-mlst-profile">
        <thead>
          <tr>
            { result.alleles.map(({ gene }) => <th key={gene}>{gene}</th>) }
          </tr>
        </thead>
        <tbody>
          <tr>
            { result.alleles.map(({ gene, hits }) =>
              <td key={gene}>
                {hits.length ?
                  hits.map(id => <Hit key={id} id={id} />) :
                  <span title="Not Found">&mdash;</span> }
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </Metadata>
  </dl>
);
