import React from 'react';
import classnames from 'classnames';

import Menu from '../menu';

const DropdownMenu = (props) => (
  <Menu
    {...props}
    className={classnames('libmr-DropdownMenu', props.className)}
  />
);

DropdownMenu.propTypes = { ...Menu.propTypes };

export default DropdownMenu;
