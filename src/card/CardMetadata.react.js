import React from 'react';
import classnames from 'classnames';

export default ({ children, tooltip, title, icon, fadeOverflow }) => (
  <div
    className={classnames('wgsa-card-metadata', { 'wgsa-overflow-fade': fadeOverflow })}
    title={tooltip}
  >
    <i title={title} className="material-icons">{icon}</i>
    {children}
  </div>
);
