import React from 'react';
import PropTypes from 'prop-types';

import FormField from 'react-mdc-web/lib/FormField';
import { Radio } from 'react-mdc-web/lib/Radio';

const FormRadioButton = (props) => (
  <FormField id={props.id} className="libmr-RadioButton">
    <Radio
      onChange={props.onChange}
      checked={props.checked}
    />
    <label>{props.label}</label>
  </FormField>
);

FormRadioButton.propTypes = {
  checked: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

export default FormRadioButton;

