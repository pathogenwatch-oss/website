import React from 'react';

import ExternalLink from '../ExternalLink.react';

function generateDocLink(variant) {
  return (
    <div>
      <p>{variant.state !== 'other' ? variant.name : `${variant.name} (${variant.found})` }
        <ExternalLink to={`https://cgps.gitlab.io/cog-uk/type_variants/#${variant.name}`}>
          {'Source'}
        </ExternalLink>
      </p>
    </div>
  );
}

function generateColumn(variants, type) {
  return (
    <div className="pw-genome-report-metadata">
      <dt>{type}</dt>
      <dd>{
        variants
          .filter(variant => variant.state !== 'ref')
          .filter(variant => variant.type === type)
          .sort((a,b) => a.name < b.name ? -1 : 1)
          .map(variant => generateDocLink(variant))
      }</dd>
    </div>
  );
}

export default ({ genome }) => {
  const { "sarscov2-variants": sarscov2Variants } = genome.analysis;
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Notable Variants</h2>
        <a
          href="https://cgps.gitlab.io/cog-uk/type_variants/"
          target="_blank"
          rel="noopener"
          title="View complete list of variants at GitLab."
        >
            https://cgps.gitlab.io/cog-uk/type_variants/
        </a>
      </header>
      {sarscov2Variants.alt_count === 0 && <p>No notable variants found.</p>}
      {sarscov2Variants.alt_count > 0 &&
      <dl className="grid">
        {
          [ 'Amino Acid', 'Deletion', 'SNP' ]
            .map(type => generateColumn(sarscov2Variants.variants, type))
        }
      </dl>
      }
    </React.Fragment>
  );
};
