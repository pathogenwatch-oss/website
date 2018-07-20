import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ActivityList from './ActivityList.react';
import AccountImage from './AccountImage.react';

import { getAccount } from './selectors';
import { getSummary } from '../summary/selectors';

import { statuses } from './constants';

import config from '../app/config';

const renderProfileContent = ({ status, summary }) => {
  if (status === statuses.LOADING) return null;

  const { userCollections = 0, userGenomes = 0 } = summary;
  if (userCollections === 0 && userGenomes === 0) {
    return (
      <div className="wgsa-profile-section wgsa-profile-onboarding">
        <p>Welcome to <strong>Pathogenwatch</strong>!</p>
        <p>This is your account page, here you'll be able to see:</p>
        <ul>
          <li>The number of genomes you've uploaded</li>
          <li>The number of collections you've created</li>
          <li>A list of your recent activity</li>
        </ul>
        <p>To get started, <Link to="/upload">upload genomes</Link> or <Link to="/genomes">browse the public dataset</Link>.</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="wgsa-hub-stats-group wgsa-profile-section">
        <Link className="wgsa-hub-stats-section wgsa-profile-counter" to="/genomes/user" title="Click to view genomes">
          <h3 className="wgsa-hub-stats-heading">Genomes</h3>
          <p className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{userGenomes}</p>
        </Link>
        <Link className="wgsa-hub-stats-section wgsa-profile-counter" to="/collections/user" title="Click to view collections">
          <h3 className="wgsa-hub-stats-heading">Collections</h3>
          <p className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{userCollections}</p>
        </Link>
      </div>
      <div className="wgsa-hub-stats-group wgsa-profile-section">
        <div className="wgsa-hub-stats-section">
          <div className="wgsa-hub-stats-heading">Recent Activity</div>
          <ActivityList />
        </div>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    status: getAccount(state),
    summary: getSummary(state),
  };
}

const ProfileContent = connect(mapStateToProps)(renderProfileContent);

const Profile = () => {
  const { user } = config;
  if (!user) return null;

  return (
    <div className="wgsa-hipster-style">
      <div className="cgps-avatar cgps-avatar--centered wgsa-profile-avatar">
        <AccountImage />
        <div className="cgps-avatar__name title-font" title={user.name}>{user.name}</div>
        <div className="cgps-avatar__contact" title={user.email}>{user.email}</div>
      </div>
      <ProfileContent />
    </div>
  );
};

export default Profile;
