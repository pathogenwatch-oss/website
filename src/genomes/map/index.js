import './styles.css';
import React from 'react';

import MapView from './MapView.react';

function createStateKey(match) {
  if (!match) return null;
  return `GENOME_${match.params.prefilter}`;
}

export default ({ match }) => <MapView stateKey={createStateKey(match)} />;
