import React from 'react';

import { VersionSwitcher } from '../components';

import AMR from './AMR.react';
import Core from './Core.react';
import Clustering from './Clustering.react';
import Inctyper from './Inctyper.react';
import KleborateSpecies from './KleborateSpecies.react';
import Metrics from './Metrics.react';
import CovidVariants from './Sarscov2Variants.react';
import Speciator from './Speciator.react';
import Typing from './Typing.react';
import Virulence from './Virulence.react';

import { taxIdMap } from '~/organisms';

// import renderGenericResults from './Generic.react';

function hasSpeciesTypingResult(analysis) {
  return (
    analysis.mlst ||
    analysis.mlst2 ||
    analysis.genotyphi ||
    analysis.ngmast ||
    analysis.serotype ||
    analysis.pangolin ||
    analysis.poppunk2 ||
    analysis.kaptive ||
    analysis.ngstar ||
    analysis.vista
  );
}

export default genome => {
  const { analysis = {}, owner = '' } = genome;
  if (taxIdMap.has(analysis.speciator.organismId) && !!taxIdMap.get(analysis.speciator.organismId).uiOptions.exclude) {
    taxIdMap.get(analysis.speciator.organismId).uiOptions.exclude.forEach(excluded => delete analysis[excluded]);
  }
  const {
    cgmlst,
    core,
    inctyper,
    kaptive,
    kleborate,
    metrics,
    paarsnp,
    speciator,
    vista,
  } = analysis;

  const sections = [];

  if (!!kleborate && !speciator.speciesName.replace('Raoultella', 'Klebsiella').startsWith(kleborate.species)) {
    sections.push({
      key: 'Kleborate species',
      component: <KleborateSpecies genome={genome} />,
    });
  }

  if (hasSpeciesTypingResult(analysis)) {
    sections.push({
      key: 'Typing',
      component: <Typing genome={genome} />,
    });
  }

  if (analysis["sarscov2-variants"]) {
    sections.push({
      key: 'Variants',
      component: <CovidVariants genome={genome} />,
    });
  }
  if (paarsnp || kleborate.amr) {
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
  if (kleborate || vista) {
    sections.push({
      key: 'Virulence',
      component: <Virulence genome={genome} />,
    });
  }
  if (cgmlst && (owner !== 'other' || genome.public || genome.reference)) {
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
