import React from 'react';

import ExternalLink from '../ExternalLink.react';
import { Metadata } from '../components';
import { ST, Hit } from '../../mlst';

export default ({ genome }) => {
  const { mlst, speciator } = genome.analysis;
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Multilocus Sequence Typing (MLST)</h2>
        <p>
          <a href={mlst.url} target="_blank" rel="noopener">
            {mlst.url}
          </a>
        </p>
      </header>
      <div>
        <dl className="pw-genome-report-unsized">
          <Metadata label="Sequence Type">
            <ST id={mlst.st} />
          </Metadata>
        </dl>
        <ExternalLink
          to={`/genomes/all?genusId=${speciator.genusId}&speciesId=${
            speciator.speciesId
          }&st=${mlst.st}`}
        >
          View all ST {mlst.st}
        </ExternalLink>
      </div>
      <table className="pw-mlst-profile" cellSpacing="0">
        <caption>Profile</caption>
        <thead>
          <tr>
            {mlst.alleles.map(({ gene }) => (
              <th key={gene}>{gene}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {mlst.alleles.map(({ gene, hits }) => (
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
};
