import React from 'react';

import KleborateVirulence from './KleborateVirulence.react';
import Vista from './Vista.react';

export default ({ genome }) => {
  const { kleborate, vista } = genome.analysis;

  return (
    <React.Fragment>
      <h2>Virulence</h2>
      {!!kleborate && <KleborateVirulence result={kleborate} />}
      {!!vista && <Vista result={vista} />}
    </React.Fragment>
  );
};
