import React from 'react';

import { VersionSwitcher } from '../components';

import Clustering from './Clustering.react';
import Core from './Core.react';
import Inctyper from './Inctyper.react';
import Kleborate from './Kleborate.react';
import Metrics from './Metrics.react';
import MLST from './MLST.react';
import PAARSNP from './PAARSNP.react';
import Speciator from './Speciator.react';
import Typing from './Typing.react';
// import renderGenericResults from './Generic.react';

function hasSpeciesTypingResult(analysis) {
  return (
    analysis.mlst &&
    (analysis.genotyphi || analysis.ngmast || analysis.serotype)
  );
}

export default genome => {
  const { analysis = {} } = genome;
  const {
    cgmlst,
    core,
    inctyper,
    kleborate,
    metrics,
    mlst,
    paarsnp,
    speciator,
  } = analysis;

  const sections = [];

  const useTypingSection = hasSpeciesTypingResult(analysis);
  if (useTypingSection) {
    sections.push({
      key: 'Typing',
      component: <Typing genome={genome} />,
    });
  } else if (mlst) {
    sections.push({
      key: 'MLST',
      component: <MLST genome={genome} />,
    });
  }
  if (kleborate) {
    sections.push({
      key: 'Kleborate',
      component: (
        <VersionSwitcher
          taskName="kleborate"
          component={Kleborate}
          genome={genome}
        />
      ),
    });
  }
  if (paarsnp) {
    sections.push({
      key: 'AMR',
      component: (
        <VersionSwitcher
          taskName="paarsnp"
          component={PAARSNP}
          genome={genome}
        />
      ),
    });
  }
  if (inctyper && Object.keys(inctyper).includes('Inc Matches')) {
    sections.push({
      key: 'Inc Typing',
      component: (
        <VersionSwitcher
          taskName="inctyper"
          component={Inctyper}
          genome={genome}
        />
      ),
    });
  }
  if (cgmlst) {
    sections.push({
      key: 'Clustering',
      component: <Clustering result={cgmlst} />,
    });
  }
  if (core) {
    sections.push({
      key: 'Core',
      component: (
        <VersionSwitcher taskName="core" component={Core} genome={genome} />
      ),
    });
  }
  if (metrics) {
    sections.push({
      key: 'Assembly',
      component: (
        <VersionSwitcher
          taskName="metrics"
          component={Metrics}
          genome={genome}
        />
      ),
    });
  }
  if (speciator) {
    sections.push({
      key: 'Organism',
      component: (
        <VersionSwitcher
          taskName="speciator"
          component={Speciator}
          genome={genome}
        />
      ),
    });
  }
  // if (Object.keys(rest).length) {
  //   sections.push({
  //     key: 'Other',
  //     component: renderGenericResults(rest),
  //   });
  // }

  return sections;
};
