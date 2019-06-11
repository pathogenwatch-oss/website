import React from 'react';

import PAARSNP from './PAARSNP.react';
import KleborateAMR from './KleborateAMR.react';

export default ({ genome }) => {
  const { paarsnp, kleborate } = genome.analysis;

  return (
    <React.Fragment>
      <h2>Antimicrobial Resistance (AMR)</h2>
      {!!paarsnp && <PAARSNP result={paarsnp} genome={genome} />}
      {!!kleborate && <KleborateAMR result={kleborate} />}
    </React.Fragment>
  );
};
