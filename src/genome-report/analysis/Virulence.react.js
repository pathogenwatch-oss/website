import React from 'react';

import KleborateVirulence from './KleborateVirulence.react';

export default ({ genome }) => {
  const { kleborate } = genome.analysis;

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Virulence</h2>
      </header>
      {!!kleborate && <KleborateVirulence result={kleborate}/>}
    </React.Fragment>
  )
}
