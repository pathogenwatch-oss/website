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
    return <OfflineContent/>;
  }

  return (
    <nav className="wgsa-header-content mdl-navigation">
      <span
        style={ {
          marginLeft: '24px',
          marginRight: 'auto',
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.54)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0, // This allows the span to shrink below its content size
          paddingRight: '16px',
        } }
        title="Major release scheduled for February 2026. See more at next.pathogen.watch."
      >
        <a
          href="https://cgps.gitbook.io/pathogenwatch/announcements#a-major-update-coming-in-february" // Change to the real documentation link.
          target="_blank"
          rel="noopener"
          style={ { color: '#673c90', textDecoration: 'underline' } }
        >
          Major release</a> scheduled for February 2026. Preview it at{ ' ' }
        <a
          href="https://next.pathogen.watch"
          target="_blank"
          rel="noopener"
          style={ { color: '#673c90', textDecoration: 'underline' } }
        >
          next.pathogen.watch
        </a>
      </span>
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
        <i className="cgps-twitter-icon"/>
      </a>
      <a
        className="mdl-button mdl-button--icon"
        href={ `mailto:pathogenwatch@cgps.group?body=${ encodeURIComponent('Please add a descriptive subject line and also edit the section below as appropriate.\n------\nTopic - Website / Data / Documentation / Other\nType - Feature Request / Error Report / Explanation Request\nAffected URL - the URL of the query page if relevant.\nBug Report - Browser / Operating system / Time & Date\n-----\n') }` }
        rel="noopener"
        target="_blank"
        title="Contact us"
      >
        <i className="material-icons">email</i>
      </a>
    </nav>
  );
};
