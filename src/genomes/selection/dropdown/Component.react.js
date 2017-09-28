import React from 'react';
import { connect } from 'react-redux';

import Selection from '../list';
import CreateCollection from '../../create-collection-form';
import Download from '../download';
import Fade from '../../../components/fade';

import { getSelectionDropdownView, getSelectionSize } from '../selectors';

const EmptySelection = (
  <div>
    <p><strong>No Genomes Selected.</strong></p>
    <p>Please select genomes by one of the following methods:</p>
    <ul className="bulleted">
      <li>Checkboxes in the List view</li>
      <li>Lasso on the Map view</li>
      <li>Checkbox on the Detail view</li>
    </ul>
  </div>
);

const Dropdown = ({ view, hasSelection }) => (
  <Fade>
    { view ?
      <div className="wgsa-genome-selection-dropdown mdl-shadow--2dp">
        { !hasSelection && EmptySelection }
        { hasSelection && view === 'selection' && <Selection />}
        { hasSelection && view === 'collection' && <CreateCollection />}
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
