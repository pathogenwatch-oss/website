import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { getSelectionDropdownView, getSelectionSize } from '../selectors';

import { toggleDropdown } from '../actions';

const buttons = [
  { key: 'selection', label: 'Manage' },
  { key: 'collection', label: 'Create Collection' },
  { key: 'download', label: 'Download' },
];

const Dropdown = ({ view, toggle }) => (
  <div className="wgsa-button-group">
    <i className="material-icons">visibility</i>
    {buttons.map(({ key, label }) =>
      <button
        key={key}
        onClick={() => toggle(key)}
        className={classnames(
          'wgsa-button-group__item',
          { active: key === view }
        )}
      >
        {label}
      </button>
    )}
  </div>
);

function mapStateToProps(state) {
  return {
    hasSelection: getSelectionSize(state) > 0,
    view: getSelectionDropdownView(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggle: (view) => dispatch(toggleDropdown(view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);
