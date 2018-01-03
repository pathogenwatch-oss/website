import React from 'react';
import { connect } from 'react-redux';

import Selection from '../list';
import Collection from '../collection';
import Download from '../download';
import Fade from '../../../components/fade';

import { getSelectionDropdownView, getSelectionSize } from '../selectors';

const EmptySelection = (
  <div style={{ padding: '0 16px' }}>
    <h3>No Genomes Selected.</h3>
    <p>You can select genomes with the following methods:</p>
    <ul className="bulleted">
      <li><strong>Checkboxes</strong> in the List view</li>
      <li><strong>Lasso</strong> in the Map view</li>
      <li><strong>Checkbox</strong> in the Detail view</li>
    </ul>
  </div>
);

const Dropdown = ({ view, hasSelection }) => (
  <Fade>
    { view ?
      <div className="wgsa-genome-selection-dropdown mdl-shadow--2dp">
        { !hasSelection && EmptySelection }
        { hasSelection && view === 'selection' && <Selection />}
        { hasSelection && view === 'collection' && <Collection />}
        { hasSelection && view === 'download' && <Download />}
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
