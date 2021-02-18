import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import IconButton from '../icon-button';

const ControlsButton = ({ className, active, ...props }) => (
  <IconButton
    {...props}
    className={classnames('libmr-ControlsButton', { active }, className)}
  />
);

ControlsButton.propTypes = {
  ...IconButton.props,
  active: PropTypes.bool,
};

export default ControlsButton;
