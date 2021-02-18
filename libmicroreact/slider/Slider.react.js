
/* global componentHandler */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const LibmrSlider = ({ id, ...props }) => (
  <div
    className={classnames(
      'libmr-Slider',
      props.className,
    )}
    style={{
      '--min': props.min,
      '--max': props.max,
      '--val': props.value,
      ...props.style,
    }}
  >
    <label htmlFor={id}>
      {props.label}: {props.displayValue || props.value}{props.unit}
    </label>
    <input
      id={id}
      type="range"
      min={props.min}
      max={props.max}
      value={props.value}
      onChange={e => props.onChange(parseInt(e.target.value, 10))}
    />
    <span className="libmr-Slider-focus-ring" />
  </div>
);

LibmrSlider.propTypes = {
  className: PropTypes.string,
  displayValue: PropTypes.number,
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  unit: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.number.isRequired,
};

export default LibmrSlider;
