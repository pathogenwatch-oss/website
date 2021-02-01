import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { selectAll } from './actions';
import { getSelectionStatus, isSelectAllDisabled } from './selectors';

const iconsByStatus = {
  UNCHECKED: 'check_box_outline_blank',
  CHECKED: 'check_box',
  INDETERMINATE: 'indeterminate_check_box',
};

function getTitle(status, disabled) {
  if (disabled) {
    return '"Select All" is not available on the unfiltered list, please select at least one filter.';
  }
  return status === 'CHECKED' ? 'Remove from selection' : 'Add to selection';
}

const SelectAll = ({ status, disabled, select }) => {
  const [ loading, setLoading ] = React.useState(false);
  return (
    <button
      className={classnames('wgsa-genome-checkbox', { 'wgsa-blink': loading })}
      onClick={() => {
        setLoading(true);
        select().then(() => setLoading(false));
      }}
      disabled={disabled}
      title={getTitle(status, disabled)}
    >
      <i className="material-icons">{iconsByStatus[status]}</i>
    </button>
  );
};

function mapStateToProps(state) {
  return {
    status: getSelectionStatus(state),
    disabled: isSelectAllDisabled(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    select: () => dispatch(selectAll()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectAll);
