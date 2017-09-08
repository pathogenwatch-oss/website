import React from 'react';

import { isNovel } from '../../utils/mlst';

import { Section, Metadata } from '../components';

import ST from './ST.react';

const Hit = ({ id }) => {
  if (isNovel(id)) {
    return (
      <i
        className="material-icons wgsa-mlst-profile-hit"
        title={`Novel allele: ${id}`}
      >
        new_releases
      </i>
    );
  }
  return <span className="wgsa-mlst-profile-hit">{id}</span>;
};

export default ({ result }) => (
  <Section heading="MLST" version={result.__v}>
    <dl className="wgsa-hub-stats-view">
      <Metadata label="Sequence Type"><ST id={result.st} /></Metadata>
      <Metadata label="Scheme">
        <a href={result.url} target="_blank" rel="noopener">{result.url}</a>
      </Metadata>
      <Metadata large label="Profile">
        <table className="wgsa-mlst-profile">
          <thead>
            <tr>
              { Object.keys(result.alleles).map(gene => <th key={gene}>{gene}</th>) }
            </tr>
          </thead>
          <tbody>
            <tr>
              { Object.keys(result.alleles).map(gene =>
                <td key={gene}>
                  {result.alleles[gene].length ?
                    result.alleles[gene].map(({ id }) => <Hit key={id} id={id} />) :
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
