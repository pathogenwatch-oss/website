import './styles.css';

import React from 'react';

import { VersionSwitcher } from '../components';

import Metrics from './Metrics.react';
import MLST from './MLST.react';
import PAARSNP from './PAARSNP.react';
import Speciator from './Speciator.react';
import Genotyphi from './Genotyphi.react';
import NgMast from './NgMast.react';
import renderGenericResults from './Generic.react';

export default (genome) => {
  const { analysis = {} } = genome;
  const { metrics, mlst, paarsnp, genotyphi, ngmast, speciator, ...rest } = analysis;

  const tabs = [];

  if (metrics) tabs.push({ key: 'Metrics', component: <VersionSwitcher taskName="metrics" component={Metrics} genome={genome} /> });
  if (mlst) tabs.push({ key: 'MLST', component: <VersionSwitcher taskName="mlst" component={MLST} genome={genome} /> });
  if (paarsnp) tabs.push({ key: 'AMR', component: <VersionSwitcher taskName="paarsnp" component={PAARSNP} genome={genome} /> });
  if (genotyphi) tabs.push({ key: 'Genotyphi', component: <VersionSwitcher taskName="genotyphi" component={Genotyphi} genome={genome} /> });
  if (ngmast) tabs.push({ key: 'NG-MAST', component: <VersionSwitcher taskName="ngmast" component={NgMast} genome={genome} /> });
  if (speciator) tabs.push({ key: 'Organism', component: <VersionSwitcher taskName="speciator" component={Speciator} genome={genome} /> });
  if (Object.keys(rest).length) tabs.push({ key: 'Other', component: renderGenericResults(rest, genome.tasks) });

  return tabs;
};
