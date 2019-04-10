import React from 'react';

import PAARSNP from './PAARSNP.react'
import KleborateAMR from './KleborateAMR.react'

export default ({ genome }) => {

  const { paarsnp, kleborate } = genome.analysis;

  return (
    <React.Fragment>
      <header className="pw-genome-report-section-header">
        <h2>Antimicrobial Resistance (AMR)</h2>
      </header>

      {!!paarsnp && <PAARSNP result={paarsnp} genome={genome} />}
      {!!kleborate && <KleborateAMR result={kleborate}/>}
    </React.Fragment>
  )
}
