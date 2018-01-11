import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Selection from '../list';
import Collection from '../collection';
import Download from '../download';
import Fade from '../../../components/fade';

import { getSelectionDropdownView, getSelectionSize } from '../selectors';

const EmptySelection = (
  <div style={{ padding: '16px 32px' }}>
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
        { hasSelection ?
          <ReactCSSTransitionGroup
            transitionName={view === 'selection' ? 'slide-right' : 'slide-left'}
            transitionEnterTimeout={280}
            transitionLeaveTimeout={280}
          >
            {view === 'selection' && <Selection />}
            {view === 'collection' && <Collection />}
            {view === 'download' && <Download />}
          </ ReactCSSTransitionGroup> :
          EmptySelection }
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
