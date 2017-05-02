import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getSummary } from '../summary/selectors';

import config from '../app/config';

const { user } = config;

const sectionStyle = {
  width: '80%',
  margin: '32px auto',
};

const Profile = ({ userCollections, userGenomes }) => (
  <div className="wgsa-hipster-style wgsa-filterable-view">
    <div className="cgps-avatar cgps-avatar--centered wgsa-profile-avatar">
      <img src={user.photo} className="cgps-avatar__image" />
      <div className="cgps-avatar__name title-font" title={user.name}>{user.name}</div>
      <div className="cgps-avatar__contact" title={user.email}>{user.email}</div>
    </div>
    <div className="wgsa-hub-stats-group" style={sectionStyle}>
      <Link className="wgsa-hub-stats-section wgsa-profile-counter" to="/genomes/user" title="Click to view genomes">
        <h3 className="wgsa-hub-stats-heading">Genomes</h3>
        <p className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{userGenomes}</p>
      </Link>
      <Link className="wgsa-hub-stats-section wgsa-profile-counter" to="/collections/user" title="Click to view collections">
        <h3 className="wgsa-hub-stats-heading">Collections</h3>
        <p className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{userCollections}</p>
      </Link>
    </div>
    <div className="wgsa-hub-stats-group" style={sectionStyle}>
      <div className="wgsa-hub-stats-section">
        <div className="wgsa-hub-stats-heading">Recent Activity</div>
      </div>
    </div>
  </div>
);

function mapStateToProps(state) {
  return getSummary(state);
}

export default connect(mapStateToProps)(Profile);
