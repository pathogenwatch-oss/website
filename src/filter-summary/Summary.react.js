import React from 'react';
import classnames from 'classnames';

export const Totals = ({ visible, total, itemType }) => (
  <p>Viewing <span>{visible}</span> of {total} {itemType} </p>
);

export const Summary = ({ className, children }) => (
  <div className={classnames('wgsa-filter-summary wgsa-content-margin', className)}>
    {children}
  </div>
);
