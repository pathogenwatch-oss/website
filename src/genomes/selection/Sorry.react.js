import React from 'react';
import { connect } from 'react-redux';

import { toggleUserDrawer } from '../../header/actions';

import config from '../../app/config';

const types = {
  maxDownloadSize: 'downloads',
  maxCollectionSize: 'collections',
};

const Sorry = ({ type, amount, limit, loggedIn, openMenu }) => (
  <div className="wgsa-selection-message">
    <h3>We're Sorry!</h3>
    <p>You have selected <strong>{amount} genomes</strong>, but your current limit for {types[type]} is <strong>{limit}</strong>. 😞</p>
    {!config.user &&
    <p><button style={{ padding: 0 }} className="wgsa-link-button" onClick={openMenu}>Sign in</button> to increase this limit to <strong>{loggedIn}</strong>.</p> }
    <p>Please refine your selection to continue.</p>
  </div>
);

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () => dispatch(toggleUserDrawer(true)),
  };
}

export default connect(null, mapDispatchToProps)(Sorry);
