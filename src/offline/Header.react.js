import React from 'react';

import Header from '../header';

const OfflineIcon = () => (
  <span
    className="cgps-avatar wgsa-account-link"
    title="Menu not available in Offline mode."
  >
    <span className="cgps-avatar__image wgsa-offline-icon">
      <i className="material-icons">signal_wifi_off</i>
    </span>
  </span>
);

export default () => (
  <Header
    className="wgsa-header--inverse"
    drawerLink={<OfflineIcon />}
  >
    <span className="wgsa-header-content">
      <span className="mdl-navigation__link">Offline Mode</span>
    </span>
  </Header>
);
