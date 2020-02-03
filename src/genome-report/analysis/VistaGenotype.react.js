import React from 'react';

export default ({ genome }) => {
  const { vista } = genome.analysis;
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Genotypes</h2>
      </header>
      <dl className="flex">{
        [ 'Biotype', 'Serogroup' ].map(key => (
          <div className="pw-genome-report-metadata">
            <dt>{key}</dt>
            <dd>{vista[key.toLowerCase()]}</dd>
          </div>
        ))
      }
      </dl>
    </React.Fragment>
  );
};
