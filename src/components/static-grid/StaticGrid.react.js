import React from 'react';
import classnames from 'classnames';

export default ({ items, template, keyProp, density = 'comfortable' }) => (
  <div className={classnames('wgsa-static-grid', `wgsa-${density}-grid`)}>
    {items.map(item =>
      React.createElement(template, { key: item[keyProp], item }))}
  </div>
);
