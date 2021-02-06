import React from 'react';

import ControlsButton from './index';

export default {
  title: 'Buttons/Controls Button',
};

export const Default = () => (
  <ControlsButton>
    <i className="material-icons">tune</i>
  </ControlsButton>
);

export const Active = () => (
  <ControlsButton active>
    <i className="material-icons">tune</i>
  </ControlsButton>
);
