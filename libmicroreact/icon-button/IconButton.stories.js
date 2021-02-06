import React from 'react';

import IconButton from './index';

export default {
  title: 'Buttons/Icon Button',
};

export const Default = () => (
  <IconButton>
    <i className="material-icons">close</i>
  </IconButton>
);

Default.story = {
  name: 'default',
};
