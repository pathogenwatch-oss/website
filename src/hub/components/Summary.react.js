import React from 'react';
import { connect } from 'react-redux';

import ProgressBar from '../../components/ProgressBar.react';

import * as selectors from '../selectors';

export const Summary = ({ queueLength, visibleFastas, totalFastas }) => (
  <div className="wgsa-hub-summary">
    { queueLength ?
        <ProgressBar
          className="wgsa-hub-upload-progress"
          progress={(1 - queueLength / totalFastas) * 100}
          label={`${totalFastas - queueLength}/${totalFastas}`}
        /> :
        <p>Viewing <span>{visibleFastas}</span> of {totalFastas} assemblies</p>
    }
  </div>
);

function mapStateToProps(state) {
  return {
    queueLength: selectors.getUploadQueueLength(state),
    visibleFastas: selectors.getNumberOfVisibleFastas(state),
    totalFastas: selectors.getTotalFastas(state),
  };
}

export default connect(mapStateToProps)(Summary);
