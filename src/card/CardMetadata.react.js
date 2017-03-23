import React from 'react';
import classnames from 'classnames';

export default ({ children, title, icon, fadeOverflow }) => (
  <div className={classnames('wgsa-card-metadata', { 'wgsa-overflow-fade': fadeOverflow })}>
    <i title={title} className="material-icons">{icon}</i>
    {children}
  </div>
);
