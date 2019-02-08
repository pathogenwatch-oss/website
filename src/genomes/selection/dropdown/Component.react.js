import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Selection from '../list';
import Collection from '../collection';
import Download from '../download';
import Edit from '../edit';
import Fade from '../../../components/fade';

import { getSelectionDropdownView, getSelectionSize } from '../selectors';

const EmptySelection = (
  <div className="wgsa-selection-message">
    <h3>No Genomes Selected</h3>
    <p>You can select genomes with the following methods:</p>
    <ul className="bulleted">
      <li>
        <strong>Checkboxes</strong> in the List view
      </li>
      <li>
        <strong>Lasso</strong> in the Map view
      </li>
      <li>
        <strong>Checkbox</strong> in the Detail view
      </li>
    </ul>
  </div>
);

const Dropdown = React.createClass({
  getInitialState() {
    return {
      slideDirection: null,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.view === 'selection' && nextProps.view === 'edit') {
      return this.setState({ slideDirection: 'right' });
    }
    if (this.props.view === 'edit' && nextProps.view === 'selection') {
      return this.setState({ slideDirection: 'left' });
    }
    if (nextProps.view === 'selection') {
      return this.setState({ slideDirection: 'right' });
    }
    return this.setState({ slideDirection: 'left' });
  },

  render() {
    const { view, hasSelection } = this.props;
    return (
      <Fade>
        {view ? (
          <div className="wgsa-genome-selection-dropdown mdl-shadow--2dp">
            {hasSelection ? (
              <ReactCSSTransitionGroup
                transitionName={`slide-${this.state.slideDirection}`}
                transitionEnterTimeout={280}
                transitionLeaveTimeout={280}
              >
                {view === 'selection' && <Selection />}
                {view === 'collection' && <Collection />}
                {view === 'download' && <Download />}
                {view === 'edit' && <Edit />}
              </ReactCSSTransitionGroup>
            ) : (
              EmptySelection
            )}
          </div>
        ) : null}
      </Fade>
    );
  },
});

function mapStateToProps(state) {
  return {
    hasSelection: getSelectionSize(state) > 0,
    view: getSelectionDropdownView(state),
  };
}

export default connect(mapStateToProps)(Dropdown);
