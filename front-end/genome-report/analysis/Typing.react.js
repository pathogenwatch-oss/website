import React from 'react';

import MLST from './MLST.react';
import Genotyphi from './Genotyphi.react';
import NgMast from './NgMast.react';
import Serotype from './Serotype.react';
import Strain from './Strain.react';
import Kleborate from './Kleborate.react';
import NgonoVariants from './NgonoVariants.react'
import Pangolin from './Pangolin.react';
import SpnPbpType from './SpnPbpType.react';
import VistaGenotype from './VistaGenotype.react';

function getSecondaryTyping(genome) {
  const { genotyphi, ngmast, serotype, poppunk, kleborate, "ngono-markers": ngonoMarkers, pangolin, spn_pbp_amr, vista } = genome.analysis;
  return (
    <React.Fragment>
      {!!pangolin &&
        <div>
          <Pangolin genome={genome} />
        </div>}
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
        <div>
          <NgMast result={ngmast} />
        </div>}
      {!!ngonoMarkers &&
        <div>
          <NgonoVariants result={ngonoMarkers} />
        </div>}
      {!!kleborate &&
        <div>
          <Kleborate genome={genome} />
        </div>}
      {!!spn_pbp_amr &&
        <div>
          <SpnPbpType genome={genome} />
        </div>}
      {!!vista &&
        <div>
          <VistaGenotype genome={genome} />
        </div>}
    </React.Fragment>
  );
}

export default ({ genome }) => {
  const { speciator, mlst, mlst2, ngstar } = genome.analysis;
  return (
    <React.Fragment>
      {(mlst || ngstar) &&
        <div id="mlst">
          {mlst && <MLST result={mlst} speciator={speciator} />}
          {mlst2 && <MLST heading="Alternative MLST" result={mlst2} speciator={speciator} filterKey="mlst2" />}
          {ngstar && <MLST heading="NG-STAR – Sequence typing for antimicrobial resistance" result={ngstar} speciator={speciator} filterKey="ngstar" label="type" />}
        </div>}
      {getSecondaryTyping(genome)}
    </React.Fragment>
  );
};
