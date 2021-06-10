import React from 'react';

export default ({ result }) => {
  return (
    <React.Fragment>
          <header className="pw-genome-report-section-header">
      <h2>Other markers</h2>
    </header>
      <dl className="flex">
        <div className="pw-genome-report-metadata">
          <dt>PorA</dt>
          <dd>{result.status.toUpperCase() === 'PRESENT' ? 'Complete' : result.status}</dd>
        </div>
      </dl>
    </React.Fragment>
  )
}
