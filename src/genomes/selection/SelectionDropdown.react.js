import React from 'react';
import { connect } from 'react-redux';

import Selection from './Selection.react';
import CreateCollection from '../create-collection-form';
import Fade from '../../components/fade';

import { getSelectionDropdownView } from './selectors';

const Dropdown = ({ view }) => (
  <Fade>
    { view ?
      <div className="wgsa-genome-selection-dropdown mdl-shadow--2dp">
        { view === 'selection' && <Selection />}
        { view === 'collection' && <CreateCollection visible />}
        { view === 'download' && <h1>Download</h1>}
      </div> :
      null }
  </Fade>
);

function mapStateToProps(state) {
  return {
    view: getSelectionDropdownView(state),
  };
}

export default connect(mapStateToProps)(Dropdown);
