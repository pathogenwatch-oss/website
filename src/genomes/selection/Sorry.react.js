import React from 'react';

import SignInLink from '../../sign-in/SignInLink.react';

import config from '../../app/config';

const types = {
  maxDownloadSize: 'downloads',
  maxCollectionSize: 'collections',
};

const Sorry = ({ type, amount, limit, loggedIn }) => (
  <div className="wgsa-selection-message">
    <h3>We're Sorry!</h3>
    <p>You have selected <strong>{amount} genomes</strong>, but the current limit for {types[type]} is <strong>{limit}</strong>. 😞</p>
    {!config.user &&
    <p><SignInLink>Sign in</SignInLink> to increase this limit to <strong>{loggedIn}</strong>.</p> }
    <p>Please refine your selection to continue.</p>
  </div>
);

export default Sorry;
