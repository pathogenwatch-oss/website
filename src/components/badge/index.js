import './styles.css';

import React from 'react';

export default ({ children, color }) => (
  <span className="pw-badge" style={{ color }}>
    <span className="pw-badge-text">{children}</span>
  </span>
);
