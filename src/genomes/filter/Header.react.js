import React from 'react';
import { connect } from 'react-redux';

import { toggleFilter } from './actions';
import { isFilterOpen } from './selectors';

const Header = ({ isOpen, onClick }) => (
  <div className="wgsa-filter-header">
    <button
      className="mdl-button mdl-button--icon"
      onClick={onClick}
      title={isOpen ? 'Hide Filter' : 'Show Filter'}
    >
      <i className="material-icons">tune</i>
    </button>
  </div>
);

function mapStateToProps(state) {
  return {
    isOpen: isFilterOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(toggleFilter()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
