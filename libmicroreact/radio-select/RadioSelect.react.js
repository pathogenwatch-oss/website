import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import RadioButton from '../radio-button';

const RadioSelect = (props) => (
  <div className={classnames('libmr-RadioSelect', props.className)}>
    <ul>
      {
        props.items.map(item => (
          <li key={item.value}>
            <RadioButton
              id={item.value}
              onChange={props.onChange ? () => props.onChange(item.value) : null}
              label={item.label}
              checked={props.value === item.value || item.selected || false}
            />
          </li>
        ))
      }
      {props.children}
    </ul>
  </div>
);

RadioSelect.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      selected: PropTypes.bool,
    }),
  ),
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default RadioSelect;
