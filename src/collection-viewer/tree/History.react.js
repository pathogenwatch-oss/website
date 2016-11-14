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

  isActive({ type, root }) {
    const { tree } = this.props;
    return type === tree.type && root === tree.root;
  },

  render() {
    const { tree } = this.props;

    return (
      <div
        className={classnames(
          'wgsa-tree-history',
          { 'wgsa-tree-history--open': this.state.open }
        )}
      >
        { tree.history.map(item =>
          <button key={item}
            className={classnames(
              'wgsa-tree-history__item',
              { 'wgsa-tree-history__item--active': this.isActive(item) }
            )}
            onClick={() => this.props.onClick(item)}
          >
            {JSON.stringify(item)}
          </button>
        )}
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
    onClick: item => dispatch(timeTravel(stateKey, item)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(History);
