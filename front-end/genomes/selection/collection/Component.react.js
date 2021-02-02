import React from 'react';
import { connect } from 'react-redux';

import CreateCollection from '../../create-collection-form';
import Limiter from '../Limiter.react';

import { toggleDropdown } from '../actions';

const Collection = ({ goBack }) => (
  <div className="wgsa-genome-collection">
    <header className="wgsa-dropdown-header">Create Collection</header>
    <Limiter type="maxCollectionSize">
      <CreateCollection />
    </Limiter>
    <footer className="wgsa-dropdown-footer">
      <button className="mdl-button" onClick={goBack}>
        Go back
      </button>
    </footer>
  </div>
);

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(toggleDropdown('selection')),
  };
}

export default connect(null, mapDispatchToProps)(Collection);
