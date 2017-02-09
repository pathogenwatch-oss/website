import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import config from '../app/config';

const sectionStyle = {
  width: '80%',
  margin: '32px auto',
};

const Profile = ({ numCollections, numGenomes }) => (
  <div className="wgsa-hipster-style wgsa-filterable-view">
    <h2 style={sectionStyle}>{config.user.name}'s Profile</h2>
    <div className="wgsa-hub-stats-group" style={sectionStyle}>
      <Link className="wgsa-hub-stats-section" to="account/collections">
        <h3 className="wgsa-hub-stats-heading">Collections</h3>
        <p className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{numCollections}</p>
      </Link>
      <Link className="wgsa-hub-stats-section" to="account/genomes">
        <h3 className="wgsa-hub-stats-heading">Genomes</h3>
        <p className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{numGenomes}</p>
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
  return {
    numCollections: 0,
    numGenomes: 0,
  };
}

export default connect(mapStateToProps)(Profile);
