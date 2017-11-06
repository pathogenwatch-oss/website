import './styles.css';

import React from 'react';

import Metrics from './Metrics.react';
import MLST from './MLST.react';
import PAARSNP from './PAARSNP.react';
import Speciator from './Speciator.react';
import Genotyphi from './Genotyphi.react';
import NgMast from './NgMast.react';
import renderGenericResults from './Generic.react';

export default (analysis) => {
  const { metrics, mlst, paarsnp, genotyphi, ngmast, speciator, ...rest } = analysis;

  const tabs = [];

  const organismId = speciator ? speciator.organismId : null;

  if (metrics) tabs.push({ key: 'Metrics', component: <Metrics result={metrics} /> });
  if (mlst) tabs.push({ key: 'MLST', component: <MLST result={mlst} /> });
  if (paarsnp) tabs.push({ key: 'AMR', component: <PAARSNP {...paarsnp} organismId={organismId} /> });
  if (genotyphi) tabs.push({ key: 'Genotyphi', component: <Genotyphi {...genotyphi} /> });
  if (ngmast) tabs.push({ key: 'NG-MAST', component: <NgMast {...ngmast} /> });
  if (speciator) tabs.push({ key: 'Organism', component: <Speciator result={speciator} /> });
  if (Object.keys(rest).length) tabs.push({ key: 'Other', component: renderGenericResults(rest) });

  return tabs;
};
