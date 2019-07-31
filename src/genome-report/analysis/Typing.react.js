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
      {!!poppunk && <Strain genome={genome} />}
      {!!serotype && <Serotype genome={genome} />}
      {!!genotyphi && <Genotyphi result={genotyphi} />}
      {!!ngmast && <NgMast result={ngmast} />}
      {!!kleborate && <Kleborate genome={genome} /> }
    </React.Fragment>
  );
}

function getPneumoTyping(genome) {
  const { mlst, serotype, poppunk } = genome.analysis;
  return (
    <React.Fragment>
      {!!mlst &&
        <div id="mlst">
          <MLST genome={genome} />
        </div>
      }
      {!!poppunk &&
        <div className="pw-genome-report-column one half">
          <Strain genome={genome} />
        </div>
      }
      {!!serotype &&
        <div className="pw-genome-report-column one half">
          <Serotype genome={genome} />
        </div>
      }
    </React.Fragment>
  );
}

export default ({ genome }) => {
  const { analysis = {} } = genome;
  if (analysis.speciator && analysis.speciator.speciesId === '1313') {
    return getPneumoTyping(genome);
  }
  return (
    <React.Fragment>
      <div className="pw-genome-report-column one half">
        <MLST genome={genome} />
      </div>
      <div className="pw-genome-report-column one half right">
        {getSecondaryTyping(genome)}
      </div>
    </React.Fragment>
  );
};
