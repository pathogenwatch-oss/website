import React from 'react';

import SpeciesTree from './SpeciesTree.react';
import Subtree from './Subtree.react';

import SubtreeStore from '^/stores/SubtreeStore';

export default React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },

  getInitialState() {
    return {
      subtree: null,
    };
  },

  componentDidMount() {
    SubtreeStore.addChangeListener(this.handleSubtreeStoreChange);
  },

  componentWillUnmount() {
    SubtreeStore.removeChangeListener(this.handleSubtreeStoreChange);
  },

  render() {
    if (this.state.subtree) {
      return (
        <Subtree treeName={this.state.subtree} />
      );
    }

    // Somehow the props prevent the tree from being remounted on each update
    return (
      <SpeciesTree dimensions={this.props} />
    );
  },

  handleSubtreeStoreChange() {
    this.setState({
      subtree: SubtreeStore.getActiveSubtreeId(),
    });
  },

});
