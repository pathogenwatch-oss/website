import './styles.css';

import React from 'react';

import Metrics from './Metrics.react';
import MLST from './MLST.react';
import PAARSNP from './PAARSNP.react';
import Specieator from './Specieator.react';
import renderGenericResults from './Generic.react';

export default (analysis) => {
  const { mlst, paarsnp, specieator, metrics, ...rest } = analysis;

  const tabs = [];

  if (metrics) tabs.push({ key: 'Metrics', component: <Metrics result={metrics} /> });
  if (mlst) tabs.push({ key: 'MLST', component: <MLST result={mlst} /> });
  if (paarsnp) tabs.push({ key: 'PAARSNP', component: <PAARSNP {...paarsnp} /> });
  if (specieator) tabs.push({ key: 'Specieator', component: <Specieator result={specieator} /> });
  if (Object.keys(rest).length) tabs.push({ key: 'Other', component: renderGenericResults(rest) });

  return tabs;
};
