import React from 'react';

import ExternalLink from '../ExternalLink.react';

export default ({ genome }) => {
  const { poppunk, speciator } = genome.analysis;
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Strain</h2>
        <p>
          <a href="https://www.pneumogen.net/gps/">
            The Global Pneumococcal Sequencing Project
          </a>
        </p>
      </header>
      <dl className="pw-genome-report-unsized">
        <div className="pw-genome-report-metadata">
          <dt>GPSC</dt>
          <dd>{poppunk.strain}</dd>
        </div>
      </dl>
      <ExternalLink
        to={`/genomes/all?genusId=${speciator.genusId}&speciesId=${
          speciator.speciesId
        }&strain=${poppunk.strain}`}
      >
        View all GPSC {poppunk.strain}
      </ExternalLink>
    </React.Fragment>
  );
};
