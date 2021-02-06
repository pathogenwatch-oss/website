import './index.css';

import React from 'react';

export { default } from './Menu.react';

export const withState = Component =>
  props => {
    const [ open, setOpen ] = React.useState(false);
    return React.createElement(Component, {
      ...props,
      open,
      toggle: () => setOpen(!open),
    });
  };
