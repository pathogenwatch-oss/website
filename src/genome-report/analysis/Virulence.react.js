import React from 'react';

import KleborateVirulence from './KleborateVirulence.react';

export default ({ genome }) => {
  const { kleborate } = genome.analysis;

  return (
    <React.Fragment>
      <h2>Virulence</h2>
      {!!kleborate && <KleborateVirulence result={kleborate} />}
    </React.Fragment>
  );
};
