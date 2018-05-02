import React from 'react';

import { VersionSwitcher } from '../components';

import Metrics from './Metrics.react';
import Core from './Core.react';
import MLST from './MLST.react';
import PAARSNP from './PAARSNP.react';
import Speciator from './Speciator.react';
import Genotyphi from './Genotyphi.react';
import NgMast from './NgMast.react';
import renderGenericResults from './Generic.react';
import Clustering from './Clustering.react';

export default (genome) => {
  const { analysis = {}, clustering } = genome;
  const { metrics, core, mlst, paarsnp, genotyphi, ngmast, speciator, cgmlst, ...rest } = analysis;

  const tabs = [];

  if (mlst) {
    tabs.push({
      key: 'MLST',
      component: <VersionSwitcher taskName="mlst" component={MLST} genome={genome} />,
    });
  }
  if (paarsnp) {
    tabs.push({
      key: 'AMR',
      component: <VersionSwitcher taskName="paarsnp" component={PAARSNP} genome={genome} />,
    });
  }
  if (cgmlst) {
    tabs.push({
      key: 'Clustering',
      component: <Clustering scheme={cgmlst.scheme} clustering={clustering} />,
    });
  }
  if (genotyphi) {
    tabs.push({
      key: 'Genotyphi',
      component: <VersionSwitcher taskName="genotyphi" component={Genotyphi} genome={genome} />,
    });
  }
  if (ngmast) {
    tabs.push({
      key: 'NG-MAST',
      component: <VersionSwitcher taskName="ngmast" component={NgMast} genome={genome} />,
    });
  }
  if (core) {
    tabs.push({
      key: 'Core',
      component: <VersionSwitcher taskName="core" component={Core} genome={genome} />,
    });
  }
  if (metrics) {
    tabs.push({
      key: 'Metrics',
      component: <VersionSwitcher taskName="metrics" component={Metrics} genome={genome} />,
    });
  }
  if (speciator) {
    tabs.push({
      key: 'Organism',
      component: <VersionSwitcher taskName="speciator" component={Speciator} genome={genome} />,
    });
  }
  if (Object.keys(rest).length) {
    tabs.push({
      key: 'Other',
      component: renderGenericResults(rest),
    });
  }

  return tabs;
};
