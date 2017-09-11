import React from 'react';
import { connect } from 'react-redux';

import CreateCollection from '../create-collection-form';
import Fade from '../../components/fade';

import { isSelectionOpen } from './selectors';

const Selection = ({ isOpen }) => (
  <Fade>
    { isOpen ?
      <div className="wgsa-genome-selection-dropdown mdl-shadow--2dp">
        <CreateCollection visible />
      </div> :
      null }
  </Fade>
);

function mapStateToProps(state) {
  return {
    isOpen: isSelectionOpen(state),
  };
}

export default connect(mapStateToProps)(Selection);
