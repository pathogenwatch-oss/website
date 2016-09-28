import '../css/summary.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import ProgressBar from '../../components/ProgressBar.react';

import * as selectors from '../selectors';

const ViewSwitcher = ({ icon, title, to, pathname }) => (
  <Link
    to={to}
    className={`mdl-button mdl-button--icon wgsa-hub-view-switcher ${to === pathname ? 'wgsa-hub-view-switcher--active' : ''}`.trim()}
    title={title}
  >
    <i className="material-icons">{icon}</i>
  </Link>
);

export const Summary = ({ queueLength, visibleFastas, totalFastas, pathname }) => (
  <div className="wgsa-hub-summary wgsa-hub-gutter">
    { queueLength ?
        <ProgressBar
          className="wgsa-hub-upload-progress"
          progress={(1 - queueLength / totalFastas) * 100}
          label={`${totalFastas - queueLength}/${totalFastas}`}
        /> :
        <p>Viewing <span>{visibleFastas}</span> of {totalFastas} assemblies</p>
    }
    <ViewSwitcher
      to="/upload"
      pathname={pathname}
      title="Grid view"
      icon="view_module"
    />
    <ViewSwitcher
      to="/upload/map"
      pathname={pathname}
      title="Map view"
      icon="map"
    />
    <ViewSwitcher
      to="/upload/stats"
      pathname={pathname}
      title="Stats view"
      icon="multiline_chart"
    />
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
