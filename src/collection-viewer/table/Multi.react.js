import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { isAMRTable, getTableState } from './selectors';
import { toggleMulti } from './actions';

function mapStateToProps(state) {
  return {
    visible: isAMRTable(state),
    active: getTableState(state).multi,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggle: () => dispatch(toggleMulti()),
  };
}

const ButtonGroup = ({ visible, active, toggle }) => {
  if (!visible) return null;

  return (
    <div className="wgsa-button-group mdl-shadow--2dp">
      <button
        className={classnames('wgsa-button-group__item', { active })}
        onClick={() => toggle()}
        title={'Toggle Multiple Resistance'}
      >
        Multi
      </button>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonGroup);

