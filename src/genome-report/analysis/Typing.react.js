import React from 'react';

import MLST from './MLST.react';
import Genotyphi from './Genotyphi.react';
import NgMast from './NgMast.react';
import Serotype from './Serotype.react';
import Strain from './Strain.react';

function getSecondaryTyping({ genotyphi, ngmast, serotype, poppunk }) {
  return (
    <React.Fragment>
      {!!serotype && <Serotype result={serotype} />}
      {!!genotyphi && <Genotyphi result={genotyphi} />}
      {!!ngmast && <NgMast result={ngmast} />}
      {!!poppunk && <Strain result={poppunk} />}
    </React.Fragment>
  );
}

export default ({ genome }) => (
  <React.Fragment>
    <div className="pw-genome-report-column one half">
      <MLST leftaligned result={genome.analysis.mlst} />
    </div>
    <div className="pw-genome-report-column one half right">
      {getSecondaryTyping(genome.analysis)}
    </div>
  </React.Fragment>
);
