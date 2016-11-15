import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { getVisibleTree } from './selectors';
import { timeTravel } from './actions';

const History = React.createClass({

  propTypes: {
    tree: React.PropTypes.object,
    onClick: React.PropTypes.func,
  },

  getInitialState() {
    return {
      open: false,
    };
  },

  isActive({ state }) {
    const { tree } = this.props;
    return state.type === tree.type && state.root === tree.root;
  },

  render() {
    const { tree } = this.props;
    const { open } = this.state;

    return (
      <div
        className={classnames(
          'wgsa-tree-history',
          { 'wgsa-tree-history--open': open }
        )}
      >
        <button
          className="wgsa-tree-history__tab mdl-button"
          onClick={() => this.setState({ open: !open })}
        >
          History
        </button>
        <div className="wgsa-tree-history-snapshots wgsa-tree-overlay">
          { tree.history.map(snapshot =>
            <button key={`${snapshot.id}`}
              className={classnames(
                'wgsa-tree-history__snapshot',
                { 'wgsa-tree-history__snapshot--active': this.isActive(snapshot) }
              )}
              onClick={() => this.props.onClick(snapshot.state)}
              style={{ backgroundImage: `url(${snapshot.imgUrl})` }}
            >
            </button>
          )}
        </div>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    tree: getVisibleTree(state),
  };
}

function mapDispatchToProps(dispatch, { stateKey }) {
  return {
    onClick: snapshot => dispatch(timeTravel(stateKey, snapshot)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(History);
