import React from 'react';

export default ({ children, title, icon }) => (
  <div className="wgsa-card-metadata">
    <i title={title} className="material-icons">{icon}</i>
    {children}
  </div>
);
