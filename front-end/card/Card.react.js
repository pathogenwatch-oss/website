import React from 'react';
import classnames from 'classnames';

export default ({ className, children }) => (
  <article className={classnames('wgsa-card', className)}>
    { children }
  </article>
);
