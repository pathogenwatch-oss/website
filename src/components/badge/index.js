import './styles.css';

import React from 'react';
import classnames from 'classnames';

export default ({ children, color = 'purple', text, circular = false }) => (
  <span
    className={classnames('pw-badge', `pw-badge-${color}`, { circular })}
    data-text={text}
  >
    {children}
  </span>
);
