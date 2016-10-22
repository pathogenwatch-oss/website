import React from 'react';
// import classnames from 'classnames';

import Drawer from '../drawer';

export default ({ assembly, onClose, ...props }) => (
  <Drawer
    {...props}
    isOpen
    onClose={onClose}
  >
    { assembly &&
      <h2 className="wgsa-assembly-details-title">{assembly.name}</h2>
    }
  </Drawer>
);
