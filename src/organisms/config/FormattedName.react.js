import React from 'react';
import { connect } from 'react-redux';

import { getDeployedOrganismIds } from '../../summary/selectors';
import { isOffline } from '../../offline';

import { taxIdMap } from './index';

function mapStateToProps(state, { organismId }) {
  const deployedOrganisms = getDeployedOrganismIds(state);
  const offline = isOffline();
  return {
    isDeployed:
      offline ?
        taxIdMap.has(organismId) :
        deployedOrganisms && deployedOrganisms.has(organismId),
  };
}

export default connect(mapStateToProps)(
  ({ isDeployed, organismId, title, fullName = false }) => (
    <span title={title}>
      { isDeployed ?
        taxIdMap.get(organismId)[fullName ? 'formattedName' : 'formattedShortName'] :
        title }
    </span>
  )
);
