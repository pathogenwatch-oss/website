import React from 'react';
import classnames from 'classnames';

export const Totals = React.memo(({ visible, total, itemType }) => (
  <p className="wgsa-filter-summary__count">
    Viewing <span>{visible.toLocaleString()}</span> of {total.toLocaleString()}{' '}
    {itemType}
    {total !== 1 ? 's' : ''}
  </p>
));

export const Summary = ({ className, children }) => (
  <div
    className={classnames('wgsa-filter-summary wgsa-content-margin', className)}
  >
    {children}
  </div>
);
