import React from 'react';

import { InvalidGenomeError } from '../utils/validation';

const Error = ({ message, children }) => (
  <div className="wgsa-hub-card__metadata wgsa-hub-card-error">
    <p>{message}</p>
    {children}
  </div>
);

function getError(genome) {
  if (genome.error instanceof InvalidGenomeError) {
    return <Error message={genome.error.message} />;
  }
  return (
    <Error message="File could not be uploaded." />
  );
}

export default ({ genome }) => (
  <div className="wgsa-card-content">
    { getError(genome) }
  </div>
);
