import React from 'react';

import PAARSNP from './PAARSNP.react';
import KleborateAMR from './KleborateAMR.react';
import SpnPbpAMR from './SpnPbpAMR.react';

export default ({ genome }) => {
  const { paarsnp, kleborate, spn_pbp_amr } = genome.analysis;

  return (
    <React.Fragment>
      <h2>Antimicrobial Resistance (AMR)</h2>
      {!!paarsnp && <PAARSNP result={paarsnp} genome={genome} />}
      {!!kleborate && <KleborateAMR result={kleborate} />}
      {!!spn_pbp_amr && <SpnPbpAMR result={spn_pbp_amr} />}
    </React.Fragment>
  );
};
