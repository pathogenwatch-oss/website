import React from 'react';

import MLST from './MLST.react';
import Genotyphi from './Genotyphi.react';
import NgMast from './NgMast.react';
import Serotype from './Serotype.react';
import Strain from './Strain.react';
import Kleborate from './Kleborate.react';

function getSecondaryTyping(genome) {
  const { genotyphi, ngmast, serotype, poppunk, kleborate } = genome.analysis;
  return (
    <React.Fragment>
      {!!serotype && <Serotype result={serotype} />}
      {!!genotyphi && <Genotyphi result={genotyphi} />}
      {!!ngmast && <NgMast result={ngmast} />}
      {!!poppunk && <Strain genome={genome} />}
      {!!kleborate && <Kleborate genome={genome} /> }
    </React.Fragment>
  );
}

export default ({ genome }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Typing and Strain</h2>
    </header>
    <div className="pw-genome-report-column one half">
      <MLST leftaligned result={genome.analysis.mlst} />
    </div>
    <div className="pw-genome-report-column one half right">
      {getSecondaryTyping(genome)}
    </div>
  </React.Fragment>
);
