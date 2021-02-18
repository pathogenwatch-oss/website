import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Checkbox from '../checkbox';

function toggleOrderedSelection(selectionOrder, toggledValue, isChecked) {
  const newSelection = [];
  for (const value of selectionOrder) {
    if (value !== toggledValue) {
      newSelection.push(value);
    }
  }
  if (isChecked) {
    newSelection.push(toggledValue);
  }
  return newSelection;
}

/* eslint max-params: 0 */
function toggleSelection(items, toggledItem, isChecked, selectionOrder) {
  if (selectionOrder) {
    return toggleOrderedSelection(selectionOrder, toggledItem.value, isChecked);
  }
  const newSelection = [];
  for (const item of items) {
    if (item.value === toggledItem.value) {
      if (isChecked) newSelection.push(item.value);
      else continue;
    }
    if (item.selected) {
      newSelection.push(item.value);
    }
  }
  return newSelection;
}

const MultiSelect = (props) => (
  <div className={classnames('libmr-MultiSelect', props.className)}>
    <ul>
      {
        props.items.map(item => (
          <li key={item.value}>
            <Checkbox
              id={item.value}
              checked={item.selected}
              label={item.label}
              onChange={(event) => props.onSelectionChange(toggleSelection(props.items, item, event.target.checked, props.selectionOrder))}
            />
            <button
              className="only-toggle"
              onClick={() => props.onSelectionChange([ item.value ])}
            >
              Only
            </button>
          </li>
        ))
      }
    </ul>
  </div>
);

MultiSelect.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
      selected: PropTypes.bool,
    }),
  ),
  onSelectionChange: PropTypes.func,
  selectionOrder: PropTypes.array,
};

export default MultiSelect;
