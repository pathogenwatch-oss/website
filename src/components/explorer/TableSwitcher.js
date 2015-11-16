import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import Switch from '../Switch.react';

import { setTable } from '^/actions/table';

const style = {
  position: 'absolute',
  zIndex: 2,
  transform: 'translateY(-50%)',
  left: 16,
};

const TableSwitcher = React.createClass({

  displayName: 'TableSwitcher',

  propTypes: {
    top: React.PropTypes.number,
    handleClick: React.PropTypes.func,
  },

  render() {
    const { top, handleClick } = this.props;
    return (
      <div style={assign({ top }, style)} className="wgsa-switch-background mdl-shadow--2dp">
        <Switch
          id="table-switcher"
          left={{ title: 'Metadata', icon: 'list' }}
          right={{ title: 'Resistance Profile', icon: 'local_pharmacy' }}
          onChange={handleClick} />
      </div>
    );
  },

});

function mapDispatchToProps(dispatch) {
  return {
    handleClick: (checked) =>
      dispatch(setTable(checked ? 'resistanceProfile' : 'metadata')),
  };
}

export default connect(null, mapDispatchToProps)(TableSwitcher);
