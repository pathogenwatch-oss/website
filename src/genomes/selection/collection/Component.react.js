import React from 'react';
import { connect } from 'react-redux';

import CreateCollection from '../../create-collection-form';

import { toggleDropdown } from '../actions';

const Collection = ({ toggle }) => (
  <div className="wgsa-genome-collection">
    <header className="wgsa-dropdown-header">Create Collection</header>
    <CreateCollection />
    <footer className="wgsa-dropdown-footer">
      <button
        className="mdl-button"
        onClick={() => toggle('selection')}
      >
        Go back
      </button>
    </footer>
  </div>
);

function mapDispatchToProps(dispatch) {
  return {
    toggle: (view) => dispatch(toggleDropdown(view)),
  };
}

export default connect(null, mapDispatchToProps)(Collection);
