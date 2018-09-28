import React from 'react';

import { VersionSwitcher } from '../components';

import Clustering from './Clustering.react';
import Core from './Core.react';
import Metrics from './Metrics.react';
import PAARSNP from './PAARSNP.react';
import Speciator from './Speciator.react';
import Typing from './Typing.react';
import Kleborate from './Kleborate.react';
// import renderGenericResults from './Generic.react';

export default (genome) => {
  const { analysis = {} } = genome;
  const { metrics, core, mlst, genotyphi, ngmast, paarsnp, speciator, cgmlst, kleborate } = analysis;

  const sections = [];

  if (mlst) {
    sections.push({
      key: (genotyphi || ngmast) ? 'Typing' : 'MLST',
      component: <Typing genome={genome} />,
    });
  }
  if (paarsnp) {
    sections.push({
      key: 'AMR',
      component: <VersionSwitcher taskName="paarsnp" component={PAARSNP} genome={genome} />,
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
      component: <VersionSwitcher taskName="core" component={Core} genome={genome} />,
    });
  }
  if (metrics) {
    sections.push({
      key: 'Assembly',
      component: <VersionSwitcher taskName="metrics" component={Metrics} genome={genome} />,
    });
  }
  if (speciator) {
    sections.push({
      key: 'Organism',
      component: <VersionSwitcher taskName="speciator" component={Speciator} genome={genome} />,
    });
  }
  if (kleborate) {
    sections.push({
      key: 'Kleborate',
      component: <VersionSwitcher taskName="kleborate" component={Kleborate} genome={genome} />,
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
