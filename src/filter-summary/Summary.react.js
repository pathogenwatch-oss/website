import React from 'react';
import classnames from 'classnames';

export const Totals = ({ visible, total, itemType }) => (
  <p className="wgsa-filter-summary__count">
    Viewing <span>{visible}</span> of {total} {itemType}{total > 1 ? 's' : ''}
  </p>
);

export const Summary = ({ className, children }) => (
  <div className={classnames('wgsa-filter-summary wgsa-content-margin', className)}>
    {children}
  </div>
);
