import './styles.css';

import React from 'react';

import MLST from './MLST.react';
import PAARSNP from './PAARSNP.react';
import Specieator from './Specieator.react';
import renderGenericResults from './Generic.react';

export default ({ analysis }) => {
  const { mlst, paarsnp, specieator, metrics, ...rest } = analysis;
  return (
    <div className="wgsa-analysis-view">
      { mlst && <MLST result={mlst} /> }
      { paarsnp && <PAARSNP result={paarsnp} /> }
      { specieator && <Specieator result={specieator} /> }
      { renderGenericResults(rest) }
    </div>
  );
};
