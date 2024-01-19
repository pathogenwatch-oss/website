import React from 'react';

export default ({ genome }) => {
  const { vista } = genome.analysis;
  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Genotypes</h2>
      </header>
      <dl className="flex">{
        <div>
          <dt>Serogroup</dt>
          <dd>{vista.serogroup}</dd>
        </div>
      }
      </dl>
    </React.Fragment>
  );
};
