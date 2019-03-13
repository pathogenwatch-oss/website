import React from 'react';

import FileCard from './Card.react';

export default ({ genomes }) =>
  (genomes.length ? (
    <div className="wgsa-section-divider">
      <h2 className="wgsa-section-title">Validation Errors</h2>
      {genomes.map(genome => (
        <FileCard key={genome.id} genome={genome} />
      ))}
    </div>
  ) : null);
