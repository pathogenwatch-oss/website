import React from 'react';

export default ({ genome }) => {
  const { name } = genome;
  return (
    <header className="wgsa-card-header">
      <h2 className="wgsa-card-title wgsa-overflow-fade" title={name}>{name}</h2>
    </header>
  );
};
