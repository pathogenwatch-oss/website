import React from 'react';

import ViewDetailsButton from './ViewDetailsButton.react';
import RemoveButton from './RemoveButton.react';

export default ({ name }) => (
  <footer className="wgsa-card-footer">
    <ViewDetailsButton name={name} />
    <RemoveButton name={name} />
  </footer>
);
