import React from 'react';

import NavLink from '../location';

import { isOffline } from '../offline';

const OfflineContent = () => (
  <span className="wgsa-header-content">
    <span className="mdl-navigation__link">Offline Mode</span>
  </span>
);

export default ({ offline = isOffline() }) => {
  if (offline) {
    return <OfflineContent />;
  }

  return (
    <nav className="wgsa-header-content mdl-navigation">
      <NavLink to="/genomes">Genomes</NavLink>
      <NavLink to="/collections">Collections</NavLink>
      <NavLink to="/upload">Upload</NavLink>
      <NavLink
        to="https://cgps.gitbook.io/pathogenwatch/"
        external
        className="sm-hide"
      >
        Documentation
      </NavLink>
      <a
        className="mdl-button mdl-button--icon"
        href="https://cgps.gitbook.io/pathogenwatch/announcements"
        rel="noopener"
        target="_blank"
        title="See announcements."
      >
        <i className="material-icons">notifications</i>
      </a>
      <a
        className="mdl-button mdl-button--icon"
        href="https://twitter.com/pathogenwatch"
        rel="noopener"
        target="_blank"
        title="Follow @Pathogenwatch"
      >
        <i className="cgps-twitter-icon" />
      </a>
      <a
        className="mdl-button mdl-button--icon"
        href={`mailto:pathogenwatch@cgps.group?body=${encodeURIComponent('Please add a descriptive subject line and also edit the section below as appropriate.\n------\nTopic - Website / Data / Documentation / Other\nType - Feature Request / Error Report / Explanation Request\nAffected URL - the URL of the query page if relevant.\nBug Report - Browser / Operating system / Time & Date\n-----\n')}`}
        rel="noopener"
        target="_blank"
        title="Contact us"
      >
        <i className="material-icons">email</i>
      </a>
    </nav>
  );
};
