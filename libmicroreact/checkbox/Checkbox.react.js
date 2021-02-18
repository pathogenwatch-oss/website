import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import FormField from 'react-mdc-web/lib/FormField';
import Checkbox from 'react-mdc-web/lib/Checkbox';

const FormCheckbox = ({ className, id, onChange, checked, children, label = children }) => (
  <FormField id={id} className={classnames('libmr-Checkbox', className)}>
    <Checkbox
      onChange={onChange}
      checked={checked}
    />
    <label>{label}</label>
  </FormField>
);

FormCheckbox.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.node,
  onChange: PropTypes.func,
};

export default FormCheckbox;

