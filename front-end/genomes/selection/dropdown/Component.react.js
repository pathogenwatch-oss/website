import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import Selection from '../list';
import Collection from '../collection';
import Download from '../download';
import Edit from '../edit';
import Fade from '../../../components/fade';

import { getSelectionDropdownView, getSelectionSize } from '../selectors';

const EmptySelection = (
  <div className="wgsa-selection-message">
    <h3>No genomes selected</h3>
    <p>
      In the <strong>List</strong> view, select genomes by clicking a row. Try
      selecting one genome and holding <strong>shift</strong> to select more.
    </p>
    <p>
      In the <strong>Map</strong> view, select genomes by using the lasso tool.
    </p>
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
      <Fade out>
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
