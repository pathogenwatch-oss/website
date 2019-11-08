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

export default ({ genome }) => {
  const { speciator, mlst, mlst2, ngstar } = genome.analysis;
  return (
    <React.Fragment>
      {mlst &&
        <div id="mlst">
          <MLST result={mlst} speciator={speciator} />
          {mlst2 && <MLST heading="Alternative MLST" result={mlst2} speciator={speciator} filterKey="sequenceType2" />}
          {ngstar && <MLST heading="NG-STAR" result={ngstar} speciator={speciator} filterKey="ngstar" />}
        </div>}
      {getSecondaryTyping(genome)}
    </React.Fragment>
  );
};
