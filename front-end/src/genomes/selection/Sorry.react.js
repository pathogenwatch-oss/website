import React from 'react';

const Sorry = ({ amount, limit }) => (
  <div className="wgsa-selection-message">
    <h3>We're Sorry!</h3>
    <p>
      You have selected <strong>{amount} genomes</strong>, but the current limit
      for this feature is <strong>{limit}</strong>. 😞
    </p>
    <p>Please refine your selection to continue.</p>
  </div>
);

export default Sorry;
