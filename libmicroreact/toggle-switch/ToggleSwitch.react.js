import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import FormField from 'react-mdc-web/lib/FormField';
import Switch from 'react-mdc-web/lib/Switch';

const ToggleSwitch = ({ id, ...props }) => {
  const handleOnChange = () => props.onChange(!props.isChecked);
  return (
    <FormField
      className={classnames(
        'libmr-ToggleSwitch',
        props.className,
        { 'is-checked': props.isChecked }
      )}
      id={id}
    >
      <label>{props.label}</label>
      <Switch
        checked={props.isChecked}
        onChange={handleOnChange}
      />
    </FormField>
  );
};

ToggleSwitch.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isChecked: PropTypes.bool,
  label: PropTypes.node,
  onChange: PropTypes.func,
};

export default ToggleSwitch;
