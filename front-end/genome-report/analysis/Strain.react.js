import React from 'react';

import ExternalLink from '../ExternalLink.react';

const mailto = 'mailto:gps@pneumogen.net?subject=Novel strain assignment&body=(Please attach your assembly to this email)';

function check(poppunk2) {
  if (!('email' in poppunk2)) {
    poppunk2.email = "gps@pneumogen.net";
    poppunk2.url = "https://www.pneumogen.net/gps/";
    poppunk2.source = "The Global Pneumococcal Sequencing Project";
    poppunk2.label = "GPSC";
  }
}

export default ({ genome }) => {

  const { poppunk2, speciator } = genome.analysis;

  // backwards compatibility shim
  check(poppunk2);
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Strain</h2>
        <p>
          <a href={poppunk2.url}>
            {poppunk2.source}
          </a>
        </p>
      </header>
      <dl className="pw-genome-report-unsized">
        <div className="pw-genome-report-metadata">
          <dt>{poppunk2.label}</dt>
          <dd>
            {poppunk2.strain}
            {poppunk2.strain.toLowerCase() === 'Not assigned' && genome.owner === 'me' &&
              <a href={mailto} target="_blank" rel="noopener" className="pw-genome-report-secondary-link">
                Submit for assignment
              </a>
            }
          </dd>
        </div>
      </dl>
      <ExternalLink to={`/genomes/all?genusId=${speciator.genusId}&speciesId=${speciator.speciesId}&strain=${poppunk2.strain}`}>
        View all {poppunk2.label} {poppunk2.strain}
      </ExternalLink>
    </React.Fragment>
  );
};
