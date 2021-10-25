import React from 'react';

import ExternalLink from '../ExternalLink.react';

const mailto = 'mailto:gps@pneumogen.net?subject=Novel strain assignment&body=(Please attach your assembly to this email)';

export default ({ genome }) => {
  const { poppunk2, speciator } = genome.analysis;
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
          <dd>
            {poppunk2.strain}
            {poppunk2.strain === 'novel' && genome.owner === 'me' &&
              <a href={mailto} target="_blank" rel="noopener" className="pw-genome-report-secondary-link">
                Submit for assignment
              </a>
            }
          </dd>
        </div>
      </dl>
      <ExternalLink
        to={`/genomes/all?genusId=${speciator.genusId}&speciesId=${
          speciator.speciesId
        }&strain=${poppunk2.strain}`}
      >
        View all GPSC {poppunk2.strain}
      </ExternalLink>
    </React.Fragment>
  );
};
