import React from 'react';

import ExternalLink from '../ExternalLink.react';
import { Metadata } from '../components';
import { ST, Hit } from '../../mlst';

export default ({ result, speciator, filterKey = 'mlst', heading, label }) => {
  const alleles = result.alleles.map(_ => {
    const split = _.gene.split('_');
    return {
      gene: split[1] || split[0],
      hits: _.hits,
    };
  });
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>{heading || 'Multilocus Sequence Typing (MLST)'}</h2>
        <p>
          <a href={result.url} target="_blank" rel="noopener">
            {result.url}
          </a>
        </p>
      </header>
      <div className="pw-genome-report-column one third">
        <dl>
          <Metadata label={label || 'Sequence Type'} className="pw-capitalise">
            <ST id={result.st} />
          </Metadata>
        </dl>
        <ExternalLink
          to={`/genomes/all?genusId=${speciator.genusId}&speciesId=${
            speciator.speciesId
          }&${filterKey}=${result.st}`}
        >
          View all {label || 'ST'} <ST id={result.st} textOnly />
        </ExternalLink>
      </div>
      <div className="pw-genome-report-column two thirds">
        <table className="pw-mlst-profile" cellSpacing="0">
          <caption>Profile</caption>
          <thead>
            <tr>
              {alleles.map(({ gene }) => (
                <th key={gene}>{gene}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {alleles.map(({ gene, hits }) => (
                <td key={gene}>
                  {hits.length ? (
                    hits.map(id => <Hit key={id} id={id} />)
                  ) : (
                    <span title="Not found">?</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};
