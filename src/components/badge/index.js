import './styles.css';

import React from 'react';

export default ({ children, color = 'purple', text }) => (
  <span className={`pw-badge pw-badge-${color}`} data-text={text}>
    {children}
  </span>
);
