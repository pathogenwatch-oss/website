import React from 'react';
import { connect } from 'react-redux';

import { getDeployedOrganismIds } from '../../summary/selectors';

import { taxIdMap } from './index';

function mapStateToProps(state, { organismId }) {
  const deployedOrganisms = getDeployedOrganismIds(state);
  return {
    isDeployed: deployedOrganisms && deployedOrganisms.has(organismId),
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
