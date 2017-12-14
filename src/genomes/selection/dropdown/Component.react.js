import React from 'react';
import { connect } from 'react-redux';

import Selection from '../list';
import CreateCollection from '../../create-collection-form';
import Download from '../download';
import Fade from '../../../components/fade';
import SelectionTabs from './SelectionTabs.react';

import { getSelectionDropdownView, getSelectionSize } from '../selectors';

const EmptySelection = (
  <div>
    <h3>No Genomes Selected.</h3>
    <p>You can genomes using the following methods:</p>
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
        { hasSelection && <SelectionTabs /> }
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
