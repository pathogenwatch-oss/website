import React from 'react';

export default ({ genome }) => {
  const { poppunk, speciator } = genome.analysis;
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Strain</h2>
        <a href="https://www.pneumogen.net/gps/">
          The Global Pneumococcal Sequencing Project
        </a>
      </header>
      <dl className="pw-genome-report-unsized">
        <div className="pw-genome-report-metadata">
          <dt>GPSC</dt>
          <dd>{poppunk.strain}</dd>
        </div>
      </dl>
      <div className="pw-genome-report-external-link">
        <a
          className="pw-genome-report-link"
          href={`/genomes/all?genusId=${speciator.genusId}&speciesId=${
            speciator.speciesId
          }&strain=${poppunk.strain}`}
          target="_blank"
          rel="noopener"
        >
          View similar genomes
        </a>
        <i className="material-icons">launch</i>
      </div>
    </React.Fragment>
  );
};
