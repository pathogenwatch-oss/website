import React from 'react';

const types = {
  maxDownloadSize: 'downloads',
  maxCollectionSize: 'collections',
};

const Sorry = ({ type, amount, limit }) => (
  <div className="wgsa-selection-message">
    <h3>We're Sorry!</h3>
    <p>You have selected <strong>{amount} genomes</strong>, but the current limit for {types[type]} is <strong>{limit}</strong>. 😞</p>
    <p>Please refine your selection to continue.</p>
  </div>
);

export default Sorry;
