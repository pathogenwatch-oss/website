import React from 'react';
import { connect } from 'react-redux';

import Selection from '../list';
import CreateCollection from '../../create-collection-form';
import Download from '../download';
import Fade from '../../../components/fade';

import { getSelectionDropdownView, getSelectionSize } from '../selectors';

const Dropdown = ({ view, hasSelection }) => (
  <Fade>
    { view && hasSelection ?
      <div className="wgsa-genome-selection-dropdown mdl-shadow--2dp">
        { view === 'selection' && <Selection />}
        { view === 'collection' && <CreateCollection />}
        { view === 'download' && <Download />}
      </div> :
      null }
  </Fade>
);

function mapStateToProps(state) {
  return {
    hasSelection: getSelectionSize(state) > 0,
    view: getSelectionDropdownView(state),
  };
}

export default connect(mapStateToProps)(Dropdown);
