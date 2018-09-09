import React from 'react';

import MLST from './MLST.react';
import Genotyphi from './Genotyphi.react';
import NgMast from './NgMast.react';

function getSecondaryTyping({ genotyphi, ngmast }) {
  if (genotyphi) {
    return <Genotyphi result={genotyphi} />;
  }
  if (ngmast) {
    return <NgMast result={ngmast} />;
  }
  return null;
}

export default ({ genome }) => {
  const SecondaryTyping = getSecondaryTyping(genome.analysis);

  if (SecondaryTyping) {
    return (
      <React.Fragment>
        <div className="pw-genome-report-column two thirds">
          <MLST leftaligned result={genome.analysis.mlst} />
        </div>
        <div className="pw-genome-report-column one third right">
          { getSecondaryTyping(genome.analysis) }
        </div>
      </React.Fragment>
    );
  }

  return <MLST result={genome.analysis.mlst} />;
};
