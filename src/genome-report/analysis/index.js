import React from 'react';

import { VersionSwitcher } from '../components';

import Clustering from './Clustering.react';
import Core from './Core.react';
import Inctyper from './Inctyper.react';
import Metrics from './Metrics.react';
import MLST from './MLST.react';
import AMR from './AMR.react';
import Speciator from './Speciator.react';
import Typing from './Typing.react';
import Virulence from './Virulence.react';

// import renderGenericResults from './Generic.react';

function hasSpeciesTypingResult(analysis) {
  return (
    analysis.mlst ||
    'mlst-alt' in analysis ||
    analysis.genotyphi ||
    analysis.ngmast ||
    analysis.serotype ||
    analysis.poppunk ||
    analysis.kleborate
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
    paarsnp,
    speciator,
  } = analysis;

  const sections = [];

  if (hasSpeciesTypingResult(analysis)) {
    sections.push({
      key: 'Typing',
      component: <Typing genome={genome} />,
    });
  }
  if (paarsnp || kleborate) {
    sections.push({
      key: 'AMR',
      component: <AMR genome={genome} />,
    });
  }
  if (inctyper && Object.keys(inctyper).includes('Inc Matches')) {
    sections.push({
      key: 'Inc Typing',
      component: <Inctyper analysis={analysis} />,
    });
  }
  if (kleborate) {
    sections.push({
      key: 'Virulence',
      component: <Virulence genome={genome} />,
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
