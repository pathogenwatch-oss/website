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
      {!!poppunk &&
        <div className="pw-genome-report-column one half">
          <Strain genome={genome} />
        </div>}
      {!!serotype &&
        <div className="pw-genome-report-column one half">
          <Serotype genome={genome} />
        </div>}
      {!!genotyphi &&
        <div className="pw-genome-report-column one half">
          <Genotyphi result={genotyphi} />
        </div>}
      {!!ngmast &&
        <div className="pw-genome-report-column one half">
          <NgMast result={ngmast} />
        </div>}
      {!!kleborate &&
        <div>
          <Kleborate genome={genome} />
        </div>
      }
    </React.Fragment>
  );
}

export default ({ genome }) => (
  <React.Fragment>
    <div id="mlst">
      <MLST genome={genome} />
    </div>
    {getSecondaryTyping(genome)}
  </React.Fragment>
);
