import React from 'react';

import { formatMlstSource, getSourceUrl, formatSchemeName } from '~/utils/mlst';
import ExternalLink from '../ExternalLink.react';
import { Metadata } from '../components';
import { ST, Hit } from '../../mlst';

export default ({ result, speciator, filterKey = 'mlst', heading = 'MLST – Multilocus sequence typing' }) => {
  const alleles = result.alleles.map(_ => {
    const split = _.gene.split('_');
    return {
      gene: split[1] || split[0],
      hit: _.hit,
    };
  });
  const source = "source" in result ? result.source : result.schemeName;
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>{heading}</h2>
        <p>
            <a
              href={getSourceUrl(source)}
              target="_blank" rel="noopener">
              Source: {result.schemeName !== source ? `${formatSchemeName(result.schemeName)} - ${formatMlstSource(source)}` : `${formatSchemeName(result.schemeName)}`}
          </a>
        </p>
      </header>
      <div className="pw-genome-report-column one third">
        <dl>
          <Metadata label="Sequence type">
            <ST id={result.st} />
          </Metadata>
        </dl>
        <ExternalLink
          to={`/genomes/all?genusId=${speciator.genusId}&speciesId=${
            speciator.speciesId
          }&${filterKey}=${result.st}`}
        >
          View all ST <ST id={result.st} textOnly />
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
              {alleles.map(({ gene, hit }) => (
                <td key={gene}>
                  { !!hit && hit !== "" ?
                   <Hit key={hit} id={hit} showNovelHash /> :
                   <span title="Not found">?</span> }
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};
