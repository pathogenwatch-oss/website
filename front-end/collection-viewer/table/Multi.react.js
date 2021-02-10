import React from 'react';
import { connect } from 'react-redux';

import ControlsButton from '@cgps/libmicroreact/controls-button';

import { isAMRTableVisible } from '../layout/selectors';
import { getTableState } from './selectors';
import { toggleMulti } from './actions';

function mapStateToProps(state) {
  return {
    visible: isAMRTableVisible(state),
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
    <ControlsButton
      active={active}
      className="pw-multi-button"
      onClick={() => toggle()}
      title="Toggle 'All/Any' colouring when multiple colmns selected "
    >
      ALL
    </ControlsButton>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonGroup);

