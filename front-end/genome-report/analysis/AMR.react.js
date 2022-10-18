import React from 'react';

import PAARSNP from './PAARSNP.react';
import KleborateAMR from './KleborateAMR.react';
import SpnPbpAMR from './SpnPbpAMR.react';

export default ({ genome }) => {
  const { paarsnp, kleborate, spn_pbp_amr } = genome.analysis;

  return (
    <React.Fragment>
      <h2>AMR - Antimicrobial resistance</h2>
      {(!!paarsnp && !kleborate) && <PAARSNP result={paarsnp} genome={genome} />}
      {!!kleborate && <KleborateAMR result={kleborate} />}
      {!!spn_pbp_amr && <SpnPbpAMR result={spn_pbp_amr} />}
    </React.Fragment>
  );
};
