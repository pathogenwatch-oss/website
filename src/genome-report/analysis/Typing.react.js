import React from 'react';

import MLST from './MLST.react';
import Genotyphi from './Genotyphi.react';
import NgMast from './NgMast.react';
import Serotype from './Serotype.react';

function getSecondaryTyping({ genotyphi, ngmast, serotype }) {
  return (
    <React.Fragment>
      {!!serotype && <Serotype result={serotype} />}
      {!!genotyphi && <Genotyphi result={genotyphi} />}
      {!!ngmast && <NgMast result={ngmast} />}
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
