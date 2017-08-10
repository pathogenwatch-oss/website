import React from 'react';
import classnames from 'classnames';

export default ({ className, children, tooltip, title, icon, fadeOverflow }) => (
  <div
    className={classnames(className, 'wgsa-card-metadata', { 'wgsa-overflow-fade': fadeOverflow })}
    title={tooltip}
  >
    <i title={title} className="material-icons">{icon}</i>
    {children}
  </div>
);
