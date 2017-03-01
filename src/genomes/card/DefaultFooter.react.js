import React from 'react';

import AddToSelectionButton from './AddToSelectionButton.react';
import ViewDetailsButton from './ViewDetailsButton.react';
import RemoveButton from './RemoveButton.react';

export default genome => (
  <footer className="wgsa-card-footer">
    <AddToSelectionButton genome={genome} />
    <ViewDetailsButton genome={genome} />
    <RemoveButton genome={genome} className="wgsa-icon-button--small" />
  </footer>
);
