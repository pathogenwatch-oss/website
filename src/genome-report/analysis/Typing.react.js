import React from 'react';

import MLST from './MLST.react';
import Genotyphi from './Genotyphi.react';
import NgMast from './NgMast.react';
import Serotype from './Serotype.react';
import Strain from './Strain.react';

function getSecondaryTyping(genome) {
  const { genotyphi, ngmast, serotype, poppunk } = genome.analysis;
  return (
    <React.Fragment>
      {!!poppunk && <Strain genome={genome} />}
      {!!serotype && <Serotype genome={genome} />}
      {!!genotyphi && <Genotyphi result={genotyphi} />}
      {!!ngmast && <NgMast result={ngmast} />}
    </React.Fragment>
  );
}

export default ({ genome }) => (
  <React.Fragment>
    <div className="pw-genome-report-column one half">
      <MLST genome={genome} />
    </div>
    <div className="pw-genome-report-column one half right">
      {getSecondaryTyping(genome)}
    </div>
  </React.Fragment>
);
